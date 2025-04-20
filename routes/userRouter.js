import express from "express";
import { blockOrUnblockUser, getAllUsers, getUser, loginUser, loginWithGoogle, registerUser } from "../controller/userController.js";

const userRouter = express.Router()

userRouter.post("/",registerUser)

userRouter.post("/login",loginUser)

userRouter.get("/all", getAllUsers)

userRouter.put("/block/:email", blockOrUnblockUser)

userRouter.get("/", getUser)

userRouter.post("/google", loginWithGoogle)

export default userRouter;

/*"email": "sachini2@gmail.com",
"password": "123",
"role": "customer",*/

/*"email": "sachini1@gmail.com",
"password": "123",
"role": "admin",*/