import express from "express";
import { Create, deletebyId, Read, UpdatebyId , ReadById , Allupdate } from "../controller/RoomType.js";
import { Authorized, Protect } from "../middleware/protect.js";


const RoomRouter = express.Router();

RoomRouter.post("/create",Protect,Authorized("superadmin"),Create)
RoomRouter.put("/edit/:id" ,Protect,Authorized("superadmin"),Allupdate)
RoomRouter.get("/get",Read)
RoomRouter.get("/get/:id",ReadById)
RoomRouter.patch("/update/:id",Protect,Authorized("superadmin"),UpdatebyId)
RoomRouter.delete("/delete/:id",Protect,Authorized("superadmin"),deletebyId)

export default RoomRouter