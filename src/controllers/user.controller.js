import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// get the user details from the request body
// validion - not empty, email format, password strength etc.
// check if the user already exists in the database
// check for images, check for avatar (multer) - optional
//upload the image to cloudinary (if exists) and get the image URL - optional
// remove the password & refresh token from the user details before saving to the database
// check for user creation in the database and save the user details
// return a success response with the user details (excluding password)


const registerUser = asyncHandler(async (req, res) => {
    // 1. Get user details from request body 
    const { fullName, email, username, password } = req.body;

    // 2. Validation - Check if any fields are empty or just whitespace
    if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
        throw new apiError(400, "All fields are required");
    }

    // 3. Email format check (simple @ check)
    if (!email.includes("@")) {
        throw new apiError(400, "Invalid email format");
    }

    // 4. Check if the user already exists in the database
    const existingUser = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (existingUser) {
        throw new apiError(409, "User with email or username already exists");
    }

    // 5. Handle Local File Paths (Multer)
    // Check if files exist before trying to access index [0]
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if (!avatarLocalPath) {
        throw new apiError(400, "Avatar file is required");
    }

    // 6. Upload to Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    // Verify Cloudinary upload succeeded
    if (!avatar) {
        throw new apiError(400, "Avatar upload failed");
    }

    // 7. Create User Object and Save to DB
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password, // Password will be hashed automatically by userSchema.pre('save')
        username: username.toLowerCase(),
    });

    // 8. Remove sensitive fields from the returned object
    const createdUser = await User.findById(user._id).select("-password -refreshToken -__v");

    if (!createdUser) {
        throw new apiError(500, "Something went wrong while registering the user");
    }

    // 9. Final Success Response
    return res.status(201).json(
        new apiResponse(201, createdUser, "User registered successfully")
    );
});

export { registerUser };
