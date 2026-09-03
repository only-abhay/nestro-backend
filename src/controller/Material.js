import MaterialModel from "../models/Material.js";
import {
  AlreadyExist,
  Created,
  InternalServerError,
  NotFound,
} from "../utils/response.js";

const Create = async (req, res) => {
  try {
    const { name, slug } = req.body;
    const RoomType = await MaterialModel.findOne({ name: name });
    if (RoomType) return AlreadyExist(res);

    const Rooms = await MaterialModel.create({
      name,
      slug,
    });
    return Created(res, "Data Created");
  } catch (error) {
    return InternalServerError(res, "internal Server Error", error);
  }
};

const Read = async (req, res) => {
  try {
    const query= req.query
    const filter = {}
    const limit = query.limit ? parseInt(req.query.limit) :0
    if(query.status) filter.status = query.status ==="true"
    const material = await MaterialModel.find(filter).limit(limit);
       const Total = await MaterialModel.find().countDocuments()
    
    res.status(200).json({
      messege: "Data Fetched",
      success: true,
      material: material,
       Total :Total,
      pages : Math.ceil(Total/10)
    });
  } catch (error) {
    InternalServerError(res, "internal Server Error", error);
  }
};

const deletebyId = async (req, res) => {
  try {
    const { id } = req.params;

    const material = await MaterialModel.findById({ _id: id });

    if (!material) return NotFound(res);

    await MaterialModel.findByIdAndDelete({_id:id});

    return Created(res, "Data Deleted Successfully");
  } catch (error) {
    return InternalServerError(res, "data Not Deleted", error);
  }
};

const UpdatebyId = async (req, res) => {
  try {
    const { id } = req.params;
    const material = await MaterialModel.findById({ _id: id });

    if (!material) return NotFound(res);

    const UpdatedRoom = await MaterialModel.findByIdAndUpdate(id, {
      status: !material.status,
    });

    return res.status(200).json({
      messege: "data Updated",
      success: true,
      UpdatedRoom,
    });
  } catch (error) {
    return InternalServerError(res, "data Not updated", error);
  }
};

const ReadById = async (req, res) => {
  const { id } = req.params;
  try {
    const material = await MaterialModel.findById({ _id: id });
    res.status(200).json({
      messege: "Data Fetched",
      success: true,
      material,
    });
  } catch (error) {
    return InternalServerError(res, "internal server error", error);
  }
};

const Allupdate = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, slug } = req.body;

    const material = MaterialModel.findById({ _id: id });
    if (!material) return NotFound(res, "Data Not Found");

    const Updatedata = {
      name,
      slug,
    };

    const UpdatedData = await MaterialModel.findByIdAndUpdate(id, Updatedata, {
      new: true,
    });
    res.status(200).json({
      messege: "data Updated Succesfully",
      success: true,
      UpdatedData,
    });
  } catch (error) {
    return InternalServerError(res,"internal server error", error);
  }
};

export { Create, Read, deletebyId, UpdatebyId, ReadById, Allupdate };
