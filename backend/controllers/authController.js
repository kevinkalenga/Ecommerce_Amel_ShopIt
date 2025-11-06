import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import User from "../models/userModel.js"
import ErrorHandler from "../utils/errorHandler.js"
import sendToken from "../utils/sendToken.js"
import sendEmail from "../utils/sendEmail.js"
import {getResetPasswordTemplate} from "../utils/emailTemplates.js"

// Inscription de user 
export const registerUser = catchAsyncErrors(async(req, res, next) => {
    const {name, email, password} = req.body

    if(name === "" || email === "" || password === "") {
        return next(new ErrorHandler("All fields are required", 400))
    }

    const user = await User.create({
        name,
        email,
        password
    })
   sendToken(user, 201, res)
})

// Forgot pwd => /api/v1/password/forgot

export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
    // recherche de user existant en bd 
    const user = await User.findOne({email:req.body.email})

    if(!user) {
        return next(new ErrorHandler("User not found with this email", 404))
    }

    // Recupe de token 
    const resetToken = user.getResetPasswordToken()

    await user.save()

    // Creation reset pwd url 
    const resetUrl = `${process.env.FRONTEND_URL}/api/v1/password/reset/${resetToken}`
    const message = getResetPasswordTemplate(user?.name, resetUrl)

    try {
        await sendEmail({
            email: user.email,
            subject: "Shop Password Recovery",
            message,
        })
        res.status(200).json({
            message: `Email sent to: ${user.email}`
        })
        return;
    } catch (error) {
        user.resetPasswordToken = undefined
        user.resetPasswordExpired = undefined

        await user.save()
        return next(new ErrorHandler(error?.message, 500))
    }
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

    sendToken(user, 200, res)
})

export const logoutUser = catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        message: "Logged Out"
    })
})





