import Product from "../models/product.js";
import { isItAdmin } from "./userController.js";
import jwt from "jsonwebtoken";

export async function addProduct(req,res){

    console.log(req.user);

    if(req.user=="null"){
        res.status(401).json({
            message:"Please login and try again..."
        })
        return;
    }

    if(req.user.role !="admin"){
        res.status(403).json({
            message:"You are not authorized to perform this action..."
        })
        return;
    }

    const data=req.body;
    const newProduct = new Product(data);

    try{
       await newProduct.save();
       res.json({
            message:"Product registered successfully..."
       })
    }catch(error){
        console.log(error)
        res.status(500).json({
            error:"Product registration failed..."
        })
    }
}

export async function getProducts(req,res){

    /*let isAdmin=isItAdmin(req);

    if(req.user!="null" && req.user.role == "admin"){
        isAdmin=true;
    }*/
console.log(req.user);
   try{

    if(isItAdmin(req)){
        const products = await Product.find();// No filter, fetches all products
        res.json(products);
        return;
    }else{
        const products = await Product.find({availability:true});
        res.json(products);
        return;        
    }
   

   }catch(error){
    res.status(500).json({
        message:"Failed to get products..."
    })
   }
}


export async function updateProduct(req,res){
    try{
        if(isItAdmin(req)){
            
            const key = req.params.key //take the key came across with the url

            const data = req.body;

            await Product.updateOne({key:key},data)

            //after updating
            res.json({
                message:"Product updated successfully..."
            })
        }else{
            res.status(403).json({
                message:"You are not authorized to perform this action"
            })
        }

    }catch(error){
        res.status(500).json({
            message:"Failed to update product "
        })

    }
}

export async function deleteProduct(req,res){
    try{

        if(isItAdmin(req)){

            const key = req.params.key;
            await Product.deleteOne({key:key})

            res.json({
                message:"Product deleted successfully"
            })

        }else{
            res.status(403).json({
                message:"You are no authorized to perform this action"
            })
        }

    }catch(error){
        res.status(500).json({
            message:"Failed to delete product"
        })
    }
}

export async function getProduct(req, res){
    
    try{
        const key = req.params.key;
        const product = await Product.findOne({
            key:key
        })
        if(product==null){
            res.status(404).json({
                message:"Product not Found"
            })
            return;
        }
        res.json(product);
        return;
        
    }catch(e){
        res.status(500).json({
            message:"Failed to get product"
        })

    }
}

