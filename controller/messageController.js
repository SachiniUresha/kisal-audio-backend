import Message from "../models/message.js";

// Add new message
export async function addMessage(req, res){
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({ success: false, error: "All fields are required" });
    }

    const newMessage = new Message({ name, email, phone, message });
    await newMessage.save();

    res.status(201).json({ success: true, message: "Message sent successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get all messages (for admin)
export async function getMessages(req, res){
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete a message
export async function deleteMessage(req, res){
  try {
    const { id } = req.params;
    await Message.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Message deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
