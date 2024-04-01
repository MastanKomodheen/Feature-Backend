import {Router} from "express";
import { LoginUser, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { jwtVerify } from "../middlewares/jwt.middlewates.js";

const router=Router();
router.route("/register").post(upload.fields([{
    name:"avatar",
    maxcount:1
}]),registerUser)

router.route("/login").post(jwtVerify,LoginUser)
export default router;