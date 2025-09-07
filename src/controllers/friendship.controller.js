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
const removeFriend= asyncHandler(async(req,res)=>{
    const {friendId}=req.params;
    const userId=req.user._id;

    const friendship = await Friendship.findByIdAndDelete({
        status:'accepted',
        $or:[
            {requester:userId,recipient:friendId},
            {requester:friendId,recipient:userId},
        ],
    })

    if(!friendship){
        return res
        .status(404)
        .json({message:" friendship not found.."})
    }

    await User.findByIdAndUpdate(userId,{$pull:{friends:friendId}});
    await User.findByIdAndUpdate(friendId,{$pull:{friends:userId}});

    return res
    .status(200)
    .json({message:"Frineds removed succesfully!!"})
})

export{
    sendFriendRequest,
    respondToFriendRequest,
    removeFriend
}