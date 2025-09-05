import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';

//configure with your credentials from .env file

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})


const uploadOnCloudinary= async(localFilePath)=>{
    try{
        if(!localFilePath) return null;

        const response=await cloudinary.uploader.upload(localFilePath,{
            resource_type:'auto', //automatically detect the file type 
        })
        //remove the locally saved temp file 
        fs.unlinkSync(localFilePath);
        return response
    }
    catch(error){
        fs.unlinkSync(localFilePath);
        console.error("error while uploading on cloud",error);
        return null;
    }
};

export default uploadOnCloudinary;