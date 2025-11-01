import mongoose from "mongoose";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
        maxLength: [50, "Your name can not exceed 50 characters"]
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minLength: [6, "Your password must be longer than 6 characters"],
        select: false
    },
    avatar: {
       public_id: String,
       url: String
    },
    role: {
        type: String,
        default: "user"
    },
    resetPasswordToken: String,
    resetPasswordExpired: Date,
}, {
    timestamps: true
})

userSchema.pre("save", async function(next){
 if(!this.isModified("password")) {
    return next()
 }

 this.password = await bcrypt.hash(this.password, 10)
})

// retourne jwt

userSchema.methods.getJwtToken = function() {
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    })
}



const User = mongoose.model("User", userSchema)

export default User