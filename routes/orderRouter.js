import express from 'express';
 import { createOrder } from '../controller/orderController.js';

const orderRouter = express.Router();

orderRouter.post("/",createOrder);
orderRouter.post("/quote",createOrder);
orderRouter.get("/",createOrder);

export default orderRouter;
