import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import User from "../models/userModel.js"
import ErrorHandler from "../utils/errorHandler.js"
import sendToken from "../utils/sendToken.js"
import sendEmail from "../utils/sendEmail.js"
import {getResetPasswordTemplate} from "../utils/emailTemplates.js"
import crypto from 'crypto'

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

// Reset password => /api/v1/password/reset/:token
export const resetPassword = catchAsyncErrors(async (req, res, next) => {
    // Hasher le token en url
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex")

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpired: {$gt: Date.now()}
    })

    if(!user) {
        return next(new ErrorHandler("Password reset token is invalid or has been expired", 400))
    }

    if(req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password doesn't match", 400))
    }

    // Nouveau mdp 
    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpired = undefined
    await user.save()
    sendToken(user, 200, res)
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

// User profile => /api/v1/me 
export const getUserProfile = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req?.user?._id) 

    res.status(200).json({
        user
    })
})

export const updatePassword = catchAsyncErrors(async (req, res, next) => {
    // Recup le user à partir de son id 
    const user = await User.findById(req?.user?._id).select("+password") 
    

    // Verif de l'ancien mdp 
    const isPasswordMatch = await user.comparePassword(req.body.oldPassword)

    if(!isPasswordMatch) {
        return next(new ErrorHandler('Old Password is incorrect', 400))
    }

    user.password = req.body.password 
    await user.save()

     // Renvoi d'un nouveau token ou succès
    const token = user.getJwtToken();

    res.status(200).json({
        success: true,
        token,
        message: "Password updated successfully",
    });
})


// Update user profile => /api/v1/update 

export const updateProfile = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email 

    
    }

    const user = await User.findByIdAndUpdate(req.user._id, newUserData, {
        new: true
    })

    res.status(200).json({
        user,
    })
})

// Get all users - Admin => /api/v1/admin/users

export const allUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        users,
    })
})

// Get User Detail - Admin => /api/v1/admin/users/:id

export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
     const user = await User.findById(req.params.id);
     if(!user) {
        return next(new ErrorHandler(`User not found with id: ${req.params.id}`, 404))
     }

     res.status(200).json({
        user,
     })
})





