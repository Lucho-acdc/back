import express from 'express';
import { CartManager } from '../cartManager.js';

const cartsRouter = express.Router();
const cartManager = new CartManager();

cartsRouter.post('/', async (req, res) => {
  try {
    const newCart = req.body;
    await cartManager.createCart(newCart);
    res.status(201).json({ message: 'Cart created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

cartsRouter.get('/:cid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartManager.getCartById(cartId);
    
    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ error: 'Cart not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

cartsRouter.post('/:cid/product/:pid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;
    
    await cartManager.addProductToCart(cartId, productId, quantity);
    res.status(201).json({ message: 'Product added to cart successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default cartsRouter;
