import passport from 'passport';
import cartsModel from '../models/cartsModel.js';

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
            req.session.save();

            return res.redirect('/');
        });
    })(req, res, next);
};

// Logout
export const logoutUser = (req, res) => {
    req.logout(() => {
        res.redirect('/login');
    });
};
