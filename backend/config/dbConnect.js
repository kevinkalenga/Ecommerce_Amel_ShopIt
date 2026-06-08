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

export const connectedDatabase = async () => {
   const DB_URI = process.env.DB_URI;

   if (!DB_URI) {
      throw new Error("MONGO_URI manquant dans les variables d'environnement");
   }

   try {
      const con = await mongoose.connect(DB_URI);
      console.log(`MongoDB connecté: ${con.connection.host}`);
   } catch (error) {
      console.error("Erreur MongoDB:", error.message);
      process.exit(1);
   }
};