import express from 'express'
const router = express.Router()
import {authorizeRoles, isAuthenticatedUser} from "../middleware/auth.js"

import {registerUser, 
    loginUser,
     logoutUser, 
     forgotPassword, 
     resetPassword,
     getUserProfile,
     updatePassword,
     updateProfile,
     allUsers,
     getUserDetails
} from "../controllers/authController.js"

// pwd
router.route("/forgot/password").post(forgotPassword)
router.route("/password/reset/:token").put(resetPassword)

// Auth
router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").get(logoutUser)




// User Info

router.route("/me").get(isAuthenticatedUser, getUserProfile)
router.route("/password/update").put(isAuthenticatedUser, updatePassword)


// Admin Route
router.route("/admin/users").get(isAuthenticatedUser, authorizeRoles('admin'), allUsers)
router.route("/admin/users/:id").get(isAuthenticatedUser, authorizeRoles('admin'), getUserDetails)


export default router;