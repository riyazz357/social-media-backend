import {User} from '../model/user.models.js';

const regitserUser= async(req,res)=>{
    try{
        const {firstName,lastName,email,password}=req.body

    if(!firstName || !lastName ||!email || !password){
        return res
        .status(401)
        .json({message:"all fileds are required",error:error.message})
    }

    const existingUser= await User.findOne({email})
    if(existingUser){
        return res
        .status(402)
        .json({message:"user already exist!!!",error:error.message})
    }

    const user= await User.create({
        firstName,
        lastName,
        email,
        password,

    })

  user=await User.findById({_id}).select(
    "-password"
  )

  return res
  .status(200)
  .json({message:"user reigstered successfully",user})

    }
    catch(error){
        return res
        .status(500)
        .json({message:"error while registering the user",error:error.message})
    }
    
}

export {regitserUser}