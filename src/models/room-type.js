import mongoose from "mongoose";


const RoomTypeSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        minlength:3,
        maxlength:20,
        trim:true,
        unique:true
    },
    slug : {
        type : String,
        required : true,
        unique:true,
        lowercase:true,
        trim:true
    },
    status:{
        type:Boolean,
        default:true
    }
},
    {
      timestamps:true
    }
)

const RoomTypeModel = mongoose.model("RoomType", RoomTypeSchema )

export default RoomTypeModel