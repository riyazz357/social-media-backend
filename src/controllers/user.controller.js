
import { User } from '../models/user.model.js'; 
import { asyncHandler } from '../utils/asyncHandler.js'; 

const registerUser = asyncHandler(async (req, res) => {
    //Get user details from the request body
    const { firstName, lastName, email, password } = req.body;

    //Check if any required field is missing or just an empty string
    if ([firstName, lastName, email, password].some((field) => !field || field.trim() === "")) {
        return res.status(400).json({ message: "All fields are required" });
    }

    //Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(409).json({ message: "User with this email already exists" });
    }

    //Create the new user. The password will be hashed by the pre-save hook.
    const user = await User.create({
        firstName,
        lastName,
        email,
        password,
    });

    //Efficiently get the created user object without the password
    const createdUser = user.toObject();
    delete createdUser.password;

    return res.status(201).json({
        message: "User registered successfully",
        user: createdUser
    });
});

export { registerUser };