
import OrderModel from "../models/order.model.js";

export const Checkidempotency = async (req, res, next) => {
  try {
    const key = req.headers["idempotency-key"];

    if (!key) {
      return res
        .status(400)
        .json({ success: false, message: "Idempotency-Key header required" });
    }

    // ✅ Exact schema field names use karo
    const order = await OrderModel.findOne({
      userId: req.user.id,
      Idempotency_Key: key,
    });

    if (order) {
      // Duplicate — error nahi, existing order successfully replay karo
      return res.status(200).json({
        success: true,
        message: "Order already placed",
        orderId: order._id,
        order_id: order._id,
        razorpay_order_id: order.rozarPay_order_id, // schema mein field yahi naam hai
      });
    }

    req.idempotencyKey = key;
    next();
  } catch (error) {
    console.error("Error checking idempotency key:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};