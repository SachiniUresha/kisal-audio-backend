import express from "express";
import { addMessage, getMessages, deleteMessage } from "../controller/messageController.js";

const router = express.Router();

// POST - add message
router.post("/", addMessage);

// GET - get all messages (admin use)
router.get("/", getMessages);

// DELETE - delete message
router.delete("/:id", deleteMessage);

export default router;
