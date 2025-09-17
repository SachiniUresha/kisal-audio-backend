import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        key:{
            type:String,
            required:true,
            unique:true
        },
        name:{
            type:String,
            required:true
        },
        price:{
            type:Number,
            required:true
        },
        category:{
            type:String,
            required:true,
            default:"uncategorized"
        },
        dimensions:{
            type:String,
            required:false
        },
        description:{
            type:String,
            required:false
        },
        availability:{
            type:Boolean,
            required:true,
            default:true
        },
        image:{
            type:[String],//add multiple images
            required:true,
            default:["https://www.google.com/url?sa=i&url=https%3A%2F%2Fapollobattery.com.au%2Fproduct%2Fns40rs%2F&psig=AOvVaw2QOZEnojvuGutWgp25iWYW&ust=1736752252323000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCKDg4LXR74oDFQAAAAAdAAAAABAE"]
        }
    }
)

const Product = mongoose.model("Product",productSchema);

export default Product;