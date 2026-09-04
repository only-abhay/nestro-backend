import express from "express";
import { Authorized, Protect } from "../middleware/protect.js";


import {
  Register,
  Login,
  VerifyOTP,
  ResendOTP,
  ForgotPassword,
  ResetPassword,
  AddAddress,
  UpdateAddress,
  DeleteAddress,
  Read,
  deletebyId,
  GetProfile,
  Logout,
  adminLogin
} from "../controller/user.controller.js";

const UserRouter = express.Router();

// Authentication
UserRouter.post("/register", Register);
UserRouter.get("/get", Read);
UserRouter.post("/login", Login);
UserRouter.post("/adminlogin", adminLogin);
UserRouter.delete("/delete/:id", deletebyId);
UserRouter.get("/get-me",Protect, GetProfile);
UserRouter.get("/logout", Logout);
UserRouter.post("/verify-otp", VerifyOTP);
UserRouter.post("/resend-otp", ResendOTP);
UserRouter.post("/forgot-password", ForgotPassword);
UserRouter.post("/reset-password", ResetPassword);

// Address
UserRouter.post("/address",Protect, AddAddress);
UserRouter.put("/address/:addressId", UpdateAddress);
UserRouter.delete("/address/:addressId", DeleteAddress);


export default UserRouter;