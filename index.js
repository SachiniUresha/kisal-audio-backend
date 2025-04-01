import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import userRouter from "./routes/userRouter.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import reviewRouter from "./routes/reviewRouter.js";
import productRouter from "./routes/productRouter.js";
import inquiryRouter from "./routes/inquiryRouter.js";
import cors from "cors";
import orderRouter from "./routes/orderRouter.js";

dotenv.config();

let app = express();

app.use(cors());



app.use(bodyParser.json());

app.use((req, res, next)=>{
    let token = req.header("Authorization")
    console.log(token)
    //created the auh

    if(token!= null){
        token = token.replace("Bearer ","")
        jwt.verify(token, process.env.JWT_SECRET,(err, decoded)=>{

            if(!err){
                req.user=decoded;
                console.log(token);
                console.log(decoded);
                //next();

            }
            //next();

        });
        //next();

    }
    next();
    }
)

let mongoUrl = process.env.MONGO_URL

mongoose.connect(mongoUrl);

let connection = mongoose.connection;

connection.once("open",()=>{
    console.log("MongoDB connection established successfully...");
})

app.use("/api/users",userRouter);
app.use("/api/reviews",reviewRouter);
app.use("/api/products",productRouter);
app.use("/api/inquiries",inquiryRouter);
app.use("/api/orders" , orderRouter);

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
});



