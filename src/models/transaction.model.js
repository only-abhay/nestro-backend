import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    paymentMode: {
      type: Number,
      enum: [0, 1], // 0 = Pay on Delivery, 1 = Prepaid
      required: true
    },
    status: {
      type: Number,
      enum: [0,1,2,3],  //'pending', 'completed', 'failed', 'refunded'
      default: 0
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true
    },
    currency: {
      type: String,
      default: 'INR'
    },
  },
  {
    timestamps: true
  }
);

const TransactionModel = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);
export default TransactionModel;