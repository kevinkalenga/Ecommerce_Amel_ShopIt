import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import User from "../models/userModel.js"
import ErrorHandler from "../utils/errorHandler.js"

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

// Connexion 
export const loginUser = catchAsyncErrors(async(req, res, next) => {
    const {email, password} = req.body 
    if(!email || !password || email === "" || password === "") {
        return next(new ErrorHandler("Please enter email and password", 400))
    }

    const user = await User.findOne({email}).select("+password")

    if(!user) {
        return next(new ErrorHandler('Invalid email and password', 401))
    }

    const isPwdMatched = await user.comparePassword(password)
    if(!isPwdMatched) {
        return next(new ErrorHandler('Password do not match'))
    }

    const token = user.getJwtToken();

    res.status(200).json({
        token
    })
})


