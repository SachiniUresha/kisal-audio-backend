import Review from "../models/review.js";


export function addReview(req,res){

    //checking is that user is login into the system. user with token
    if(req.user==null){
        res.status(401).json({
            message:"Please login and try  again..."
        })
        return;
    }

    const data= req.body;

    data.name = req.user.firstName+" "+req.user.lastName;
    data.email = req.user.email;
    console.log(data);
    
    const newReview= new Review(data); //create a review to save in the database

    //save the review
    newReview.save().then(()=>{
        res.json({
            message:"Review added successfully..."
        })
    }).catch((error)=>{
            res.status(500).json({
                error:"Error addition failed..."
            })
        })
}

export function getReviews(req,res){

    const user = req.user;
    console.log("User:", user);


    if(user==null || user != "admin"){

        Review.find({
            isApproved : true
        }).then((reviews)=>{
            res.json(reviews);
        })
        
    }

    if (user.role == "admin"){
        Review.find().then((reviews)=>
            res.json(reviews)
        ).catch((error) => {
            console.error("Error fetching reviews:", error);
            res.status(500).json({ message: "Error fetching reviews." });
        });
    }
}

export function deleteReview(req,res){

    const email = req.params.email;

    //check login
    if(req.user==null){
        res.status(401).json({
            message:"Please login and try again..."
        });
        return
    }

    //user=admin
    if(req.user.role=="admin"){

        Review.deleteOne({
        email:email
    }).then(()=>{
        res.json({
            message: "Review deleted successfully..."
        })
    }).catch(()=>{
        res.status(500).json({
            error:"Review deletion failed..."
        })
        
    })
    return 
    }

    //user=customer
    if(req.user.role=="customer"){

        if(req.user.email==email){
            Review.deleteOne({
                email:email
            }).then(()=>{
                res.json({
                    message: "Review deleted successfully..."
                })
            }).catch(()=>{
                res.status(500).json({
                    error:"Review deletion failed..."
                })
            })
                
        }else{
            res.status(403).json({
                message:"You are not authorized to perform this action"
            })

        }
    }


}

export function approveReview(req,res){

    const email = req.params.email;

    if(req.user==null){
        res.status(401).json({
            message:"Please login and try again..."
            
        })
        return
    }

    if(req.user.role=="admin"){
        Review.updateOne({
            //2 jsons
            email:email //1 json - who is going to be updated

        },{
            //2 json = what is the update
            isApproved:true
        
        }).then(()=>{
            res.json({
                message:"Review approved successfully..."
            });
        }).catch(()=>{
            res.status(500).json({
                error:"Review approval failed"
            })
        })
    }else{
        res.status(403).json({
            message:"You are not an admin. Only admins can approve the reviews"
        })
    }
}