import {Like} from '../model/like.models.js';
import {User} from '../model/user.models.js';
import { Post } from '../model/post.models.js';
import {Comment} from '../model/comment.models.js';
import {asyncHamdelr} from '../utilities/asyncHandler.js';

const toggleLike = asyncHamdelr(async(req,res)=>{
    const {likeableId,onModel}=req.body;
    const userId= req.user._id;

    if(!likeableId || !onModel){
        return res
        .status(400)
        .json({message:"content id and type are required"})
    }

    const likeCondition={user:userId,likeable:likeableId,onModel};

    const existingLike= await Like.findOne(likeCondition);

    let isLiked;
    let likesCountChange;

    if(existingLike){
        await Like.findByIdAndDelete(existingLike._id);
        isLiked=false;
        likesCountChange=-1
    }
    else{
        await Like.create(likeCondition);
        isLiked=true;
        likesCountChange=1;
    }
    let parentDocument;
    if(onModel==='Post'){
        parentDocument= await Post.findByIdAndUpdate(likeableId,
            {$inc:{likesCount:likesCountChange}},
            {new:true}
        );
    } else if(onModel==='Comment'){
        parentDocument= await Comment.findByIdAndUpdate(likeCondition,
        {$inc:{likesCount:likesCountChange}},
        {new:true}
        );
    }
    else{
        return res
        .status(400)
        .json({message:"Invalid content type for liking"});
    }

    if(!parentDocument){
        return res
        .status(404)
        .json({message:`${onModel} not found.`});
    }

    return res.status(200)
    .json({
        message:`Sucessfully ${isLiked ? 'liked':'unliked'} the ${onModel.toLowerCase()}.`,
        isLiked,
        likesCount:parentDocument.likesCount
    });

})

export {toggleLike};