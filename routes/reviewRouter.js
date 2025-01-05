import express from "express";
import { addReview, getReviews,deleteReview,updateReview } from "../controller/reviewController.js";

const reviewRouter = express.Router();

reviewRouter.post("/",addReview);
reviewRouter.get("/",getReviews);
reviewRouter.delete("/:email",deleteReview);
reviewRouter.put("/approve/:email",updateReview);

export default reviewRouter;