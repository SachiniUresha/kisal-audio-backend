import Inquiry from "../models/inquiry.js";
import { isItAdmin, isItCustomer } from "./userController.js";

export async function addInquiry(req, res) {
  try {
    if (isItCustomer(req)) {
      const data = req.body;

      data.email = req.user.email; //adding manually
      data.phone = req.user.phone;

      //generating id
      let id = 0;

      const inquiries = await Inquiry.find().sort({ id: -1 }).limit(1);

      if (inquiries.length == 0) {
        id = 1;
      } else {
        id = inquiries[0].id + 1;
      }

      //saving the inquiry
      data.id = id;

      const newInquiry = new Inquiry(data);
      const response = await newInquiry.save();

      res.json({
        message: "Inquiry added successfully",
        id: response.id,
      });
    } else {
      res.status(403).json({
        message: "You are not authorized to perform this action",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Failed to add inquiry",
    });
  }
}

export async function getInquiries(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "User not authenticated", // Respond with 401 for missing or invalid token
      });
    }

    if (isItCustomer(req)) {
      const inquiries = await Inquiry.find({ email: req.user.email });
      res.json(inquiries);
      return; //stop the program running at here
    } else if (isItAdmin(req)) {
      const inquiries = await Inquiry.find();
      res.json(inquiries);
      return;
    } else {
      res.status(403).json({
        message: "You are not authorized to perform this action",
      });
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to get inquiries",
    });
  }
}

export async function deleteInquiry(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "User not authenticated", // Respond with 401 for missing or invalid token
      });
    }

    if (isItAdmin(req)) {
      const id = req.params.id;

      await Inquiry.deleteOne({ id: id });
      res.json({
        message: "Inquiry deleted successfully",
      });
      return;
    } else if (isItCustomer(req)) {
      const id = req.params.id;

      const inquiry = await Inquiry.findOne({ id: id });

      if (inquiry == "null") {
        res.status(404).json({
          message: "Inquiry not found",
        });
        return;
      } else if (inquiry.email == req.user.email) {
        await Inquiry.deleteOne({ id: id });
        res.json({
          message: "Inqury deleted successfully",
        });
        return;
      } else {
        res.status(403).json({
          message: "Yo are not authorized to perform this action",
        });
        return;
      }
    } else {
      res.status(403).json({
        message: "Yo are not authorized to perform this action",
      });
      return;
    }
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete inquiry",
    });
  }
}

export async function updateInqury(req, res) {
  try {
    if (isItAdmin(req)) {
      const id = req.params.id;
      const data = req.body;

      await Inquiry.updateOne({ id: id }, data);
      res.json({
        message: "Induiry updated successflly",
      });
      return;
    } else if (isItCustomer(req)) {
      const id = req.params.id;
      const data = req.body;

      const inquiry = await Inquiry.findOne({ id: id });

      if (inquiry == null) {
        res.status(404).json({
          meaasage: "Inquiry not found",
        });
        return;
      } else {
        if (inquiry.email == req.user.email) {
          await Inquiry.updateOne({ id: id }, { message: data.message }); //can only change message
          res.json({
            message: "Induiry updated successflly",
          });
          return;
        } else {
          res.status(403).json({
            message: "You are not auhorized tto perform this action",
          });
          return;
        }
      }
    }else{
        res.status(403).json({
            message: "Yo are not authorized to perform this action",
          });
          return;
    }
  } catch (error) {
    res.status(500).json({
      message: "Failed to update inquiry",
    });
  }
}
