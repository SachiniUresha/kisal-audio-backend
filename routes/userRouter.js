import express from "express";
import { loginUser, registerUser } from "../controller/userController.js";

const userRouter = express.Router()

userRouter.post("/",registerUser)

userRouter.post("/login",loginUser)

export default userRouter;

/*"email": "sachini2@gmail.com",
"password": "123",
"role": "customer",*/

/*"email": "sachini1@gmail.com",
"password": "123",
"role": "admin",*/