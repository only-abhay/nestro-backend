import CartModel from "../models/cart.model.js";
import UserModel from "../models/user.model.js";
import {
  AlreadyExist,
  Created,
  InternalServerError,
  NotFound,
} from "../utils/response.js";

const Synccart = async (req, res) => {
  try {
    const { cart_data, user_id } = req.body;

    for (const item of cart_data) {
      const existingCart = await CartModel.findOne({
        userId: user_id,
        productId: item.id,
      });

      if (existingCart) {
        existingCart.quantity += item.qty;
        await existingCart.save();
      } else {
        await CartModel.create({
          userId: user_id,
          productId: item.id,
          quantity: item.qty,
        });
      }
    }

    const latestCart = await CartModel.find({
      userId: user_id,
    }).populate("productId");

    return res.status(200).json({
      success: true,
      message: "Cart synced successfully",
      cart: latestCart,
    });
  } catch (error) {
    console.error("Sync Cart Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const AddCart = async (req, res) => {
  try {
    const { productId, qty } = req.body;

    const userId = req.user._id;

    const existingCart = await CartModel.findOne({
      userId,
      productId,
    });

    if (existingCart) {
      existingCart.quantity += qty || 1;
      await existingCart.save();
    } else {
      await CartModel.create({
        userId,
        productId,
        quantity: qty || 1,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product Added",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export {
    Synccart,
    AddCart
}