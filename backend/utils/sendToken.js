

const sendToken = (user, statusCode, res) => {
  const token = user.getJwtToken();

  const options = {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
    sameSite: "lax",
    secure: true,
    
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    token
  });
};

export default sendToken;


// export default (user, statusCode, res) => {
//   const token = user.getJwtToken();

//   const days = Number(process.env.COOKIE_EXPIRES_TIME || 7);

//   res.cookie("token", token, {
//     httpOnly: true,
//     secure: true,        // 🔥 obligatoire HTTPS
//     sameSite: "none",    // 🔥 obligatoire cross-site
//     expires: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
//   });

//   res.status(statusCode).json({
//     success: true,
//     token,
//     user,
//   });
// };