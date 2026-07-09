


// const sendToken = (user, statusCode, res) => {
//   const token = user.getJwtToken();

//   // const options = {
//   //   httpOnly: true,
//   //   secure: true,          // obligatoire https (Render)
//   //   sameSite: "none",      // obligatoire cross-site
//   //   maxAge: 7 * 24 * 60 * 60 * 1000,
//   //   path: "/"
//   // };

//   const options = {
//     httpOnly: true,
//     secure: true,
//     sameSite: "none",
//     path: "/",
//   };

//   return res
//     .cookie("token", token, options)
//     .status(statusCode)
//     .json({
//       success: true,
//       user,
//     });
// };



const sendToken = (user, statusCode, res) => {
  const token = user.getJwtToken();
  
   const isProd = process.env.NODE_ENV === "production";


  const options = {
    httpOnly: true,
    secure: true,            // ❌ PAS true en local
    sameSite: "none",
    path: "/",
  };

  return res
    .cookie("token", token, options)
    .status(statusCode)
    .json({
      success: true,
      user,
    });
};

export default sendToken;


