import express from "express";
import { Create, deletebyId, Read, UpdatebyId , ReadById , Allupdate } from "../controller/Category.controller.js";
import upload from "../middleware/multerUpload.js";
import { Authorized, Protect } from "../middleware/protect.js";
const router = express.Router()
router.post("/create" ,Protect,Authorized("superadmin") , upload.single("image"),Create)
router.put("/edit/:id" ,Protect,Authorized("superadmin") , upload.single("image"),Allupdate)
router.get("/get",Read)
router.get("/get/:id",ReadById)
router.patch("/update/:id", Protect,Authorized("superadmin") ,UpdatebyId)
router.delete("/delete/:id" ,Protect,Authorized("superadmin"),deletebyId)

export default router