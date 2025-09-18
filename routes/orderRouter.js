import express from 'express';
 import { approveOrRejectOrder, createOrder, getOrders, getQuote, getOrderStats, getMyOrders } from '../controller/orderController.js';

const orderRouter = express.Router();

orderRouter.post("/",createOrder);
orderRouter.post("/quote",getQuote);
orderRouter.get("/",getOrders);
orderRouter.put("/status/:orderId", approveOrRejectOrder);
orderRouter.get("/stats", getOrderStats);
orderRouter.get("/myOrders", getMyOrders);



export default orderRouter;
