import passport from 'passport';
import UserModel from '../models/userModel.js';
import { generateToken } from '../config/auth.js';
import cartsModel from '../models/cartsModel.js';

// Nuevo usuario
export const registerUser = async (req, res) => {
  const { name, lastname, email, password } = req.body;
  try {

    let newUser = new UserModel({ name, lastname, email, password });
    newUser = await newUser.save();

    req.login(newUser, async (err) => {
      if (err) {
        console.error('Error:', err);
        return res.status(500).send(err);
      }

      // Crear un carrito vacío para el nuevo usuario
      let cart = await cartsModel.findOne({ user: newUser._id });
      if (!cart) {
        cart = await cartsModel.create({ user: newUser._id, products: [] });
      }

      req.session.cartId = cart._id;
      req.session.save((err) => {
        if (err) {
          console.error('Error saving session:', err);
          return res.status(500).send(err);
        }
        const token = generateToken(newUser); 
        res.redirect('/');
      });
    });

  } catch (error) {
    console.error('Register Error:', error);
    return res.status(400).send(error);
  }
};


// GitHub
export const authenticateGitHub = (req, res, next) => {
  console.log("Iniciando autenticación con GitHub");
  passport.authenticate('github', { scope: ['user:email'] })(req, res, next);
};

export const githubSession = async (req, res, next) => {
  passport.authenticate('github', async (err, user, info) => {
    if (err) {
      console.error('Error during GitHub authentication:', err);
      return next(err);
    }
    if (!user) {
      console.error('No user found after GitHub auth');
      return res.redirect('/login');
    }

    req.logIn(user, async (err) => {
      if (err) {
        console.error('Error logging in:', err);
        return next(err);
      }

      req.session.user = {
        email: user.email,
        name: user.name
      };

      // Verificar y crear carrito
      let cart = await cartsModel.findOne({ user: user._id });
      if (!cart) {
        cart = await cartsModel.create({ user: user._id, products: [] });
      }

      req.session.cartId = cart._id;
      req.session.save((err) => {
        if (err) {
          console.error('Error saving session:', err);
          return res.status(500).send(err);
        }
        const token = generateToken(user); 
        res.redirect('/');
      });
    });
  })(req, res, next);
};
