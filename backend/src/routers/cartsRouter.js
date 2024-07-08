import express from 'express';
import { addProductToCart, getCartById, clearCart, purchaseCart, createCart } from '../controllers/cartsController.js';

const router = express.Router();

router.post('/', createCart);
router.get('/:cid', getCartById);
router.post('/:cid/clear', clearCart);
router.post('/:cid/product/:pid', addProductToCart);
router.post('/purchase', purchaseCart);

export default router;
