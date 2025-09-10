import {Post} from '../model/post.models.js';
import {User} from '../model/user.models.js';
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

//get a single post by id

const getPostById= asyncHandler(async(req,res)=>{
     const {postId} = req.params;
     const post = await Post.findById(postId).populate("author",'firstName lastName profilePicture')
     if(!post){
        return res
        .status(404)
        .json({message:" post not found"});
     }
     return res
     .status(200)
     .json({message:"post fetched successfully",post})
})


export {
    getPostById
}