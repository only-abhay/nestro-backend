import UserModel from "../models/user.model.js";
import { InternalServerError } from "../utils/response.js";
import jwt from "jsonwebtoken";

const Protect = async (req, res, next) => {
  try {
    let token = null;

    // Cookie Token

    if (req.cookies?.jwt) {
      token = req.cookies.jwt;
    }

    // Header Token

    if (!token && req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.SECRET_KEY_FOR_ENCRPT,
    );

    const user = await UserModel.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,

        message: "User not found",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log("JWT ERROR:", error);

    return res.status(401).json({
      success: false,

      message: "Invalid Token",
    });
  }
};

export default Protect;

const Authorized = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        messege: "forbidden",
        success: false,
      });
    }
    next();
  };
};

export { Protect, Authorized };
