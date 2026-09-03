import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate cart entries for the same user and product
cartSchema.index({ userId: 1, productId: 1 }, { unique: true });

const CartModel =
  mongoose.models.Cart || mongoose.model("Cart", cartSchema);

export default CartModel;