
import { User } from '../models/user.model.js'; 
import {Friendship} from '../model/user.models.js'
import uploadOnCloudinary from '../utilities/cloudinary.js';
import { asyncHandler } from '../utils/asyncHandler.js'; 
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const registerUser = asyncHandler(async (req, res) => {
    //Get user details from the request body
    const { firstName, lastName, email, password } = req.body;

    //Check if any required field is missing or just an empty string
    if ([firstName, lastName, email, password].some((field) => !field || field.trim() === "")) {
        return res.status(400).json({ message: "All fields are required" });
    }

    //Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(409).json({ message: "User with this email already exists" });
    }

    //Create the new user. The password will be hashed by the pre-save hook.
    const user = await User.create({
        firstName,
        lastName,
        email,
        password,
    });

    //Efficiently get the created user object without the password
    const createdUser = user.toObject();
    delete createdUser.password;

    return res.status(201).json({
        message: "User registered successfully",
        user: createdUser
    });
});

const loginUser= asyncHandler(async(req,res)=>{
        const {email,password}=req.body

        if(!email || !password){
            return res
            .status(400)
            .json({message:"both are required field!!"})

        }

        const user= await User.findOne({email})

        if(!user){
            return res
            .status(404)
            .json({message:"not registered user!!!",error:error.message})
        }

        const isPassword=await bcrypt.compare(password,user.password)
        if(!isPassword){
            return res
            .status(401)
            .json({message:"enter the correct password",error:error.message})
        }

        const token=jwt.sign(
            {_id:user._id},
            process.env.JWT_SECRET,
            {expiresIn:'1d'}
        )
        //get user object and remove the password field
        const loggedInUser=user.toObject();
        delete loggedInUser.password;

        return res
        .status(200)
        .json({message:"user logged in successfully",
            user:loggedInUser,
            token:token
        })
})

// get user profile details
const getUserProfile=asyncHandler(async(req,res)=>{

    const user= await User.findById(_id)
    const userProfile=user.toObject();
    delete userProfile.password;
    return res
    .status(200)
    .json({
        message:"user profile fetched successfully",
        userProfile:userProfile
    })

})

// update user profile details
const updateUserProfile= asyncHandler(async(req,res)=>{
    const{firstName,lastName,bio}=req.body
    const updateUser=await User.findByIdAndUpdate(req.user._id,{
        $set:{
            firstName,
            lastName,
            bio
        }
    },{new:true}).select('-password');
    return res
    .status(200)
    .json({message:"user updated successfully",
        user:updateUser
    })
})

//update the user profile

const updateProfilePicture = asyncHandler(async(req,res)=>{
        const ppLocalPath=req.file?.path;

        if(!ppLocalPath){
            return res
            .status(400)
            .json({message:"Profile picture file is missing"})
        }

        const profilePicture= await uploadOnCloudinary(ppLocalPath)
        if(!profilePicture){
            return res
            .status(500)
            .json({message:"Error while uploading picture"})
        }

        const user= await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set:{
                    profilePicture:profilePicture.url,
                }
            },
            {new:true}
        ).select("-password");

        return res
        .status(200)
        .json({message:"profile picture updated successfully",user})
})


//search for the user 

const searchUsers= asyncHandler(async(req,res)=>{
    const {query}=req.body

    if(!query){
        return res
        .status(400)
        .json({message:"search query is required"});
    }
    // Case sensitive regular expression from query
    const searchRegex= new RegExp(query,'i');

    const users= await User.find({
        $or:[
            {firstName:{$regex:searchRegex}},
            {lastName:{$regex:searchRegex}}
        ]
    }).select("-password")

    return res
    .status(200)
    .json({message:"user found successfully",users})
    
})

//changes the password of user
const changePassword= asyncHandler(async(req,res)=>{

    const {oldPssword,newPaswword}=req.body;

    if(!oldPssword || !newPaswword){
        return res
        .status(400)
        .json({message:"enter the both password"})
    }

    const user= await User.findById(req.user?._id)
    if(!user){
        return res
        .status(404)
        .json({message:'user not found'});
    }


    const isPasswordCorrect= await bcrypt.compare(oldPssword,user.password)
    if(!isPasswordCorrect){
        return res
        .status(402)
        .json({message:"enter the right password"})
    }

    user.password=newPaswword

    await user.save({validateBeforeSave:false});

    return res
    .status(200)
    .json({message:"password updaetd successfully"})
})

//send the frined request

const sendFriendRequest= asyncHandler(async(req,res)=>{

    const {recipientId}=req.params;
    const requesterId=req.user._id;
    
    if(requesterId.toString()===recipientId){
        return res
        .status(400)
        .json({message:"you cannot send a friend request to yourself"})
    }

    const existingFriednship= await Friendship.findOne({
        $or:[
            {requester: requesterId,recipient:recipientId},
            {requester:recipientId,recipient:requesterId}
        ]
    })
    if(existingFriednship){
        return res
        .status(400)
        .json({message:" A friend request is already exist or you are already friends"})
    }

    //create a new friend request
    await Friendship.create({
        requester:requesterId,
        recipient:recipientId,
        status:'pending',
    })

    return res
    .status(201)
    .json({message:"request sent successfully"})
})

// responnd to the friendrequet

const respondToFriendRequest= asyncHandler(async(req,res)=>{
    const {frriendshipId}= req.params;
    const {action}= req.body; //action or decline
    const recipientId=req.user._id

    if(!['accept','decline'].includes(action)){
        return res
        .status(400)
        .json({message:"Invalid action. Must be accept or decline."})
    }

    const friendship = await Friendship.findById(frriendshipId);

    if(!friendship || friendship.status !== 'pending' || friendship.recipient.toString()!==recipientId.toString()){
        return res
        .status(404)
        .json({message:"friend request not found or you ar not auhtorized to respond"})
    }

    if(action === 'accept'){
        friendship.status='accepted';
        await friendship.save()

        await User.findByIdAndUpdate(recipientId,{
        $addToSet:{friends:friendship.requester}
    });

    await User.findByIdAndUpdate(friendship.requester,{
        $addToSet:{friends:recipientId}});

        return res
        .status(200)
        .json({message:"Friend request accepted"})
    }
    else{
        await Friendship.findByIdAndDelete(frriendshipId);
        return res
        .status(200)
        .json({message:"frined request declined"})
    }
})

//remove the friendddd




export { 
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    searchUsers,
    updateProfilePicture,
    changePassword,
    sendFriendRequest,
    respondToFriendRequest
};