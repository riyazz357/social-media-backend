import mongoose from "mongoose";

const userSchema= new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        lowercase:true,
        trim:true
    },
    lastName:{
        type:String,
        required:true,
        lowercase:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
    },
    bio:{
        type:String,
        maxLength:250,
    },
    friends:{
        type:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:'Users',
            }
        ],
        default:[]
    },
    profilePicture: {
        type: String, // URL to the image
        default: 'default_avatar_url' // A link to a default placeholder image
    },
    coverPhoto: {
        type: String, // URL to the image
        default: 'default_cover_url'

    }

},{timestamps:true})


//Hashing the password before saving
userSchema.pre("save", async function(next){

    if(!this.isModified('password')) return next();
    this.password=await bcrypt.hash(this.password,10);
    next();
});

export const User= mongoose.model("User",userSchema);
