import mongoose, { Schema } from "mongoose";

const friendshipSchema= new mongoose.Schema({
    requester:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    recipient:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    status:{
        type:String,
        enum:['pending','accepted','declined','blocked'],
        default:'pending',
    }
},{timestamps:true})

export const Friendship= mongoose.model("Friendship",friendSchema)