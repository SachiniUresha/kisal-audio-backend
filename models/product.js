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
        dimentions:{
            type:Number,
            required:true
        },
        discription:{
            type:Number,
            required:true
        },
        availability:{
            type:Boolean,
            required:true,
            default:true
        }
    }
)