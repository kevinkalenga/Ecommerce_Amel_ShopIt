import express from 'express'
const router = express.Router()
import {isAuthenticatedUser} from "../middleware/auth.js"

import {registerUser, 
    loginUser,
     logoutUser, 
     forgotPassword, 
     resetPassword,
     getUserProfile
} from "../controllers/authController.js"



router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").get(logoutUser)
router.route("/forgot/password").post(forgotPassword)
router.route("/password/reset/:token").put(resetPassword)
router.route("/me").get(isAuthenticatedUser, getUserProfile)


export default router;