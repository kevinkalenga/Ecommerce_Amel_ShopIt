import express from 'express'
import { getProducts } from '../controllers/productController.js'
const router = express.Router();

router.route("/products").get(getProducts)

export default router;

// npm run seeder