import mongoose from "mongoose";

const groupSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    admins:{
         type:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }],
        required:true
    },
    creator:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    members:{
        type:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }],
        default:[]
    },
    privacy:{
        type:String,
        enum:["public","private"],
        default:"public"
    },
    coverImage:{
        type:String,
        required:true
    }
},{timestamps:true});

export const Group= mongoose.model("Group",groupSchema)