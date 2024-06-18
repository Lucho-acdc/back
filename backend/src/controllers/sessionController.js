import passport from 'passport';
import cartsModel from '../models/cartsModel.js';
import UserModel from '../models/userModel.js';
import { generateToken } from '../config/auth.js';
import jwt from 'jsonwebtoken';
import { sendResetPasswordEmail } from '../config/mailer.js'

export const renderRequestResetPassword = (req, res) => {
  res.render('templates/requestResetPassword', { layout: 'main' });
};

export const requestResetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      console.error('Usuario no encontrado.');
      return res.status(404).send('Usuario no encontrado.');
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    await sendResetPasswordEmail(email, token);

    res.send('Se ha enviado un enlace de restablecimiento de contraseña a tu correo.');
  } catch (error) {
    console.error('Error al manejar la solicitud de restablecimiento de contraseña:', error);
    res.status(500).send('Error al manejar la solicitud de restablecimiento de contraseña.');
  }
};

export const renderResetPassword = (req, res) => {
  const { token } = req.query;
  res.render('templates/resetPassword', { layout: 'main', token });
};

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decoded.userId);

    if (!user) {
      return res.status(404).send('Usuario no encontrado.');
    }

    user.password = password;
    await user.save();

    res.send('Tu contraseña ha sido restablecida exitosamente.');
  } catch (error) {
    console.error('Error al restablecer la contraseña:', error);
    res.status(500).send('Error al restablecer la contraseña.');
  }
};

// Login
export const loginUser = (req, res, next) => {
  passport.authenticate('local', async (err, user, info) => {
    if (err) {
      console.error('Error during authentication:', err);
      return next(err);
    }
    if (!user) {
      console.log('Authentication failed:', info.message);
      return res.redirect('/login');
    }
      req.logIn(user, async (err) => {
        if (err) {
          console.error('Error logging in:', err);
          return next(err);
        }

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

// Logout
export const logoutUser = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/login');
  });
};

export const authenticate = (req, res, next) => {

  if (process.env.NODE_ENV === 'test') {
    return next();
  }

  const token = req.header('Authorization').replace('Bearer ', '');

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};
