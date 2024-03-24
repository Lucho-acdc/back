import express from 'express';
import UserModel from '../models/userModel.js';
import Cart from '../models/cartsModel.js';
import bcrypt from 'bcrypt';

const userRouter = express.Router();

// Registro de usuario
userRouter.post('/register', async (req, res) => {
  try {
    const newUser = new UserModel(req.body);
    await newUser.save(); 
    res.redirect('/'); 
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

userRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (user && await bcrypt.compare(password, user.password)) {

      const cart = await findOrCreateCart(user._id);


      req.session.userId = user._id;
      req.session.cartId = cart._id;
      req.session.user = { name: user.name }; 

      req.session.save(err => {
        if (err) {
          console.error('Error al guardar la sesión:', err);
          res.status(500).send('Error al iniciar sesión');
        } else {
          res.redirect('/');
        }
      });
    } else {
      res.status(401).send('Credenciales inválidas');
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).send('Error al procesar el inicio de sesión');
  }
});

async function findOrCreateCart(userId) {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = new Cart({ user: userId, products: [] });
    await cart.save();
  }
  return cart;
}

// Cerrar sesión
userRouter.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ message: 'Could not log out, an error occurred' });
    } else {
      res.redirect('/login'); 
    }
  });
});

export default userRouter;
