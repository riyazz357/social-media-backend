import mongoose from 'mongoose';

const reelSchema=new mongoose.Schema({
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    videoUrl:{
        type:String,
        required:true
    },
    caption:{
        type:String,
        trim:true
    },
    expiresAt:{
        type:Date,
        default:Date.now,
        index:{expires:'24h'} //automatically delete the document after 24h
    }
},{timestamps:true});

export const Reel= mongoose.model("Reel",reelSchema);