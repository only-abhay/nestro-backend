import dotenv from "dotenv";
import ConnectDb from "./config/categoryDB.js";
import cors from "cors";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";

import CategoryRouter from "./routers/Category.router.js";
import RoomRouter from "./routers/RoomType.js";
import MaterialRouter from "./routers/Material.js";
import Productrouter from "./routers/Product.router.js";
import UserRouter from "./routers/user.router.js";
import CartRouter from "./routers/cart.router.js";
import OrderRouter from "./routers/order.router.js";
import TransactionRouter from "./routers/transaction.router.js";

dotenv.config();

const app = express();

// HTTP Server
const server = http.createServer(app);

// ------------------------------------
// Allowed Frontend Origins
// ------------------------------------
const allowedOrigins = (
  "http://localhost:3000",
  "https://nestro-frontend-nmcr.vercel.app"
)
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

// ------------------------------------
// CORS
// ------------------------------------
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests without origin
    // e.g. Postman/server-to-server
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },

  credentials: true,
};

// Express CORS
app.use(cors(corsOptions));

// Cookie Parser
app.use(cookieParser());

// JSON
app.use(express.json());

// ------------------------------------
// Socket.IO
// ------------------------------------
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

// ------------------------------------
// Routes
// ------------------------------------

app.use("/category", CategoryRouter);

app.use("/room-type", RoomRouter);

app.use("/material", MaterialRouter);

app.use("/product", Productrouter);

app.use("/user", UserRouter);

app.use("/cart", CartRouter);

app.use("/order", OrderRouter);

app.use("/transaction", TransactionRouter);

// ------------------------------------
// Socket Events
// ------------------------------------

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.on("orderPlaced", (orderId) => {
    console.log("Order Placed:", orderId);

    // Send order notification to all connected clients
    io.emit("orderReceived", orderId);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
  });
});

// ------------------------------------
// Start Server
// ------------------------------------

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);

  ConnectDb();
});