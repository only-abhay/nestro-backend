import Cryptr from "cryptr";
const cryptr = new Cryptr(process.env.SECRET_KEY_FOR_ENCRPT);

import UserModel from "../models/user.model.js";

import {
  AlreadyExist,
  BadRequest,
  Created,
  InternalServerError,
  NotFound,
  Unauthorized,
} from "../utils/response.js";

import { SendOtpMail } from "../utils/nodemailer.js";
import { generateToken } from "../utils/helper.js";


// =====================================================
// COOKIE OPTIONS
// =====================================================

const cookieOptions = {
  maxAge: 30 * 24 * 60 * 60 * 1000,
  httpOnly: true,

  // Vercel + Render different domains hain
  secure: true,
  sameSite: "none",

  path: "/",
};


// =====================================================
// REGISTER
// =====================================================

const Register = async (req, res) => {
  try {
    const { name, email, password, number } = req.body;

    if (!name || !email || !password || !number) {
      return BadRequest(res, "All fields are required");
    }

    const user = await UserModel.findOne({ email });

    if (user) {
      return AlreadyExist(res, "Email already exists");
    }

    const encryptedPass = cryptr.encrypt(password);

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const otpExpire = Date.now() + 3 * 60 * 1000;

    const mailSent = await SendOtpMail(email, otp);

    if (!mailSent) {
      return InternalServerError(res, "OTP mail not sent");
    }

    await UserModel.create({
      name,
      email,
      password: encryptedPass,
      number,
      otp,
      otpExpire,
    });

    return Created(
      res,
      "Registration successful. Please verify OTP."
    );

  } catch (error) {
    console.error("Register Error:", error);

    return InternalServerError(
      res,
      "Internal Server Error",
      error
    );
  }
};


// =====================================================
// READ USERS
// =====================================================

const Read = async (req, res) => {
  try {
    const users = await UserModel.find();

    return Created(
      res,
      "Users fetched successfully",
      users
    );

  } catch (error) {
    return InternalServerError(
      res,
      "Internal Server Error",
      error
    );
  }
};


// =====================================================
// LOGIN
// =====================================================

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return BadRequest(
        res,
        "Email and password are required"
      );
    }

    let user = await UserModel.findOne({ email });

    if (!user) {
      return NotFound(res, "User not found");
    }

    if (!user.isVerified) {
      return Unauthorized(
        res,
        "Please verify your email first"
      );
    }

    // -----------------------------------------------
    // Password check
    // -----------------------------------------------

    const decryptPass = cryptr.decrypt(user.password);

    if (decryptPass !== password) {
      return Unauthorized(
        res,
        "Invalid email or password"
      );
    }

    // -----------------------------------------------
    // Normal user login
    // -----------------------------------------------

    // Agar admin normal login kare,
    // usko user bana rahe ho.
    if (user.role === "admin") {
      user = await UserModel.findOneAndUpdate(
        { email },
        { role: "user" },
        { new: true }
      );
    }

    // -----------------------------------------------
    // Generate JWT
    // -----------------------------------------------

    const token = generateToken(user);

    // -----------------------------------------------
    // Set Cookie
    // -----------------------------------------------

    res.cookie(
      "jwt",
      token,
      cookieOptions
    );

    return Created(
      res,
      "Login successful",
      user._id
    );

  } catch (error) {
    console.error("Login Error:", error);

    return InternalServerError(
      res,
      "Internal Server Error",
      error
    );
  }
};


// =====================================================
// VERIFY OTP
// =====================================================

const VerifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return BadRequest(
        res,
        "Email and OTP are required"
      );
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return NotFound(res, "User not found");
    }

    if (user.otp !== otp) {
      return BadRequest(res, "Invalid OTP");
    }

    if (user.otpExpire < Date.now()) {
      return BadRequest(res, "OTP expired");
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpire = undefined;

    await user.save();

    return Created(
      res,
      "OTP verified successfully"
    );

  } catch (error) {
    console.error("Verify OTP Error:", error);

    return InternalServerError(
      res,
      "Internal Server Error",
      error
    );
  }
};


// =====================================================
// DELETE USER
// =====================================================

const deletebyId = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await UserModel.findById(id);

    if (!user) {
      return NotFound(res, "User not found");
    }

    await UserModel.findByIdAndDelete(id);

    return Created(
      res,
      "User deleted successfully"
    );

  } catch (error) {
    console.error("Delete User Error:", error);

    return InternalServerError(
      res,
      "Internal Server Error",
      error
    );
  }
};


// =====================================================
// GET PROFILE
// =====================================================

