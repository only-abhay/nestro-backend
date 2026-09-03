import dotenv from "dotenv";
import ConnectDb from "./config/categoryDB.js";
import cors from "cors";
import express from "express";
import http from "http";
import { Server } from "socket.io";

import CategoryRouter from "./routers/Category.router.js";
import RoomRouter from "./routers/RoomType.js";
import MaterialRouter from "./routers/Material.js";
import Productrouter from "./routers/Product.router.js";
import UserRouter from "./routers/user.router.js";
import CartRouter from "./routers/cart.router.js";
import OrderRouter from "./routers/order.router.js";
import TransactionRouter from "./routers/transaction.router.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

// HTTP Server
const server = http.createServer(app);

// Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

app.use("/category", CategoryRouter);
app.use("/room-type", RoomRouter);
app.use("/material", MaterialRouter);
app.use("/product", Productrouter);
app.use("/user", UserRouter);
app.use("/cart", CartRouter);
app.use("/order", OrderRouter);
app.use("/transaction", TransactionRouter);

// Socket Events
io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.on("orderPlaced", (orderId) => {
      
    // admin pe response bhejna 
    io.emit("orderReceived", orderId)
  });
});

// Listen
server.listen(process.env.PORT, () => {
  ConnectDb();
  console.log(`Server is listening ${process.env.PORT}`);
});