import Product from "../models/productModel.js"

//Créer le produit => /api/v1/admin/products
export const newProduct = async (req, res) => {
   const product = await Product.create(req.body)
   res.status(200).json({
    product
   })
}

//Obtenir tous les produits  => /api/v1/products

export const getProducts = async (req, res) => {
    const products = await Product.find()

    res.status(200).json({
        products
    })
}
//Obtenir un produit à partir de son id  => /api/v1/products/:id

export const getProductDetails = async (req, res) => {
    
     const product = await Product.findById(req?.params.id)
    
    
    if(!product) {
        return res.status(404).json({
            error: "Produit non trouvé"
        })
    }
    
   

    res.status(200).json({
        product
    })
}

// Mettre à jour un produit (Admin) => /api/v1/products/:id

export const updateProduct = async (req, res) => {
    let product = await Product.findByIdAndUpdate(req?.params.id, req.body, { new: true});
    if(!product) {
        return res.status(404).json({
            error: "Produit non trouvé"
        })
    }
    res.status(200).json({
        product,
    })
}
