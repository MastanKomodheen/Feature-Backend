import { User } from "../models/user.model.js";
import { ApiResoponse } from "../utils/ApiResoponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudnary } from "../utils/cloudnary.js";

const generateAccessAndRefreshToken = async (userId) => {
   try{
     //generate access token
     const user=await User.findById(userId)
     const generateToken=await user.generateAccessToken()
     const refreshToken=await user.generateRefreshToken()
     user.refreshToken=refreshToken
     await user.save({validateBeforeSave:false})
     return {generateToken,refreshToken}
   }
   catch(error){
    throw new ApiError(400,error.message||"token not generated")
   }
}
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
    if (!avatarLocalPath) {
        throw new ApiError(400, "local avatar not uploded")
    }
    const avatar = await uploadOnCloudnary(avatarLocalPath)
    console.log(avatar);
    if (!avatar) {
        throw new ApiError(400, "avatar require")
    }
    const user = await User.create({
        email,
        password,
        username,
        avatar: avatar.url
    })
    //find created user
    const createdUser = await User.findById(user._id).select("-password -refrehToken")
    //user 
    if (!user) {
        throw new ApiError(400, "user not rigistred")
    }
    return res.status(201).json(
        new ApiResoponse(200, createdUser, "user rigisterd successfully")
    )

})
const LoginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if ([email, password].some((field) => field.trim() === "")) {
        throw new ApiError(400, "email and pasword required")
    }
    const user = await User.findOne({ email })
    if (!user) {
        throw new ApiError(400, "User not found")
    }
    const isPasswordMatch = await user.comparePassword(password)
    if (!isPasswordMatch) {
        throw new ApiError(400, "password not match")
    }
    const { generateToken, refreshToken } = await generateAccessAndRefreshToken(user._id)
    //storing the cookie
    const logedInUser = await User.findById(user._id).select("-password -refreshToken")
    const options = {
        httpOnly: true,
        secure: true,
    }
    return res.status(200)
        .cookie("accessToken", generateToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResoponse(200, { user: logedInUser, generateToken, refreshToken }, "user login successfully")
        )
})
export { registerUser, LoginUser }