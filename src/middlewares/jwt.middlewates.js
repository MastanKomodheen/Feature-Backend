import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
const jwtVerify = asyncHandler(async (req, res, next) => {
    try {
        console.log('Cookies:', req.cookies);
        console.log('Authorization header:', req.header("authorization"));
        const tokens = req.cookies?.accessToken || req.header("authorization")?.replace("Bearer ", "");
        console.log('Token:', tokens);

        const token = req.cookies?.accessToken || req.header("authorization")?.replace("Bearer ", "")
        console.log(token)
        if (!token) {
            throw new ApiError(400, "token not found")
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded?._id).select("-password -refreshToken")
        if (!user) {
            throw new ApiError(400, "user not found")
        }
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(400, error.message || "invalid token")
    }
})
export { jwtVerify }
