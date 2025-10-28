import express from "express"
import path from 'path'
import dotenv from "dotenv"
dotenv.config({path: 'backend/config/config.env'})
import productRoutes from "./routes/productRoutes.js"
import {connectedDatabase} from './config/dbConnect.js'
import errorMiddleware from './middleware/error.js'

const app = express();

connectedDatabase();

app.use(express.json())
app.use('/api/v1', productRoutes)

// middleware de gestion d erreur
app.use(errorMiddleware)


app.listen(process.env.PORT, () => {
    console.log(`Le serveur est lancé sur le port : ${process.env.PORT} dans ${process.env.NODE_ENV}`)
})


// Gestion des promesses non gérés
process.on('unhandledRejection', (err) => {
    console.log('ERROR:', err)
    console.error('Stack trace', err.stack)
    Server.close(() => {
        process.exit(1)
    })
})

