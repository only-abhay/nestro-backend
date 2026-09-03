import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    number: {
      type: String,
      default: null,
    },

    otp: {
      type: String
    },

    otpExpire: {
      type: Date,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    status: {
      type: Boolean,
      default: true,
    },

    role: {
      type: String,
      enum: ["user", "admin" , "superadmin"],
      default: "user",
    },

    addresses:{
    type :[
          {
        fullName: {
          type: String,
          trim: true,
          required:true   
     },

        phone: {
          type: String,
          trim: true,
          required:true   

        },

        addressLine: {
          type: String,
          required: true,
          trim: true,
          required:true   

        },

        city: {
          type: String,
          required: true,
          trim: true,
          required:true   

        },

        state: {
          type: String,
          required: true,
          trim: true,
          required:true   

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
          required:true   

        },

        addressType: {
          type: String,
          enum: ["Home", "Office", "Other"],
          default: "Home",
        },

        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ]

    },

    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const UserModel =
  mongoose.models.User || mongoose.model("User", UserSchema);

export default UserModel;