const GetProfile = async (req, res) => {
  try {
    const user = req.user;

    console.log("Get Profile User:", user);

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
        user: null,
      });
    }

    if (user.role !== "user") {
      return res.status(403).json({
        message: "Access Denied",
        success: false,
        user: null,
      });
    }

    return res.status(200).json({
      message: "Data fetched successfully",
      success: true,
      user,
    });

  } catch (error) {
    console.error("Get Profile Error:", error);

    return InternalServerError(
      res,
      "Internal Server Error",
      error
    );
  }
};


// =====================================================
// LOGOUT
// =====================================================

const Logout = async (req, res) => {
  try {

    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });

  } catch (error) {
    console.error("Logout Error:", error);

    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};


// =====================================================
// ADMIN LOGIN
// =====================================================

const adminLogin = async (req, res) => {
  try {
    const {
      email,
      password,
      loginAsAdmin,
    } = req.body;

    if (!email || !password) {
      return BadRequest(
        res,
        "Email and password are required"
      );
    }

    let user = await UserModel.findOne({ email });

    if (!user) {
      return NotFound(res, "User not found");
    }

    // -----------------------------------------------
    // Password check
    // -----------------------------------------------

    const decryptPass = cryptr.decrypt(user.password);

    if (decryptPass !== password) {
      return Unauthorized(
        res,
        "Invalid email or password"
      );
    }

    // -----------------------------------------------
    // Admin login selected
    // -----------------------------------------------

    if (loginAsAdmin === true) {

      user = await UserModel.findOneAndUpdate(
        { email },
        { role: "admin" },
        { new: true }
      );

      if (!user) {
        return NotFound(res, "User not found");
      }
    }

    // -----------------------------------------------
    // Admin check
    // -----------------------------------------------

    if (user.role !== "admin") {
      return Unauthorized(
        res,
        "Only Admin can login"
      );
    }

    // -----------------------------------------------
    // Generate token
    // -----------------------------------------------

    const token = generateToken(user);

    // -----------------------------------------------
    // Set admin cookie
    // -----------------------------------------------

    res.cookie(
      "jwt",
      token,
      cookieOptions
    );

    return Created(
      res,
      "Admin Login successful"
    );

  } catch (error) {
    console.error(
      "Admin Login Error:",
      error
    );

    return InternalServerError(
      res,
      "Internal Server Error",
      error
    );
  }
};


// =====================================================
// ADD ADDRESS
// =====================================================

const AddAddress = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      addressLine,
      city,
      state,
      country,
      pincode,
      addressType,
      isDefault,
    } = req.body;

    const user = req.user;

    if (
      !fullName ||
      !phone ||
      !addressLine ||
      !city ||
      !state ||
      !pincode
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All required fields are mandatory.",
      });
    }

    if (isDefault) {
      user.addresses.forEach((address) => {
        address.isDefault = false;
      });
    }

    user.addresses.push({
      fullName,
      phone,
      addressLine,
      city,
      state,
      country,
      pincode,
      addressType,
      isDefault,
    });

    await user.save();

    return res.status(201).json({
      success: true,
      message: "Address added successfully.",
      addresses: user.addresses,
    });

  } catch (error) {
    console.error("Add Address Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


// =====================================================
// RESEND OTP
// =====================================================

const ResendOTP = async (req, res) => {
  try {
    return Created(res, "Data Created");

  } catch (error) {
    return InternalServerError(
      res,
      "internal Server Error",
      error
    );
  }
};


// =====================================================
// FORGOT PASSWORD
// =====================================================

const ForgotPassword = async (req, res) => {
  try {
    return Created(res, "Data Created");

  } catch (error) {
    return InternalServerError(
      res,
      "internal Server Error",
      error
    );
  }
};


// =====================================================
// RESET PASSWORD
// =====================================================

const ResetPassword = async (req, res) => {
  try {
    return Created(res, "Data Created");

  } catch (error) {
    return InternalServerError(
      res,
      "internal Server Error",
      error
    );
  }
};


// =====================================================
// UPDATE ADDRESS
// =====================================================

const UpdateAddress = async (req, res) => {
  try {
    return Created(res, "Data Created");

  } catch (error) {
    return InternalServerError(
      res,
      "internal Server Error",
      error
    );
  }
};


// =====================================================
// DELETE ADDRESS
// =====================================================

const DeleteAddress = async (req, res) => {
  try {
    return Created(res, "Data Created");

  } catch (error) {
    return InternalServerError(
      res,
      "internal Server Error",
      error
    );
  }
};


// =====================================================
// EXPORT
// =====================================================

export {
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
  adminLogin,
};