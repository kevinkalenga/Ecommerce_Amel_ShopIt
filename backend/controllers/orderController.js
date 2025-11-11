import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import Order from "../models/orderModel.js"
import ErrorHandler from "../utils/errorHandler.js";
import Product from "../models/productModel.js"

// Create new Order => /api/v1/orders/new 

export const newOrder = catchAsyncErrors(async (req, res, next) => {
    // Recevoir le detail à partir de body
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxAmount,
        shippingAmount,
        totalAmount,
        paymentMethod,
        paymentInfo
    } = req.body

    // creéer une commande 
    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxAmount,
        shippingAmount,
        totalAmount,
        paymentMethod,
        paymentInfo,
        user: req.user._id
    })

    res.status(200).json({
        order,
    })
})

// Get order details => /api/v1/orders/:id 

export const getOrderDetails = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "name email")

    if(!order) {
        return next(new ErrorHandler("No order found with this ID", 404))
    }

    res.status(200).json({
        order,
    })
})

// Get current user orders => /api/v1/me/orders

export const myOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find({user: req.user._id})

    res.status(200).json({
        orders
    })
})

// Get all orders - Admin => /api/v1/admin/orders

export const allOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find()

    res.status(200).json({
        orders
    })
})

// Update orders - Admin => /api/v1/admin/orders 

export const updateOrder = catchAsyncErrors(async (req, res, next) => {

    // On cherche la commande dans la base par son ID, reçu dans les paramètres de la requête
    const order = await Order.findById(req.params.id)

    // Si aucune commande n’est trouvée, on renvoie une erreur 404 (Not Found)
    if(!order) {
        return next(new ErrorHandler("No order found with this ID", 404))
    }

    // Si la commande est déjà livrée, on bloque la mise à jour et renvoie une erreur 400 (Bad Request)
    if(order?.orderStatus === "Delivered") {
        return next(new ErrorHandler("You have already delivered this order", 400))
    }


    // Mise à jour 

    for(const item of order.orderItems) {
       const product = await Product.findById(item?.product?.toString())
       if(!product) {
         return new ErrorHandler(
            "No product found with ID: "  + item?.product
         )
       }

       product.stock -= item.quantity 

       await product.save({validateBeforeSave: false})
    }

    order.orderStatus = req.body.status 
    if(req.body.status === "Delivered") {
        order.deliveredAt = Date.now()
    }

    await order.save()

    res.status(200).json({
         success: true
     })

    
    
    
    
    
    // --- Mise à jour du stock des produits liés à cette commande ---
    // On parcourt chaque article (item) de la commande
    // order?.orderItems?.forEach(async (item) => {

    //     // On récupère le produit correspondant à cet article, via son ID
    //     const product = await Product.findById(item?.product?.toString())

    //     // Si le produit n’existe pas (supprimé, par exemple), on renvoie une erreur 404
    //     if(!product) {
    //         return next(new ErrorHandler("No product found with this ID", 404))
    //     } 

    //     // On diminue le stock du produit selon la quantité commandée
    //     product.stock = product.stock - item.quantity 

    //     // On sauvegarde la mise à jour du produit sans revalider le schéma (validateBeforeSave: false)
    //     await product.save({validateBeforeSave: false})
    // })

    // // On met à jour le statut de la commande selon la valeur reçue dans req.body.status
    // order.orderStatus = req.body.status;

    // // On enregistre la date de livraison actuelle
    // order.deliveredAt = Date.now()

    // // On sauvegarde la commande mise à jour dans la base
    // await order.save();

    // // On renvoie une réponse de succès (HTTP 200)
    // res.status(200).json({
    //     success: true
    // })
})

// Delete order - Admin => /api/v1/admin/orders/:id 

export const deleteOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id)

    if(!order) {
        return next(new ErrorHandler("No order found with this ID", 404))
    }

    await order.deleteOne()

    res.status(200).json({
         success: true
     })
})