import express from 'express'
import { isAuthenticatedUser } from '../middleware/auth.js'
import { stripeCheckoutSession } from '../controllers/paymentController.js'
import bodyParser from 'body-parser'

const router = express.Router();

router.post("/payment/checkout_session", isAuthenticatedUser, stripeCheckoutSession)

export default router