import catchAsyncErrors from './catchAsyncErrors.js';
import ErrorHandler from '../utils/errorHandler.js'
import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'


// fonction permettant de savoir si le user est connecté ou pas 

export const isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    const token = req.cookies?.token 
     console.log("COOKIES RECEIVED:", req.cookies);
     console.log("HEADERS:", req.headers.origin);
     if(!token) {
        return next(new ErrorHandler("Login first to access this resource", 401))
     }

     const decoded = jwt.verify(token, process.env.JWT_SECRET) 

    

     req.user = await User.findById(decoded.id)

     next();
})

// export const isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
//     const token = req.cookies?.token;

//     console.log("COOKIES RECEIVED:", req.cookies);

//     if (!token) {
//         return next(new ErrorHandler("Login first to access this resource", 401));
//     }

//     let decoded;
//     try {
//         decoded = jwt.verify(token, process.env.JWT_SECRET);
//     } catch (err) {
//         return next(new ErrorHandler("Invalid or expired token", 401));
//     }

//     const user = await User.findById(decoded.id);

//     if (!user) {
//         return next(new ErrorHandler("User not found", 404));
//     }

//     req.user = user;

//     next();
// });

export const authorizeRoles = (...roles) => {
   return (req, res, next) => {
      if(!roles.includes(req.user.role)) {
         return next(
            new ErrorHandler(
               `Role (${req.user.role}) is not allowed to access this resource`, 403
            )
         )
      }
      next()
   }
}