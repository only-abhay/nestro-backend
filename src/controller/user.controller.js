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

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
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

    return Created(res, "Registration successful. Please verify OTP.");
  } catch (error) {
    return InternalServerError(res, "Internal Server Error", error);
  }
};
const Read = async (req, res) => {
  try {
    const users = await UserModel.find();

    return Created(res, "Users fetched successfully", users);
  } catch (error) {
    return InternalServerError(res, "Internal Server Error", error);
  }
};

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return BadRequest(res, "Email and password are required");
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return NotFound(res, "User not found");
    }

    if (!user.isVerified) {
      return Unauthorized(res, "Please verify your email first");
    }
    if(user.role == "admin"){
       user = await UserModel.findOneAndUpdate(
        { email },
        {  role: "user" },
      );
    }
    const decryptPass = cryptr.decrypt(user.password);

    if (decryptPass !== password) {
      return Unauthorized(res, "Invalid email or password");
    }

    const token = generateToken(user);

    res.cookie("jwt", token, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    return Created(res, "Login successful", user._id);
  } catch (error) {
    return InternalServerError(res, "Internal Server Error", error);
  }
};
const VerifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return BadRequest(res, "Email and OTP are required");
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

    return Created(res, "OTP verified successfully");
  } catch (error) {
    return InternalServerError(res, "Internal Server Error", error);
  }
};
const deletebyId = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await UserModel.findById(id);

    if (!user) {
      return NotFound(res, "User not found");
    }

    await UserModel.findByIdAndDelete(id);

    return Created(res, "User deleted successfully");
  } catch (error) {
    return InternalServerError(res, "Internal Server Error", error);
  }
};

const GetProfile = async (req, res) => {
  try {
    const user = req.user;
    console.log(user)

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
    console.log(error);
    return InternalServerError(res, "Internal Server Error", error);
  }
};

const Logout = async (req, res) => {
  try {
    console.log()
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password, loginAsAdmin } = req.body;

    if (!email || !password) {
      return BadRequest(res, "Email and password are required");
    }

    // Find user
    let user = await UserModel.findOne({ email });

    if (!user) {
      return NotFound(res, "User not found");
    }

    // Password check
    const decryptPass = cryptr.decrypt(user.password);

    if (decryptPass !== password) {
      return Unauthorized(res, "Invalid email or password");
    }

    // Admin login selected
    if (loginAsAdmin == true) {
      user = await UserModel.findOneAndUpdate(
        { email },
        {  role: "admin" },
      );

      if (!user) {
        return NotFound(res, "User not found");
      }
    }
    // Admin check
    if (user.role !== "admin") {
      return Unauthorized(res, "Only Admin can login");
    }

    // Generate token with updated user
    const token = generateToken(user);

    // Set cookie
    res.cookie("jwt", token, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });

    return Created(res, "Admin Login successful");

  } catch (error) {
    console.error("Admin Login Error:", error);

    return InternalServerError(
      res,
      "Internal Server Error",
      error
    );
  }
};


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

    if (!fullName || !phone || !addressLine || !city || !state || !pincode) {
      return res.status(400).json({
        success: false,
        message: "All required fields are mandatory.",
      });
    }

    // If new address is default,
    // remove default from all previous addresses.
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
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const ResendOTP = async (req, res) => {
  try {
    return Created(res, "Data Created");
  } catch (error) {
    return InternalServerError(res, "internal Server Error", error);
  }
};

const ForgotPassword = async (req, res) => {
  try {
    return Created(res, "Data Created");
  } catch (error) {
    return InternalServerError(res, "internal Server Error", error);
  }
};

const ResetPassword = async (req, res) => {
  try {
    return Created(res, "Data Created");
  } catch (error) {
    return InternalServerError(res, "internal Server Error", error);
  }
};

const UpdateAddress = async (req, res) => {
  try {
    return Created(res, "Data Created");
  } catch (error) {
    return InternalServerError(res, "internal Server Error", error);
  }
};

const DeleteAddress = async (req, res) => {
  try {
    return Created(res, "Data Created");
  } catch (error) {
    return InternalServerError(res, "internal Server Error", error);
  }
};

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
