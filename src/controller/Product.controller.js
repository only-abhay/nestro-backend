import ProductModel from "../models/Product.model.js";
import RoomTypeModel from "../models/room-type.js";
import CategoryModel from "../models/category.model.js";
import MaterialModel from "../models/Material.js";

import {
  AlreadyExist,
  Created,
  InternalServerError,
  NotFound,
} from "../utils/response.js";

 const Create = async (req, res) => {
  try {
    const {
      roomID,
      categroyID,
      MaterialID,
      name,
      slug,
      originalPrice,
      salePrice,
      description,
      sortdescription,
      dimensions,
      weight,
      featured,
      BestSeller,
      newArrival,
      color,
      stock,
      status,
    } = req.body;

    const existingProduct = await ProductModel.findOne({ slug });

    if (existingProduct) {
      return AlreadyExist(res, "Product already exists.");
    }

    const thumbnail = req.file?.path
    // Create Product


    const product = await ProductModel.create({
      roomID,
      categroyID,
      MaterialID,

      name,
      slug,

      originalPrice,
      salePrice,

      description,
      sortdescription,

      dimensions,

      weight,

      featured,
      BestSeller,
      newArrival,

      color,

      thumbnail,

      stock,
      status,
    });

    return Created(res, "Product created successfully.");
  } catch (error) {
    console.log(error.message)

    return InternalServerError(
      res,
      "Internal Server Error",
      error.message
    );
  }
};


const Read = async (req, res) => {
  try {
    const query= req.query
    const filter = {}
    let sortby ={}
 const page = parseInt(query.page) || 1;
const limit = query.limit ? parseInt(query.limit) : 3;
const skip = (page - 1) * limit || 0;
    if(query.status) filter.status = query.status ==="true"
    if(query.stock) filter.stock = query.stock ==="inStock"
    if(query.newArrival) filter.newArrival = query.newArrival ==="true"
    if(query.bestSeller) filter.bestSeller = query.bestSeller ==="true"
    if(query.featured) filter.featured = query.featured ==="true"

 if(query.sort === "asc"){
   sortby = { salePrice: 1 }
}

if(query.sort === "desc"){
   sortby = { salePrice: -1 }
}

if(query.sort === "newest"){
   sortby = { createdAt: -1 }
}

   const Total = await ProductModel.find().countDocuments()
     if(query.category){
      const categoryIDS = await CategoryModel.find({slug:{$in:query.category.split(",")}}).select("_id")
      filter.categroyID = {$in:categoryIDS}
    }
     if(query.room){
      const roomIDS = await RoomTypeModel.find({slug:{$in:query.room.split(",")}}).select("_id")
      filter.roomID = {$in:roomIDS}
    }
       if(query.material){
      const materialIDS = await MaterialModel.find({slug:{$in:query.material.split(",")}}).select("_id")
      filter.MaterialID = {$in:materialIDS}
    }
   if(query.min && query.max){
    filter.salePrice = {$gte: parseInt(query.min) , $lte: parseInt(query.max) }
   }
    const Product = await ProductModel.find(filter).sort(sortby).limit(limit).skip(skip).populate([
      {
    path: "roomID",
    select: "_id name slug",
  },
  {
    path: "categroyID",
    select: "_id name slug",
  },
  {
    path: "MaterialID",
    select: "_id name slug",
  },
    ]);
    res.status(200).json({
      messege: "Data Fetched",
      success: true,
      Product,
      Total :Total,
      pages : Math.ceil(Total/limit)
    });
  } catch (error) {
    return InternalServerError(res, "internal server error", error);
    
  }
};

const ReadById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await ProductModel.findById(id)
      .populate("roomID")
      .populate("categroyID")
      .populate("MaterialID");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      product,
    });
  } catch (error) {
    return InternalServerError(res, "Internal server error", error);
  }
};

const UpdatebyId = async (req, res) => {
  try {
    const { id } = req.params;

    const Product = await ProductModel.findById({ _id: id });
    if (!Product) {
      return NotFound(res, "Category Not found");
    }
    const NewProduct = await ProductModel.findByIdAndUpdate(id, {
      status: !Product.status,
    });

    res.status(200).json({
      messege: "Status Updated",
      success: true,
      NewProduct,
    });
  } catch (error) {
    return InternalServerError(res, error);
  }
};
const deletebyId = async (req, res) => {
  try {
    const { id } = req.params;
  

    const Product = await ProductModel.findById({ _id: id });
    if (!Product) {
      return NotFound(res, "Category Not found");
    }
    await ProductModel.findByIdAndDelete(id);
    return Created(res, "Category Deleted");
  } catch (error) {
    return InternalServerError(res, "internal server error", error);
  }
};


const StatusUpdatebyid = async (req, res) => {
  try {
    const { id } = req.params;
    const {flag}= req.body
    const Product = await ProductModel.findById({ _id: id });
    if (!Product) {
      return NotFound(res, "Category Not found");
    }
    const updatedProduct = await ProductModel.findByIdAndUpdate(
  id,
  {
    [flag]: !Product[flag],
  },
  { new: true }
);

    res.status(200).json({
      messege: "Status Updated",
      success: true,
      updatedProduct,
    });
  } catch (error) {
    return InternalServerError(res, error);
  }
};
const AddImage = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await ProductModel.findById(id);

    if (!product) {
      return NotFound(res, "Product not found");
    }

    if (!req.files || req.files.length === 0) {
      return NotFound(res, "Images not found");
    }

    // Cloudinary URLs (IMPORTANT)
    const newImages = req.files.map((file) => file.path);

    product.images = [
      ...(product.images || []),
      ...newImages
    ];

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Images uploaded successfully",
      images: product.images,
    });

  } catch (error) {
    return InternalServerError(res, "Internal server error", error);
  }
};

export { Read, deletebyId, UpdatebyId , ReadById , Create , StatusUpdatebyid, AddImage};
