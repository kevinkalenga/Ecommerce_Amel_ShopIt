import mongoose from "mongoose";
import Product from "../models/productModel.js"
import products from './data.js'


const seedProduct = async () => {
    try {
        mongoose.connect("mongodb+srv://kalenga10:kalenga10@web.5ddzb9k.mongodb.net/ecommerce?appName=web");
        await Product.deleteMany();
        console.log("Tous les produits sont supprimés")
        
        await Product.insertMany(products)
        console.log("Produits inserés en bd")

        process.exit();
    } catch (error) {
        console.log(error.message)
         process.exit();
    }
}

seedProduct()