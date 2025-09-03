import mongoose from "mongoose";

const LiveStreamSchema=new mongoose.Schema(
    {
        host:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        status:{
            type:String,
            enum:['live','ended'],
            default:'live'
        },
        streamKey:{
            type:String,
            required:true,
            unique:true
        },
        playbackUrl:{
            type:String,
            required:true
        },
        viewersCount:{
            type:Number,
            default:0
        }
    },{timestamps:true});

export const LiveStream= mongoose.model("LiveStream",streamSchema);