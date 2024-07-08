import express from 'express';
import Product from '../models/productModel.js'; 
import Cart from '../models/cartsModel.js';
import { getAllUsers, updateUserRole, deleteUser } from '../controllers/userController.js';
import { checkAdmin } from '../config/auth.js';
import { purchaseCart } from '../controllers/cartsController.js'; 

const viewsRouter = express.Router();

viewsRouter.get('/', (req, res) => {
  if (!req.session.passport) {
    return res.redirect('/login');
  }

  res.render('templates/home', { user: req.user.name, cartId: req.session.cartId });
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
  const isAdmin = req.user && req.user.role === 'admin';
  const { page = 1, limit = 10 } = req.query;
  const cartId = req.session.cartId;
  console.log(cartId);
  console.log(isAdmin);
  try {
    const products = await Product.find({})
      .lean()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    res.render('templates/products', { products, page: parseInt(page), limit: parseInt(limit), user: req.user.name, cartId, isAdmin });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los productos');
  }
});


viewsRouter.get('/products/:pid', async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid).lean();
    const isAdmin = req.user && req.user.role === 'admin';
    const cartId = req.session.cartId;
    console.log(`Cart ID in session: ${cartId}`);
    res.render('templates/productDetail', { product, cartId, isAdmin });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener el producto');
  }
});

viewsRouter.get('/cart', async (req, res) => {
  if (!req.session.cartId) {
    return res.status(400).send('No se ha encontrado un carrito para este usuario.');
  }

  try {
    const cart = await Cart.findById(req.session.cartId).populate('products.id_prod').lean();
    res.render('templates/cartDetail', { cart });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener el carrito');
  }
});

viewsRouter.get('/carts/:cid', async (req, res) => {

  if (req.session.passport.user && req.session.cartId) {
    try {

      const cart = await Cart.findById(req.session.cartId).populate('products.id_prod').lean();
      if (cart) {
    
        return res.render('templates/cartDetail', { cart: cart, user: req.user.name });
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

viewsRouter.get('/confirmation', (req, res) => {
  res.render('templates/confirmation', { user: req.user.name });
});

viewsRouter.get('/checkout', (req, res) => {
  res.render('templates/checkout');
});

viewsRouter.post('/purchase', async (req, res) => {
  await purchaseCart(req, res);
});

viewsRouter.get('/admin/users', checkAdmin, async (req, res) => {
  try {
    const users = await getAllUsers();
    res.render('templates/users',  { users, isAdminView: true });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los usuarios');
  }
});

viewsRouter.post('/admin/users/update-role', checkAdmin, updateUserRole);
viewsRouter.post('/admin/users/delete', checkAdmin, deleteUser);

viewsRouter.get('/chat', (req, res) => {
    res.render('templates/chatBot', { user: req.user.name });
});
  
  
export default viewsRouter;
