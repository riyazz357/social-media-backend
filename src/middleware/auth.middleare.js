import {User} from '../model/user.models.js';
import jwt from "jsonwebtoken";
import {asyncHandler} from '../utilities/asyncHandler.js';

const verifyJWT= asyncHandler(async(req,_,next)=>{
    try{
        //getting the token from authorition header
        const token=req.header("Authorization")?.replace("Bearer ","");

        if(!token){
            return res
            .status(401)
            .json({message:"unauthorized request. no token provided"})
        }

        //verifying the token using the secret key
        const decodedToken=jwt.verify(token,process.env.JWT_SECRET);

        const user=await User.findById(decodedToken?._id).select("-password");
        if(!user){
            return res
            .status(401)
            .json({message:"invalid access token.user not found!!"})
        }

        req.user=user;
        next();

    }catch(error){
        return res
        .status(500)
        .json({message:"Invalid or expired token"})
    }
})

export default verifyJWT