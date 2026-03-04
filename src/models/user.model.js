import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import mongoose, { Schema } from "mongoose"

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullName: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        avatar: {
            type: String, // cloudinary url 
            required: true,
        },
        coverImage: {
            type: String,
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video",
            }
        ],
        password: {
            type: String,
            required: [true, 'password is required']
        },
        refreshToken: {
            type: String,
        }
    },
    {
        timestamps: true
    }
)

userSchema.pre('save', async function (next) {
    if (!this.isModified('Password')) return next();

    this.Password = await bcrypt.hash(this.Password, 10)
    next()
})

userSchema.methods.comparePassword = async function
    (Password) {
    return await bcrypt.compare(Password, this.Password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email,
            fullName: this.fullName,
        },
        process.env.JWT_ACCESS_TOKEN_SECRET,
        {
            expiresIn: JWT_ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,

        },
        process.env.JWT_REFRESH_TOKEN_SECRET,
        {
            expiresIn: JWT_REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema);

