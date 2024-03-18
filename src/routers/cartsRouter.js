import express from 'express';
import cartsModel from '../models/cartsModel.js';

const cartsRouter = express.Router();

cartsRouter.post('/', async (req, res) => {
  try {
    const newCart = new cartsModel(req.body);
    await newCart.save();
    res.status(201).json({ message: 'Cart created successfully', cartId: newCart._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Carrito por ID con todos los productos

cartsRouter.get('/:cid', async (req, res) => {
  try {

    const cartId = req.params.cid;

    const cart = await cartsModel.findById(cartId).populate('products.id_prod');
    console.log(cartId);
    if (!cart) {
      res.status(404).json({ error: 'Cart not found' });
    } else {
      res.json(cart);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Agregar un producto 

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
      cart.products[productExist].quantity += quantity;
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

// Eliminar un producto

cartsRouter.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartsModel.findById(cid);

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.products = cart.products.filter(product => product.id_prod.toString() !== pid);
    await cart.save();
    res.json({ message: 'Product removed from cart successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Actualizar la cantidad de un producto

cartsRouter.put('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const cart = await cartsModel.findById(cid);
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const productIndex = cart.products.findIndex(product => product.id_prod.toString() === pid);
    if (productIndex > -1) {
      cart.products[productIndex].quantity = quantity;
      await cart.save();
      res.json({ message: 'Product quantity updated successfully' });
    } else {
      res.status(404).json({ error: 'Product not found in cart' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Eliminar todos los productos 

cartsRouter.delete('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartsModel.findByIdAndUpdate(cid, { $set: { products: [] } }, { new: true });

    if (cart) {
      res.json({ message: 'All products removed from cart successfully' });
    } else {
      res.status(404).json({ error: 'Cart not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// La prueba que dijo el profe que nos va a servir para testear

cartsRouter.put('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;

    const cart = await cartsModel.findByIdAndUpdate(cid, { $set: { products } }, { new: true });
    if (cart) {
      res.json({ message: 'Cart updated successfully' });
    } else {
      res.status(404).json({ error: 'Cart not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



export default cartsRouter;
