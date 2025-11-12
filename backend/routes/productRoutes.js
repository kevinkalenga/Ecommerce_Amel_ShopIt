import express from 'express'
import { getProducts, newProduct, getProductDetails, updateProduct, deleteProduct, createProductReview, getProductReviews} from '../controllers/productController.js'
import {isAuthenticatedUser, authorizeRoles} from '../middleware/auth.js'
const router = express.Router();

router.route("/products").get(getProducts)
router.route("/admin/products").post(isAuthenticatedUser, authorizeRoles('admin'), newProduct)
router.route("/products/:id").get(getProductDetails)
router.route("/products/:id").put(isAuthenticatedUser, authorizeRoles('admin'), updateProduct)
router.route("/products/:id").delete(isAuthenticatedUser, authorizeRoles('admin'), deleteProduct)

router.route("/reviews").put(isAuthenticatedUser, createProductReview).get(isAuthenticatedUser, getProductReviews)

export default router;

// npm run seeder