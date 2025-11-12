import Product from "../models/productModel.js"
import ErrorHandler from '../utils/errorHandler.js'
import catchAsyncErrors from "../middleware/catchAsyncErrors.js"
import APIFilters from "../utils/apiFilter.js"



//Créer le produit => /api/v1/admin/products
export const newProduct = catchAsyncErrors(async (req, res) => {
    req.body.user = req.user._id
   const product = await Product.create(req.body)
   res.status(200).json({
    product
   })
})

//Obtenir tous les produits  => /api/v1/products

export const getProducts = catchAsyncErrors(async (req, res) => {
    
    const resPerPage = 4;
    
    
    let apiFilters = new APIFilters(Product, req.query).search().filters()
    
    let products = await apiFilters.query

    let filteredProductsCount = products.length

    apiFilters.pagination(resPerPage)

    products = await apiFilters.query.clone()

    res.status(200).json({
        resPerPage,
        filteredProductsCount,
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


// Create/Update product review => /api/v1/reviews

// Déclare et exporte la fonction createProductReview qui gère la création ou la mise à jour d'un avis produit
// catchAsyncErrors est un middleware qui attrape les erreurs asynchrones pour les passer à next()
export const createProductReview = catchAsyncErrors(async (req, res, next) => {

    // Récupère le rating, le commentaire et l'ID du produit depuis le corps de la requête
    const {rating, comment, productId} = req.body 

    // Crée un objet review représentant l'avis de l'utilisateur
    const review = {
        user: req?.user?._id,      
        rating: Number(rating),     
        comment                     
    }

    // Recherche le produit correspondant à productId dans la base de données
    const product = await Product.findById(productId)

    // Si le produit n'existe pas, renvoie une erreur 404 via le middleware ErrorHandler
    if(!product) {
        return next(new ErrorHandler("Product not found", 404))
    }

    // Vérifie si l'utilisateur a déjà laissé un avis sur ce produit
    // find retourne le premier review où l'ID de l'utilisateur correspond
    const isReviewed = product?.reviews.find((r) => r.user.toString() === req?.user?._id.toString())
    
    if(isReviewed) {
        // Si l'utilisateur a déjà évalué, on met à jour son avis existant(commentaires, avis)
        product.reviews.forEach((review) => {
            if(review?.user?.toString() === req?.user?.toString()) {
                review.comment = comment   
                review.rating = rating     
            }
        })
    } else {
        // Sinon, on ajoute le nouvel avis à l'array des reviews
        product.reviews.push(review);
        // Met à jour le nombre total de reviews pour ce produit
        product.numOfReviews = product.reviews.length
    }

    // Calcule la note moyenne du produit à partir des reviews existantes
    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

    // Sauvegarde le produit en base avec les modifications, sans valider tous les champs
    await product.save({validateBeforeSave: false})

    // Renvoie une réponse JSON indiquant que l'opération a réussi
    res.status(200).json({
        success: true
    })
})



