import express from 'express';
import cartsModel from '../models/cartsModel.js';
import Product from '../models/productModel.js';

const cartsRouter = express.Router();

cartsRouter.post('/', async (req, res) => {
  try {

    const userId = req.session.userId;
    const cartId = await cartsModel.create({ user: userId, products: [] });

    req.session.cartId = cartId._id;
    req.session.save();

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Carrito por ID con todos los productos

cartsRouter.get('/:cid', async (req, res) => {
  try {
    console.log(req.params)
    const cartId = req.params.cid;
    const cart = await cartsModel.findById(cartId).populate('products.id_prod');

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Agregar un producto 

cartsRouter.post('/product/:pid', async (req, res) => {
  try {

    const pid = req.params.pid;
    const { quantity } = req.body;
    const cartId = req.session.cartId;

    let cart = await cartsModel.findById(cartId);

    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado." });
    }

    const productIndex = cart.products.findIndex(item => item.id_prod.toString() === pid);

    if (productIndex > -1) {
      console.log("sumo:" + quantity);
      cart.products[productIndex].quantity += parseInt(quantity, 10);
    } else {
      console.log("ingreso:" + quantity);
      cart.products.push({ id_prod: pid, quantity: parseInt(quantity, 10) });
    }

    await cart.save();
    res.redirect(`/carts/${cartId}`);
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

cartsRouter.put('/products/:pid', async (req, res) => {
  try {

    const cartId = req.session.cartId;
    const { pid } = req.params;
    const { quantity } = req.body;

    const cart = await cartsModel.findById(cid);
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    const productIndex = cart.products.findIndex(product => product.id_prod === pid);
    if (productIndex > -1) {
      cart.products[productIndex].quantity = quantity;
    } else {
      return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
    }

    await cart.save();
    res.json({ message: 'Cantidad del producto actualizada con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


// Eliminar todos los productos 

cartsRouter.post('/:cid/clear', async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartsModel.findByIdAndUpdate(cid, { $set: { products: [] } }, { new: true });

    if (cart) {
      res.redirect(`/carts/:cid`);
    } else {
      res.status(404).json({ error: 'Carrito no encontrado' });
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
