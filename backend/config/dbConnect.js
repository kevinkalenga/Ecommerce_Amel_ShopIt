// import mongoose from "mongoose";

// export const connectedDatabase = () => {
//    let DB_URI = ""

//    if(process.env.NODE_ENV === "DEVELOPMENT") DB_URI = process.env.DB_URI_LOCAL;
//    if(process.env.NODE_ENV === "PRODUCTION") DB_URI = process.env.DB_URI;
//    mongoose.connect(DB_URI).then((con) => {
//       console.log(`Connexion avec le host: ${con?.connection?.host}`)
//    })

// }


import mongoose from "mongoose";

export const connectedDatabase = () => {
   const DB_URI = process.env.DB_URI;

   if (!DB_URI) {
      throw new Error("DB_URI manquant dans les variables d'environnement");
   }

   mongoose.connect(DB_URI).then((con) => {
      console.log(`Connexion avec le host: ${con.connection.host}`);
   });
};