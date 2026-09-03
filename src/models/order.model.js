import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    product_detail: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },

        price: {
          type: Number,
          required: true,
        },

        qty: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],

    address: {
      fullName: {
        type: String,
        trim: true,
        required: true,
      },

      phone: {
        type: String,
        trim: true,
        required: true,
      },

      addressLine: {
        type: String,
        required: true,
        trim: true,
        required: true,
      },

      city: {
        type: String,
        required: true,
        trim: true,
        required: true,
      },

      state: {
        type: String,
        required: true,
        trim: true,
        required: true,
      },

      country: {
        type: String,
        default: "India",
        trim: true,
      },

      pincode: {
        type: String,
        required: true,
        trim: true,
        required: true,
      },

      addressType: {
        type: String,
        enum: ["Home", "Office", "Other"],
        default: "Home",
      },
    },
    rozarPay_order_id: {
      type: String,
      default: null,
    },
    rozarPay_transaction_id: {
      type: String,
      default: null,
    },

    payment_mode: {
      type: Number,
      enum: [0, 1], // 0 = Postpaid, 1 = Prepaid
      required: true,
      default: 1,
    },
    payment_status: {
      type: Number,
      enum: [0, 1],
      default: 0, // 0: Pending, 1: Done
    },

    total_amount: {
      type: Number,
      required: true,
    },

    order_status: {
      type: Number,
      enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      default: 0, // 0:Placed, 1:Packed, 2:Dispatched, 3:Shipped, 4:At Your Nearest Store, 5:Out for Delivery, 6:Delivered, 7:Return Initiated, 8:Returned, 9:Refunded
    },
        Idempotency_Key: {
          type: String,
          required: true,
        },
    order_logs: [
      {
        status: {
          type: Number,
          required: true,
          // 0:Placed, 1:Packed, 2:Dispatched, 3:Shipped,
          // 4:At Your Nearest Store, 5:Out for Delivery,
          // 6:Delivered, 7:Return Initiated,
          // 8:Returned, 9:Refunded
        },

        message: {
          type: String,
          required: true,
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
    
      },
    ],
  },
  {
    timestamps: true,
  },
);

OrderSchema.index(
  {
    userId: 1,
    Idempotency_Key: 1,
  },
  { 
    unique: true,
  },
); // Create a unique index on the idempotency key in order_logs

// order status change log
OrderSchema.pre("save", function () {
  if (this.isModified("order_status")) {
    this.order_logs.push({
      status: this.order_status,
      message: `Order status changed to ${this.order_status}`,
      createdAt: new Date(),
    });
  }
});
const OrderModel =
  mongoose.models.Order || mongoose.model("Order", OrderSchema);

export default OrderModel;
