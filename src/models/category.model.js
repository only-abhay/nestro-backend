import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
    {
        name : {
            type:String,
            unique : true,
            trim: true,
            minlength:3,
            maxlength:20,
            required:true,
        },

    slug: {
      type: String,
      required: [true, "Slug is required"],
      trim: true,
      lowercase: true,
      unique: true,
    },

    image: {
      type: String,
      default:null,
    },

    status: {
      type: Boolean,
      default: true,
    },
    },
    {
      timestamps:true
    }
)

const CategoryModel= mongoose.model("Category",CategorySchema)

export default CategoryModel