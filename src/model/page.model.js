import mongoose from "mongoose";

const pageSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    category:{
        type:String,
        enum:["sport",'news','movies','meme','business',"fun"],
        default:'business'
    },
    description:{
        type:String,
        required:true,
        trim:true,
    },
    profilePicture:{
        type:String,
        required:true,
    },
    coverPhoto:{
        type:String,
        required:true
    },
    admins:{
        type:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }],
        required:true
    },
    follower:{
        type:[{
             type:mongoose.Schema.Types.ObjectId,
             ref:"User"
        }],
        default:[]
    },
   creator:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
   }
    

},{timestamps:true})

export const Page= mongoose.model("Page",pageSchema)