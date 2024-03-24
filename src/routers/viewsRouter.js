import express from 'express';
import Product from '../models/productModel.js'; 
import Cart from '../models/cartsModel.js';

const viewsRouter = express.Router();

viewsRouter.get('/', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  res.render('templates/home', { user: req.session.user, cartId: req.session.cartId });
});

viewsRouter.get('/login', async (req, res) => {
  try {
    res.render('templates/login');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error inesperado');
  }
});

viewsRouter.get('/register', (req, res) => {
  res.render('templates/register');
});

viewsRouter.get('/logout', (req, res) => {
  res.render('templates/home');
});

viewsRouter.get('/products', async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const products = await Product.find({})
      .lean()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    res.render('templates/products', { products, page: parseInt(page), limit: parseInt(limit), cartId: req.session.cartId });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los productos');
  }
});


viewsRouter.get('/products/:pid', async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid).lean();
    res.render('templates/productDetail', { product, cartId: req.session.cartId });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener el producto');
  }
});


viewsRouter.get('/carts/:cid', async (req, res) => {

  if (req.session.user && req.session.cartId) {
    try {

      const cart = await Cart.findById(req.session.cartId).populate('products.id_prod').lean();
      if (cart) {
    
        return res.render('templates/cartDetail', { cart: cart, user: req.session.user });
      } else {
        return res.status(404).send('Carrito no creado.');
      }
    } catch (error) {
      console.error(error);
      return res.status(500).send(`Error al obtener el carrito: ${error.message}`);
    }
  } else {
    return res.redirect('/login');
  }
});

viewsRouter.get('/chat', (req, res) => {
    res.render('templates/chatBot', { user: req.session.user });
});
  
  
export default viewsRouter;
