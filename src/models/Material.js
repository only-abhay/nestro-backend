import mongoose from "mongoose";


const MaterialSchema = new mongoose.Schema({
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

const MaterialModel = mongoose.model("Material", MaterialSchema )

export default MaterialModel