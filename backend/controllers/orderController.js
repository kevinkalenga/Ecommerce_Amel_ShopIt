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

       if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
        return next(new ErrorHandler("Aucun produit dans la commande", 400));
    }
    
    // creéer une commande 
    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxAmount,
        shippingAmount,
        totalAmount,
        paymentMethod: "Card",
        paymentInfo:{
           id: session.payment_intent,
           status: session.payment_status
        },
         user: userId
        // user: req.user._id
    })

    res.status(200).json({
        order,
    })
})

// Get order details => /api/v1/orders/:id 

export const getOrderDetails = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "name email");

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
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::: Sales and Orders 

// Get Sales Data => /api/v1/admin/get_sales
async function getSalesDate(startDate, endDate) {
     const salesData = await Order.aggregate([
        {
            // filtrer le resultat 
            $match: {
                createdAt: {
                   
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                },
                //   orderStatus: "Delivered",
            }
        },
        {
            // Group data 
            $group: {
                _id: {
                    date: {$dateToString: {format: "%Y-%m-%d", date: "$createdAt"}}
                },
                 totalSales: {$sum: "$totalAmount"},
                 numOrder: {$sum: 1}
            },
          
        },
        {
            // Trier par date
            $sort: {"_id.date": 1}
        }
     ])

     return salesData
}




function getDateBetween(startDate, endDate) {
    const dates = []
    let currentDate = new Date(startDate)

    while (currentDate <= new Date(endDate)) {
        const formattedDate = currentDate.toISOString().split("T")[0];
        dates.push(formattedDate);
        currentDate.setDate(currentDate.getDate() + 1)
    }
    return dates
}





export const getSales = catchAsyncErrors(async (req, res, next) => {
    const startDate = new Date(req.query.startDate)
    const endDate = new Date(req.query.endDate)

   startDate.setHours(0, 0, 0, 0)
   endDate.setHours(23, 59, 59, 999)

   // Recup les ventes depuis mongodb

    const salesDate = await getSalesDate(startDate, endDate)
     // Gestion de toutes les dates
    const allDates = getDateBetween(startDate, endDate)

    // Completer les dates manquantes 
    const finalSalesDate = allDates.map((date) => {
        // On compare avec la date en db
        const found = salesDate.find((s) => s._id.date === date);
        return found ? found : {_id: {date}, totalSales: 0, numOrder: 0}
    })

    // Totalisation 
    const totalSales = finalSalesDate.reduce((acc, cur) => acc + cur.totalSales, 0)
    const totalOrders = finalSalesDate.reduce((acc, cur) => acc + cur.numOrder, 0)
   
   
   res.status(200).json({
         success: true,
         salesDate: finalSalesDate,
         totalSales,
         totalOrders
         
     })
})


