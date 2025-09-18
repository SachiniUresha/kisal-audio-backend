import express from 'express';
 import { approveOrRejectOrder, createOrder, getOrders, getQuote, getOrderStats } from '../controller/orderController.js';

const orderRouter = express.Router();

orderRouter.post("/",createOrder);
orderRouter.post("/quote",getQuote);
orderRouter.get("/",getOrders);
orderRouter.put("/status/:orderId", approveOrRejectOrder);
orderRouter.get("/stats", getOrderStats);


export default orderRouter;
