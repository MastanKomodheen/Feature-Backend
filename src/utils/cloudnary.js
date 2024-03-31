import { v2 as cloudinary } from "cloudinary";
import fs from "fs"
import dotenv from 'dotenv';

// Config
dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const uploadOnCloudnary = async (localfilepath) => {
    try {
        if (!localfilepath) return null;
        const responseImage = await cloudinary.uploader.upload(localfilepath, { resource_type: "auto" })
        console.log(`cloudnary image url ${responseImage.url}`)
        return responseImage
    } catch (error) {
        console.log(error)
        fs.unlinkSync(localfilepath)//unlink when it is failed
        return null
    }
}
export { uploadOnCloudnary }