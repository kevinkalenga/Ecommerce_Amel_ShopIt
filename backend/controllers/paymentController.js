import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import Stripe from "stripe"
import Order from "../models/orderModel.js"

import path from 'path'
import dotenv from 'dotenv'

dotenv.config({path: path.resolve('./backend/config/config.env')})


// export const stripeCheckoutSession = catchAsyncErrors(async (req, res, next) => {
//     const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
//     // Recup les données envoyées dans le body 
//     const {orderItems, shippingInfo, itemsPrice} = req.body 
//     // Créer les lines items pour les produits commandés 
//     const line_items = orderItems.map((item) => ({
//         price_data: {
//             currency: "usd",
//             product_data: {
//                 name:item.name,
//                 images: [item.image],
//                 metadata: {productId: item.product},
//             },

//             unit_amount: item.price*100,

//         },
//         quantity: item.quantity
//     }));

//     // Creation d'une session stripe 
//     const session = await stripe.checkout.sessions.create({
//         // definition de moyen de paiement autorisé 
//         payment_method_types: ["card"],
//         // La liste des produits à payer
//         line_items,
//         mode:"payment",
//         // L'email du client pre-rempli sur la page de stripe
//         customer_email: req.user.email,
//         client_reference_id:req.user._id.toString(),
//         success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
//         // paiement annulé 
//         cancel_url: `${process.env.FRONTEND_URL}/cart`,

//         metadata: {
//             shippingInfo:JSON.stringify(shippingInfo),
//             itemsPrice,
//             orderItems: JSON.stringify(orderItems),
//         },
//     });

//     res.status(200).json({url:session.url});
// })

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeCheckoutSession = catchAsyncErrors(async (req, res, next) => {

  const {
    orderItems,
    shippingInfo,
    itemsPrice,
    taxAmount,
    shippingAmount,
    totalAmount,
  } = req.body;

  // 🔐 Validation minimale (optionnel mais conseillé)
  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: "No order items" });
  }

  // 1️⃣ Créer la commande AVANT Stripe
  const order = await Order.create({
    user: req.user._id,
    orderItems,

    shippingInfo: {
      address: shippingInfo.address,
      city: shippingInfo.city,
      phoneNo: shippingInfo.phoneNo,
      country: shippingInfo.country,
    },

    itemsPrice,
    taxAmount,
    shippingAmount,
    totalAmount,

    paymentMethod: "Card",
    paymentStatus: "pending",
  });

  // 2️⃣ Line items Stripe
  const line_items = orderItems.map(item => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.name,
        images: [item.image],
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }));

  // 3️⃣ Session Stripe
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items,

    customer_email: req.user.email,
    client_reference_id: req.user._id.toString(),

    success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/cart`,

    metadata: {
      orderId: order._id.toString(),
    },
  });

  res.status(200).json({ url: session.url });
});
