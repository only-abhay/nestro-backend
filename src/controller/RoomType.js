import RoomTypeModel from "../models/room-type.js";
import {
  AlreadyExist,
  Created,
  InternalServerError,
  NotFound,
} from "../utils/response.js";

const Create = async (req, res) => {
  try {
    const { name, slug } = req.body;
    const RoomType = await RoomTypeModel.findOne({ name: name });
    if (RoomType) return AlreadyExist(res);

    const Rooms = await RoomTypeModel.create({
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
    const query = req.query
    const limit = query.limit ? parseInt(req.query.limit) : 0
    const filter = {}
    if(query.status) filter.status = query.status ==="true"
    const Room = await RoomTypeModel.find(filter).limit(limit);
       const Total = await RoomTypeModel.find().countDocuments()

    res.status(200).json({
      messege: "Data Fetched",
      success: true,
      Room: Room,
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

    const Room = await RoomTypeModel.findById({ _id: id });

    if (!Room) return NotFound(res);

    await RoomTypeModel.findByIdAndDelete({_id:id});

    return Created(res, "Data Deleted Successfully");
  } catch (error) {
    return InternalServerError(res, "data Not Deleted", error);
  }
};

const UpdatebyId = async (req, res) => {
  try {
    const { id } = req.params;
    const Room = await RoomTypeModel.findById({ _id: id });

    if (!Room) return NotFound(res);

    const UpdatedRoom = await RoomTypeModel.findByIdAndUpdate(id, {
      status: !Room.status,
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
    const Room = await RoomTypeModel.findById({ _id: id });
    res.status(200).json({
      messege: "Data Fetched",
      success: true,
      Room,
    });
  } catch (error) {
    return InternalServerError(res, "internal server error", error);
  }
};

const Allupdate = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, slug } = req.body;

    const Room = RoomTypeModel.findById({ _id: id });
    if (!Room) return NotFound(res, "Data Not Found");

    const Updatedata = {
      name,
      slug,
    };

    const UpdatedData = await RoomTypeModel.findByIdAndUpdate(id, Updatedata, {
      new: true,
    });
    res.status(200).json({
      messege: "data Updated Succesfully",
      success: true,
      UpdatedData,
    });
  } catch (error) {
    return InternalServerError(res, error);
  }
};

export { Create, Read, deletebyId, UpdatebyId, ReadById, Allupdate };
