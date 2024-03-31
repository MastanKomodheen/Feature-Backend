import mongoose, { Schema } from "mongoose";
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
    }
},
    {
        timestamps: true,
    }
)
export const User = mongoose.model("User", UserSchema)