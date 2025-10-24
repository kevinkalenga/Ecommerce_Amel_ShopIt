import Product from "../models/productModel.js"
export const getProducts = async (req, res) => {
    res.status(200).json({
        message:"Tous les produits"
    })
}

//Créer le produit => /api/v1/admin/products
export const newProduct = async (req, res) => {
   const product = await Product.create(req.body)
   res.status(200).json({
    product
   })
}