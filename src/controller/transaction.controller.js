import TransactionModel from "../models/transaction.model.js";
import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";

const GetTransactions = async (req, res) => {
  try {
    const { query } = req.query;
    let filter = {};
    if (query) {
      const users = await UserModel.find({
        $or: [
          {
            name: {
              $regex: query,
              $options: "i",
            },
          },

          {
            email: {
              $regex: query,
              $options: "i",
            },
          },
        ],
      }).select("_id");

      const orders = await OrderModel.find({
        $or: [
          {
            _id: query.match(/^[0-9a-fA-F]{24}$/) ? query : null,
          },

          {
            userId: {
              $in: users.map((u) => u._id),
            },
          },
        ],
      }).select("_id");

      filter.$or = [
        {
          userId: {
            $in: users.map((u) => u._id),
          },
        },

        {
          orderId: {
            $in: orders.map((o) => o._id),
          },
        },

        {
          transactionId: {
            $regex: query,
            $options: "i",
          },
        },
      ];
    }
    const transaction = await TransactionModel.find(filter);

    const transactions = await TransactionModel.find(filter)
      .populate("userId")
      .populate("orderId")

      .sort({
        createdAt: -1,
      });

    console.log(transactions , "controller")

    return res.status(200).json({
      success: true,

      Transactions: transactions,
    });
  } catch (error) {
    console.log("Transaction Controller Error:", error);

    return res.status(500).json({
      success: false,

      message: error,
    });
  }
};

export default GetTransactions;
