import { User } from "../models/user.model.js";
import { ApiResoponse } from "../utils/ApiResoponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudnary } from "../utils/cloudnary.js";


const registerUser = asyncHandler(async (req, res) => {
    // res.status(200).json({
    //     message:"OK"
    // })
    const { email, password, username } = req.body;
    // console.log(req.files.avatar[0].path)
    // console.log(email)

    if ([email || password || username].some((fild) => fild.trim() === "")) {
        return res.status(401).json({
            message: "response is null"
        })
    }
    //email and username already exist
    const existuser = await User.findOne({
        $or: [{ email }, { username }]
    })
    if (existuser) {
        throw new ApiError(400, "user already exists")
    }
     //4.check for images,check for avatar
    //5.upload time to cloudinary
    //6.create user object -create entry in db
    //7.remove password and refresh token field form response
    //8.check for user creation
    //9.return res
    let avatarLocalPath;
    if (req.files && req.files.avatar && req.files.avatar[0]) {
        avatarLocalPath = req.files.avatar[0].path;
    } else {
        console.log('No avatar file was uploaded.');
    }
    if(!avatarLocalPath) {
        throw new ApiError(400,"local avatar not uploded")
    }
    const avatar=await uploadOnCloudnary(avatarLocalPath)
    console.log(avatar);
    if(!avatar){
        throw new ApiError(400,"avatar require")
    }
    const user = await User.create({
        email,
        password,
        username,
        avatar:avatar.url
    })
    //find created user
    const createdUser=await User.findById(user._id).select("-password")
//user 
if(!user){
    throw new ApiError(400,"user not rigistred")
}
return res.status(201).json(
    new ApiResoponse(200,createdUser,"user rigisterd successfully")
)

})
export { registerUser }