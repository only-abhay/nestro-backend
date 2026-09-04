import OrderModel from "../models/order.model.js";
import cartmodel from "../models/cart.model.js";
import razorpay_instance from "../config/razorpay.js";
import crypto from "crypto";
import TransactionModel from "../models/transaction.model.js";
   import UserModel from "../models/user.model.js";
   import { InternalServerError } from "../utils/response.js";


const createOrder = async (req, res) => {
  try {
    const { paymentMethod, shippingAddress, shippingMethod } = req.body;
    const user_id = req.user._id;
    const Idempotency_Key = req.idempotencyKey;

    // Get Cart
    const cart_data = await cartmodel
      .find({ userId: user_id })
      .populate("productId", "salePrice name");

    if (!cart_data || cart_data.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty.",
      });
    }

    // Calculate Total
    const subtotal = cart_data.reduce((total, item) => {
      return total + item.productId.salePrice * item.quantity;
    }, 0);

    const shippingCharge = shippingMethod === 1 ? 499 : 0;
    const codCharge = paymentMethod === 0 ? 100 : 0;
    const tax = Math.round(subtotal * 0.05);

    const total_amount =
      subtotal +
      shippingCharge +
      codCharge +
      tax;

    // Product Details
    const product_details = cart_data.map((item) => ({
      productId: item.productId._id,
      name: item.productId.name,
      price: item.productId.salePrice,
      qty: item.quantity,
    }));

    // Create Order
    const newOrder = new OrderModel({
      userId: user_id,
      product_detail: product_details,
      address: shippingAddress,
      payment_mode: paymentMethod,
      total_amount,
      payment_status: paymentMethod === 0 ? 0 : 0,
      Idempotency_Key,
    });

    await newOrder.save();

    // ================= COD =================
    if (paymentMethod === 0) {

      await TransactionModel.create({
        orderId: newOrder._id,
        userId: user_id,
        amount: total_amount,
        paymentMode: 0, // COD
        status: 1, // Pending
        transactionId: `COD_${newOrder._id}`,
        currency: "INR",
      });

      await cartmodel.deleteMany({ userId: user_id });

      return res.status(200).json({
        success: true,
        message: "Order placed successfully.",
        orderId: newOrder._id,
      });
    }

    // ================= ONLINE PAYMENT =================
     console.log(total_amount)
    const options = {
      amount: total_amount * 100,
      currency: "INR",
      receipt: `Order_${newOrder._id}`,
    };

    const razorpayOrder = await razorpay_instance.orders.create(options);

    newOrder.razorpay_order_id = razorpayOrder.id;
    await newOrder.save();

    return res.status(200).json({
  success: true,
  message: "Order created successfully.",
  order_id: newOrder._id,
  razorpay_order_id: razorpayOrder.id,
  amount: total_amount,
});

  } catch (error) {
    console.error("Create Order Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
     const { rozarpay_response, order_id } = req.body;
     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = rozarpay_response;
     const user_id = req.user._id;

  
    const generated_signature = crypto
      .createHmac("sha256", process.env.ROZARPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

      if (generated_signature == razorpay_signature) {
    
  const order = await OrderModel.findOne({ _id: order_id});
         order.payment_status = 1; // Payment Done
         order.razorPay_transaction_id = razorpay_payment_id;
         await order.save();

         const newTransaction = new TransactionModel({
          orderId: order._id,
          userId: user_id,
            amount: order.total_amount,
            paymentMode: 1, // Prepaid
            status: 1, // Completed
            transactionId: razorpay_payment_id,
            currency: "INR",
          });
          await newTransaction.save();

          await cartmodel.deleteMany({ userId: user_id });

         res.status(200).json({
          success: true,
          message: "Payment verified and order updated successfully.",
          orderId: order._id,
        });

  }

  } catch (error) {
    console.error("Verify Payment Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const Read = async (req, res) => {
  try {
    const { query } = req.query;
    const filter = {};

if (query) {
  const users = await UserModel.find({
    $or: [
      { name: { $regex: query, $options: "i" } },
      { email: { $regex: query, $options: "i" } },
    ],
  }).select("_id");

  filter.$or = [
    { userId: { $in: users.map((u) => u._id) } },
    { "address.phone": { $regex: query } },
  ];
}

const Orders = await OrderModel.find(filter).populate("userId");
    const Total = await OrderModel.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: "Data Fetched",
      Orders,
      Total,
      pages: Math.ceil(Total / 10),
    });
  } catch (error) {
    return InternalServerError(res, "Internal Server Error", error);
  }
};
const ReadById = async (req, res) => {
  try {
    const { id } = req.params;

    const orders = await OrderModel.find({
      userId: id,
    }).populate("userId");

    const Total = await OrderModel.countDocuments();

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      Orders: orders, // [] agar data nahi hoga
      Total,
    });

  } catch (error) {
    return InternalServerError(res, "Internal Server Error", error);
  }
};
export { createOrder , verifyPayment , Read , ReadById};
