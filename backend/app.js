import express from "express"
import path from 'path'
import dotenv from "dotenv"
dotenv.config({path: 'backend/config/config.env'})
import productRoutes from "./routes/productRoutes.js"
import {connectedDatabase} from './config/dbConnect.js'

const app = express();

connectedDatabase();
app.use('/api/v1', productRoutes)


app.listen(process.env.PORT, () => {
    console.log(`Le serveur est lancé sur le port : ${process.env.PORT} dans ${process.env.NODE_ENV}`)
})

