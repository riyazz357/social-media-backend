import mongoose from "mongoose";

const notificationSchema=new mongoose.Schema({
    recipient:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    type:{
        type:String,
        enum:['comment',"like",'friend_request']
    },
    read:{
        type:Boolean,
        default:false
    },
    linkToContent:{
        type:string,
        required:true
    }
},{timestamps:true});

export const Notification=mongoose.model("Notification",notificationSchema);