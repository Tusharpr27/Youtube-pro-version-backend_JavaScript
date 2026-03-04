import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


const registerUser = asyncHandler(async (req, res) => {
    // get the user details from the request body
    // validion - not empty, email format, password strength etc.
    // check if the user already exists in the database
    // check for images, check for avatar (multer) - optional
    //upload the image to cloudinary (if exists) and get the image URL - optional
    // remove the password & refresh token from the user details before saving to the database
    // check for user creation in the database and save the user details
    // return a success response with the user details (excluding password)


    const { fullName, email, password } = req.body;
    console.log("email: ", email);

    if (fullName === "") {
        throw new apiError(400, "fullname is required")
    }
    if (email === "") {
        throw new apiError(400, "email is required")
    }
    if (username === "") {
        throw new apiError(400, "username is required")
    }
    if (password === "") {
        throw new apiError(400, "password is required")
    }
    if (!email.includes("@")) {
        throw new apiError(400, "Invalid email: '@' symbol is required")
    }
    if (!avatar) {
        throw new apiError(400, "Avatar is required")
    }

    const exitingUser = User.findOne({
        $or: [{ email }, { username }]
    })

    if (exitingUser) {
        throw new apiError(409, "User with email or username already exist")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new apiError(400, "Avatar is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new apiError(400, "Avatar is required")
    }

    const user = await User.create({  // Taking every thing from the userSchema (b/c it is only taking to DB(mongoose)).
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "", // get url, if coverimage is upload from the user.
        email,
        password,
        username: username.toLowerCase(),
    })
    const createdUser = await User.findById(user._id).select("-password -refreshToken -__v");

    if (!createdUser) {
        throw new apiError(500, "User registration failed")
    }

    return res.status(201).json(
        new apiResponse(200, createdUser, "User registered successfully")
    )

});


export { registerUser };
