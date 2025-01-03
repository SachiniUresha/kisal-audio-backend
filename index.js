import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import userRouter from "./routes/userRouter.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();




let app = express();

app.use(bodyParser.json());

let mongoUrl = process.env.MONGO_URL

mongoose.connect(mongoUrl);

let connection = mongoose.connection;

connection.once("open",()=>{
    console.log("MongoDB connection established successfully...");
})

app.use("/api/users",userRouter)

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
});



