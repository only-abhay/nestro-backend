import express from "express";
const OrderRouter = express.Router()
import { createOrder , verifyPayment ,Read , ReadById} from "../controller/order.controller.js";
import { Protect } from "../middleware/protect.js";
import { Checkidempotency } from "../middleware/idempotency.js";

// routes/order.routes.js
OrderRouter.post("/create-order", Protect, Checkidempotency, createOrder);
OrderRouter.post("/verify-payment",Protect, verifyPayment)
OrderRouter.get("/get-orders" ,Protect,Read)
OrderRouter.get("/get-orders/:id",ReadById)
export default OrderRouter