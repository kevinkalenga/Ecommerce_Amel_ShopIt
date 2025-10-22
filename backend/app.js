import express from "express"
import dotenv from "dotenv"
dotenv.config({path: 'backend/config/config.env'})
import productRoutes from "./routes/productRoutes.js"

const app = express();


app.use('/api/v1', productRoutes)


app.listen(process.env.PORT, () => {
    console.log(`Le serveur est lancé sur le port : ${process.env.PORT} dans ${process.env.NODE_ENV}`)
})

