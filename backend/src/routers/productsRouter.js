import express from 'express';
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productsController.js';
import { authenticate } from '../controllers/sessionController.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:pid', getProductById);
router.post('/', authenticate, createProduct);
router.put('/:pid', authenticate, updateProduct);
router.delete('/:pid', authenticate, deleteProduct);

export default router;
