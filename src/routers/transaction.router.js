import express from "express";
import GetTransactions from "../controller/transaction.controller.js";


const TransactionRouter = express.Router();



TransactionRouter.get(
 "/get-transactions",
 GetTransactions
);



export default TransactionRouter;