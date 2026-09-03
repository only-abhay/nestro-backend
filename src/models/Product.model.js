import mongoose from "mongoose";


const ProductTypeSchema = new mongoose.Schema({
    roomID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"RoomType",
        required:true,
    },  
      categroyID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required:true,
    },
        MaterialID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Material",
        required:true,
    },
    name : {
        type : String,
        required : true,
        minlength:3,
        maxlength:20,
        trim:true,
    },
    slug : {
        type : String,
        required : true,
        lowercase:true,
        trim:true
    },
    originalPrice:{
       type:Number,
       required:true
    },
     salePrice:{
       type:Number,
       required:true
    },
    description:{
        type:String
    },
     sortdescription:{
        type:String
    },
    dimensions:{
        width:Number,
        Height:Number,
        depth:Number
    },
    weight:{
        type:Number
    },
    featured:{
        type:Boolean,
        default:false
    },
    bestSeller:{
        type:Boolean,
        default:false
    },
     newArrival:{
        type:Boolean,
        default:false
    },
    color:{
        type:String
    },
    thumbnail:{
        type:String
    },
    stock:{
        type:Boolean,
        default:true
    },
    status:{
        type:Boolean,
        default:true
    },
    images:[
        {
            type:String,
        }
    ],
},
{timestamps:true}
)

const ProductModel = mongoose.model("Product", ProductTypeSchema)

export  default ProductModel 