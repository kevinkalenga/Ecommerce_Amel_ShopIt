
//  export default (user, statusCode, res) => {
//   // Creation de jwt token   
//   console.log(user)
//   const token = user.getJwtToken()

//   const options = {
//      expires: new Date(
//         Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
//      ),
//      httpOnly: true,
//   }

//   // Set the cookie 
//   res.status(statusCode).cookie("token", token, options).json({
//     token,
//   })
// } 


export default (user, statusCode, res) => {
    // Création du JWT
    const token = user.getJwtToken();

    const days = Number(process.env.COOKIE_EXPIRES_TIME || 7);

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "PRODUCTION",
        sameSite:
            process.env.NODE_ENV === "PRODUCTION"
                ? "none"
                : "lax",
        expires: new Date(
            Date.now() + days * 24 * 60 * 60 * 1000
        ),
    };

    res
        .status(statusCode)
        .cookie("token", token, options)
        .json({
            success: true,
            token,
            user,
        });
};