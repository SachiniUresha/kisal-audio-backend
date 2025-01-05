import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({

    email:{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:true,
    },
    rating:{
        type:String,
        required:true
    },
    Comment:{
        type:String,
        required:true
    
    },
    date:{
        type:String,
        defult: Date.now() 
    },
    profilePicture:{
        type:String,
        default: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
    },
    isApproved:{
        type:Boolean,
        default:false
    }

})

const Review = mongoose.model("Review",reviewSchema);

export default Review;