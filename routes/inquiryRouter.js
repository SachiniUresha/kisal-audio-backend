import express from "express";
import { addInquiry, deleteInquiry, getInquiries, updateInqury } from "../controller/inquiryController.js";

const inquiryRouter = express.Router();

inquiryRouter.post("/",addInquiry);
inquiryRouter.get("/",getInquiries);
inquiryRouter.delete("/:id",deleteInquiry);
inquiryRouter.put("/:id",updateInqury);

export default inquiryRouter;
