import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import User from "../models/userModel.js"

// Inscription de user 
export const registerUser = catchAsyncErrors(async(req, res, next) => {
    const {name, email, password} = req.body

    const user = await User.create({
        name,
        email,
        password
    })
    const token = user.getJwtToken()
    res.status(201).json({token})
})