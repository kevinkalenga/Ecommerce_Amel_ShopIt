import express from 'express'
import { getProducts, newProduct } from '../controllers/productController.js'
const router = express.Router();

router.route("/products").get(getProducts)
router.route("/admin/products").post(newProduct)

export default router;

// npm run seeder