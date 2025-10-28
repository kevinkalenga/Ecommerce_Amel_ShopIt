import Product from "../models/productModel.js"
import ErrorHandler from '../utils/errorHandler.js'
import catchAsyncErrors from "../middleware/catchAsyncErrors.js"

//Créer le produit => /api/v1/admin/products
export const newProduct = catchAsyncErrors(async (req, res) => {
   const product = await Product.create(req.body)
   res.status(200).json({
    product
   })
})

//Obtenir tous les produits  => /api/v1/products

export const getProducts = catchAsyncErrors(async (req, res) => {
    const products = await Product.find()

    res.status(200).json({
        products
    })
})
//Obtenir un produit à partir de son id  => /api/v1/products/:id

export const getProductDetails = catchAsyncErrors(async (req, res, next) => {
    
     const product = await Product.findById(req?.params.id)
    
    
    if(!product) {
       return next(new ErrorHandler("Produit non trouvé", 404))
    }
    
   

    res.status(200).json({
        product
    })
})

// Mettre à jour un produit (Admin) => /api/v1/products/:id

export const updateProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findByIdAndUpdate(req?.params.id, req.body, { new: true});
    
     if(!product) {
       return next(new ErrorHandler("Produit non trouvé", 404))
    }
    
    res.status(200).json({
        product,
    })
})
export const deleteProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req?.params.id);
    
     if(!product) {
       return next(new ErrorHandler("Produit non trouvé", 404))
    }
    await product.deleteOne();
    res.status(200).json({
        message: "Produit supprimé"
    })
})
