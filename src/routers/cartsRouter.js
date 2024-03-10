import express from 'express';
import cartsModel from '../models/cartsModel.js';

const cartsRouter = express.Router();

cartsRouter.post('/', async (req, res) => {
  try {
    const newCart = req.body;
    await cartsModel.create(newCart);
    res.status(201).json({ message: 'Cart created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

cartsRouter.get('/:cid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartsModel.findById(cartId);
    
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
    
    const cart = await cartsModel.findById(cartId);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const productExist = cart.products.findIndex(p => p.id_prod.toString() === productId);

    if (productExist > -1) {
      cart.products[productExist].quantity = quantity;
    } else {
      cart.products.push({ id_prod: productId, quantity });
    }

    await cart.save();
    res.status(201).json({ message: 'Product added to cart successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


export default cartsRouter;
