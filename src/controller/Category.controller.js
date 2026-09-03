import CategoryModel from "../models/category.model.js";
import {
  AlreadyExist,
  Created,
  InternalServerError,
  NotFound,
} from "../utils/response.js";

const Create = async (req, res) => {
  try {
    console.log(req.body)
    const { name, slug } = req.body;

    const category = await CategoryModel.findOne({ name: name });
    if (category) {
      return AlreadyExist(res, "Category Already Exist");
    }
    const categories = await CategoryModel.create({
      name: name,
      slug: slug,
     image: req.file?.path, 
    });
   return Created(res, "category Created");
  } catch (error) {
    console.log(error)

    return InternalServerError(res, error);
  }
};



const Allupdate = async (req,res)=>{
try {
  const {id} = req.params;

  const{name,slug}= req.body

  const category = CategoryModel.findById({_id:id})
  if(!category) return  NotFound( res,"Data Not Found")

    const Updatedata = {
      name,
      slug,
    }
if(req.file){
  Updatedata.image = req.file.path
}

    const UpdatedData = await CategoryModel.findByIdAndUpdate(id,
     Updatedata,
      {new : true}
    )
    res.status(200).json({
      messege: "data Updated Succesfully",
      success : true,
     UpdatedData
    })

  
} catch (error) {
    return InternalServerError(res, error);
  
}
}


const Read = async (req, res) => {
  try {
     const query = req.query
     const filter = {}
     if(query.status) filter.status = query.status ==="true"
     const limit = query.limit ? parseInt(req.query.limit) : 0
    const categories = await CategoryModel.find(filter).limit(limit);
       const Total = await CategoryModel.find().countDocuments()

    res.status(200).json({
      messege: "Data Fetched",
      success: true,
      categories,
       Total :Total,
      pages : Math.ceil(Total/10)
    });
  } catch (error) {
    return InternalServerError(res, "internal server error", error);
  }
};


const ReadById = async (req, res) => {
  const {id}= req.params;
  try {
    const category = await CategoryModel.findById({_id:id});
    res.status(200).json({
      messege: "Data Fetched",
      success: true,
      category,
    });
  } catch (error) {
    return InternalServerError(res, "internal server error", error);
  }
};


const UpdatebyId = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await CategoryModel.findById({ _id: id });
    if (!category) {
      return NotFound(res, "Category Not found");
    }
    const NewCategory = await CategoryModel.findByIdAndUpdate(id, {
      status: !category.status,
    });

    res.status(200).json({
      messege: "Status Updated",
      success: true,
      NewCategory,
    });
  } catch (error) {
    return InternalServerError(res, error);
  }
};
const deletebyId = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await CategoryModel.findById({ _id: id });
    if (!category) {
      return NotFound(res, "Category Not found");
    }
    await CategoryModel.findByIdAndDelete(id);
    return Created(res, "Category Deleted");
  } catch (error) {
    return InternalServerError(res, "internal server error", error);
  }
};

export { Create, Read, deletebyId, UpdatebyId , ReadById , Allupdate };
