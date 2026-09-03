import express from "express";
import { Create, deletebyId, Read, UpdatebyId , ReadById , StatusUpdatebyid , AddImage} from "../controller/Product.controller.js";
import upload from "../middleware/multerUpload.js";
const router = express.Router()
import { Authorized, Protect } from "../middleware/protect.js";


router.post("/create",Protect,Authorized("superadmin") , upload.single("thumbnail"),Create)
router.get("/get",Read)
router.get("/get/:id",ReadById)
router.patch("/update/:id",Protect,Authorized("superadmin"),UpdatebyId)
router.delete("/delete/:id",Protect,Authorized("superadmin"),deletebyId)
router.put("/status/:id",Protect,Authorized("superadmin"),StatusUpdatebyid)
router.post("/image/:id" ,Protect,Authorized("superadmin"), upload.array("images", 4 ),AddImage)

export default router