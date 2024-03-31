import express from 'express';
import passport from 'passport';
import UserModel from '../models/userModel.js';
import bcrypt from 'bcrypt';
import cartsModel from '../models/cartsModel.js';

const userRouter = express.Router();

userRouter.post('/register', async (req, res) => {
  try {
      const { name, lastname, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      
      let newUser = new UserModel({ name, lastname, email, password: hashedPassword });
      newUser = await newUser.save();
      console.log(newUser);

      req.login(newUser, async (err) => {
            if (err) {
              console.error('Error:', err);
              return res.status(500).send(err);
            }
      
            let cart = await cartsModel.findOne({ user: newUser._id });
            if (!cart) {
              cart = await cartsModel.create({ user: newUser._id, products: [] });
            }
      
            req.session.cartId = cart._id;
            req.session.save();
      
            return res.redirect('/');
      });
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
});



userRouter.post('/login', (req, res, next) => {
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

      let cart = await cartsModel.findOne({ user: user._id });
      if (!cart) {
        cart = await cartsModel.create({ user: user._id, products: [] });
      }

      req.session.cartId = cart._id;
      req.session.save();

      return res.redirect('/');
    });
  })(req, res, next);
});



userRouter.post('/logout', (req, res) => {
  req.logout(() => {
      res.redirect('/login');
  });
});


userRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => { r })

userRouter.get('/githubSession', passport.authenticate('github', { failureRedirect: '/login' }), async (req, res) => {

  if (!req.user) {
      console.error('No user found after GitHub auth');
      return res.redirect('/login');
  }

  req.session.user = {
      email: req.user.email,
      name: req.user.name
  };

  try {
      let cart = await cartsModel.findOne({ user: req.user._id });
      
      if (!cart) {
          cart = await cartsModel.create({ user: req.user._id, products: [] });
          console.log('New cart created for GitHub user:', cart);
      }

      req.session.cartId = cart._id;
      req.session.save(err => {
          if (err) {
              console.error('Error saving session:', err);
              return res.status(500).send('Error saving session');
          }
          res.redirect('/');
      });
  } catch (error) {
      console.error('Error GitHub session:', error);
      res.status(500).send('Error GitHub session');
  }
});



export default userRouter;
