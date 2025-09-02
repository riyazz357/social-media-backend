import mongoose from "mongoose";

const commentsSchema=new mongoose.Schema({
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    content:{
        type:String,
        trim:true,
        required:true,
    },
   post:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Post",
    required:true
   },
   parentComment:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Comment",
    default:null
   }
    
},{timestamps:true})

export const Comment= new mongoose.model("Comment",commentsSchema);