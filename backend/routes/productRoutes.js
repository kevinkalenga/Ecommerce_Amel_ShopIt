import express from 'express'
import { getProducts, newProduct, getProductDetails } from '../controllers/productController.js'
const router = express.Router();

router.route("/products").get(getProducts)
router.route("/admin/products").post(newProduct)
router.route("/products/:id").get(getProductDetails)

export default router;

// npm run seeder