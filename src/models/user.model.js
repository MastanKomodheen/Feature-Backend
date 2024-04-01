import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
const UserSchema = new Schema({
    email: {
        type: String,
        unique: true,
        require: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        require: [true, "password is required"]
    },
    username: {
        type: String,
        unique: true,
        trim: true,
        index: true,
        require: true
    },
    avatar: {
        type: String,//cloudunary url
        require: true
    },
    refreshToken: {
        type: String,
        require: true,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpire: {
        type: Date,
    },
    emailVerificationToken: {
        type: String,
    },
    emailVerificationExpire: {
        type: Date,
    },
    twoFactorCode: {
        type: String,
    },
    twoFactorCodeExpire: {
        type: Date,
    },
    twoFactorEnable: {
        type: Boolean,
        default: false,
    },
    twoFactorSecret: {
        type: String,
    },
},
    {
        timestamps: true,
    }
)
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 8)
    }
    next()
}
)
UserSchema.methods.isPasswordMatch = async (password) => {
    return await bcrypt.compare(password, this.password)
}
UserSchema.methods.generateAccessToken = async () => {
    return await jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
        avatar: this.avatar,
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_TOKEN_EXPIRE
    })

}
UserSchema.methods.generateRefreshToken = async () => {
    return await jwt.sign({
        _id: this._id,
    },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_TOKEN_EXPIRE
        }
    )

}


export const User = mongoose.model("User", UserSchema)