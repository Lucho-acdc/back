import express from 'express';
import { createCart, getCartById, clearCart } from '../controllers/cartsController.js';

const router = express.Router();


router.post('/', createCart);
router.get('/:cid', getCartById);
router.post('/:cid/clear', clearCart);

export default router;
