import {Post} from '../model/post.models.js';
import {User} from '../model/user.models.js';
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


//create a new post
const createPost= asyncHandler(async(req,res)=>{
    const {content}=req.body;
    const userId=req.user._id;

    if(!content && !req.file){
        return res
        .status(400)
        .json({message:"Post must include contetnt or image."})
    }
    let mediaUrl='';
    if(req.file){
        //upload image to cloudinary

        const mediaUploadResult= await uploadOnCloudinary(req.file.path);
        if(!mediaUploadResult){
            return res
            .status(500)
            .json({message:"Filed to upload media files"})
        }
        mediaUrl=mediaUploadResult.url;
    }

    const post= await Post.create({
        author: authorId,
        content,
        media:mediaUrl ? [mediaUrl] : [], //storing the url in media array
    })

    return res
    .status(201)
    .json({message:"post created successfully!!!",post})
})

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