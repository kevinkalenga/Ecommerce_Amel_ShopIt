import express from 'express'
import { getProducts, newProduct, getProductDetails, updateProduct, deleteProduct } from '../controllers/productController.js'
import {isAuthenticatedUser, authorizeRoles} from '../middleware/auth.js'
const router = express.Router();

router.route("/products").get(isAuthenticatedUser, authorizeRoles('admin'), getProducts)
router.route("/admin/products").post(newProduct)
router.route("/products/:id").get(getProductDetails)
router.route("/products/:id").put(updateProduct)
router.route("/products/:id").delete(deleteProduct)

export default router;

// npm run seeder