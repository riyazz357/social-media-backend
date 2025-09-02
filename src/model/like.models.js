import mongoose from "mongoose";

const likeSchema= new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    onModel:{
        type:String,
        enum:['Post',"Comment","Page"],
        required:true,
    },
    likeable:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        refPath:'onModel'
    }
},{timestamps:true});

export const Like= mongoose.model("Like",likeSchema);