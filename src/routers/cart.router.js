import express from "express";
 import { Synccart , AddCart } from "../controller/cart.controller.js";
 import Protect from "../middleware/protect.js";
const CartRouter = express.Router()

CartRouter.post("/sync-cart",Synccart)

CartRouter.post("/add", Protect, AddCart);

export default CartRouter
