import express from 'express';
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productsController.js';
import { authenticate } from '../config/auth.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:pid', getProductById);
router.post('/create', authenticate, createProduct);
router.post('/:pid/update', authenticate, updateProduct);
router.post('/:pid/delete', authenticate, deleteProduct);

export default router;
