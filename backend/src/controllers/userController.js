import passport from 'passport'
import UserModel from '../models/userModel.js';
import bcrypt from 'bcrypt';
import cartsModel from '../models/cartsModel.js';

// Nuevo usuario
export const registerUser = async (req, res) => {
    const { name, lastname, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        let newUser = new UserModel({ name, lastname, email, password: hashedPassword });
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
            req.session.save();

            return res.redirect('/');
        });
    } catch (error) {
        console.error('Register Error:', error);
        res.status(400).send(error);
    }
};

// GitHub
export const authenticateGitHub = (req, res, next) => {
    console.log("Iniciando autenticación con GitHub");
    passport.authenticate('github', { scope: ['user:email'] })(req, res, next);
};


export const githubSession = async (req, res) => {
    console.log("Callback de GitHub alcanzado");
    if (!req.user) {
        console.error('No user found after GitHub auth');
        return res.redirect('/login');
    }

    req.session.user = {
        email: req.user.email,
        name: req.user.name
    };

    // Verificar y crear carrito
    let cart = await cartsModel.findOne({ user: req.user._id });
    if (!cart) {
        cart = await cartsModel.create({ user: req.user._id, products: [] });
    }

    req.session.cartId = cart._id;
    req.session.save(() => {
        res.redirect('/');
    });
};
