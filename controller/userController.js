import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

export function registerUser(req,res){

    const data = req.body

    data.password = bcrypt.hashSync(data.password,10)
    
    const newUser = new User(data)

    newUser.save().then(()=>{
        res.json({
            message:"User registered successfully..."
        })
    }).catch((error)=>{
        res.status(500).json({
            error:"User registration failed..."
        })
    })
}

export function loginUser(req,res){

    const data=req.body;

    User.findOne({
        email:data.email
    }).then(
        (user)=>{

            console.log("User found:", user);

            if(user==null){
            res.status(404).json({error:"User not found..."})
            }else{
                if(user.isBlocked){
                    res.status(403).json({
                        error:"Your account is blocked. Please contact admin"
                    });
                    return;
                }

                const isPasswordCorrect = bcrypt.compareSync(data.password, user.password)

                if(isPasswordCorrect){

                    const token = jwt.sign({
                        firstName:user.firstName,
                        lastName:user.lastName,
                        email:user.email,
                        role:user.role,
                        profilePicture:user.profilePicture,
                        phone:user.phone
                    },process.env.JWT_SECRET);

                    res.json({message:"Login successful...", token:token, user:user})
                }else{
                    res.status(404).json({
                        error:"Login Filed..."
                    })
                }
            }
           
            })
        }
    
export function isItAdmin(req){
    
            let isAdmin=false;
        
            if(req.user!=null && req.user.role == "admin"){
                isAdmin=true;
            }
            return isAdmin;
        
        }

export function isItCustomer(req){

    let isCustomer = false;

    if(req.user!=null && req.user.role=="customer"){
        isCustomer = true;
    }

    return isCustomer;
}

export async function getAllUsers(req, res) {

    if(isItAdmin(req)){
        try{

            const users = await User.find();
            res.json(users);

        }catch(e){
            res.status(500).json({
                error: "Failed to get users"
            })
        }
    }else{
        res.status(403).json({
            error:"Unauthorized"
        })
    }
    
}

export async function blockOrUnblockUser(req,res) {

    const email = req.params.email;
    if(isItAdmin(req)){
        try{
            const user = await User.findOne(
                {
                    email: email
                }
            )

            if(user==null){
                res.status(404).json({
                    error:"User not found"
                });
                return;
            }
             
            const isBlocked = !user.isBlocked;

            await User.updateOne(
                {
                    email:email
                },
                {
                    isBlocked:isBlocked
                }
            );

            res.json({
                message:"User blocked/unblocked successfully"
            });

        }catch(e){
            res.status(500).json({error:"Failed to get user"});
        }

    }else{
        res.status(403).json({error: "Unauthorized"});
    }
    
}

export function getUser(req,res){
    if(req.user != null){
        res.json(req.user)
    }else{
        res.status(403).json({
            error:"Unauthorized"
        })
    }
}

export async function loginWithGoogle(req, res){

    const accessToken = req.body.accessToken;
    console.log(accessToken);
    try{
    const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo" , {
        headers:{
            Authorization: `Bearer ${accessToken}`
        }
    } );
    console.log(response.data);
    const user = await User.findOne({
        email:response.data.email
    });
    if(user!=null){
        const token = jwt.sign({
            firstName:user.firstName,
            lastName:user.lastName,
            email:user.email,
            role:user.role,
            profilePicture:user.profilePicture,
            phone:user.phone
        },process.env.JWT_SECRET);

    }else{
        const newUser = new User({
            email:response.data.email,
            password:"1234",
            firstName:response.data.given_name,
            lastName: response.data.family_name,
            address:"Not Given",
            phone:"Not Given",
            profilePicture: response.data.picture
        });
        const savedUser = await newUser.save();
        const token = jwt.sign(
            {
            firstName:savedUser.firstName,
            lastName:savedUser.lastName,
            email:savedUser.email,
            role:savedUser.role,
            profilePicture: savedUser.profilePicture,
            phone:savedUser.phone,
        },
        process.env.JWT_SECRET
      );
      res.json({message:"Login Successfull", token:token, user:savedUser});     
    }
}catch(e){
    console.log(e);
    res.status( 500).json ({
        error:"Failed to login   "
    }     )
}

}