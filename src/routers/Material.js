import express from "express";
import { Create, deletebyId, Read, UpdatebyId , ReadById , Allupdate } from "../controller/Material.js";
import { Authorized, Protect } from "../middleware/protect.js";


const MaterialRouter = express.Router();

MaterialRouter.post("/create",Protect,Authorized("superadmin"),Create)
MaterialRouter.put("/edit/:id",Protect,Authorized("superadmin") ,Allupdate)
MaterialRouter.get("/get",Read)
MaterialRouter.get("/get/:id",ReadById)
MaterialRouter.patch("/update/:id",Protect,Authorized("superadmin"),UpdatebyId)
MaterialRouter.delete("/delete/:id",Protect,Authorized("superadmin"),deletebyId)

export default MaterialRouter