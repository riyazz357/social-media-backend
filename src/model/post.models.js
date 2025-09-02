import mongoose from "mongoose";

const postSchema= new mongoose.Schema({
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true

    },
    content:{
        type:String,
        trim:true
    },
    media:{
        type:[String], //array of string yo hold urls of images or video
        default:[]

    },
    privacy:{
        type:String,
        enum:['public','private','friend'],
        default:'public'
    },
    likesCount:{
        type:Number,
        default:0
    },
    commentsCount:{
        type:Number,
        default:0
    }

},{timestamps:true})

export const Post= mongoose.model("Post",postSchema)