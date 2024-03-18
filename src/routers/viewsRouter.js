import express from 'express';
import Product from '../models/productModel.js'; 
import Cart from '../models/cartsModel.js';

const viewsRouter = express.Router();

//Traigo el home para que no quede vacio

viewsRouter.get('/', async (req, res) => {
    try {
      res.render('templates/home');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener los productos');
    }
  });

viewsRouter.get('/products', async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const products = await Product.find({})
      .lean()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    res.render('templates/products', { products, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los productos');
  }
});


viewsRouter.get('/products/:pid', async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid);
    res.render('templates/productDetail', { product });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener el producto');
  }
});


viewsRouter.get('/carts/:cid', async (req, res) => {
    try {
        
      const cart = await Cart.findById(req.params.cid).populate('products.id_prod');
      if (!cart) {
        return res.status(404).send('Carrito no encontrado');
      }
      res.render('templates/cartDetail', { cart });
    } catch (error) {
      console.error(error);
      res.status(500).send(`Error al obtener el carrito: ${error.message}`);
    }
  });
  
  
export default viewsRouter;
