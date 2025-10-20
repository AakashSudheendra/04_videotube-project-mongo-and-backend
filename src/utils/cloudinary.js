import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv"
dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_USER_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log("File Uploaded on Cloudinary. File src:" + response.url);
    //once file uploaded we can delete from server
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    return null;
  }
};

const deleteFromCloudinary=async(publicId)=>{
  try {
    const result=await cloudinary.uploader.destroy(publicId)
    console.log("Delted From Cloudinary .publicId",publicId)
    
  } catch (error) {
    console.log("Error Deleting From Cloudinary")
  }
}

export { uploadOnCloudinary , deleteFromCloudinary };
