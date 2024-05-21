import cartsModel from '../models/cartsModel.js';
import Ticket from '../models/ticketModel.js';
import Product from '../models/productModel.js';

export const createCart = async (req, res) => {
    try {
        const userId = req.session.passport.user;
        const cart = await cartsModel.create({ user: userId, products: [] });

        req.session.cartId = cart._id;
        req.session.save();

        console.log("Nuevo carrito creado con ID:", cart._id);
        res.status(201).send(cart); 
    } catch (error) {
        console.error("Error al crear el carrito:", error);
        res.status(500).send("No se pudo crear el carrito.");
    }
};


export const getCartById = async (req, res) => {
    try {
        const cart = await cartsModel.findById(req.params.cid).populate('products.id_prod');
        if (!cart) {
            console.log("Carrito no encontrado con ID:", req.params.cid);
            return res.status(404).send("Carrito no encontrado.");
        }
        res.send(cart);
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        res.status(500).send("Error al obtener el carrito.");
    }
};

export const clearCart = async (req, res) => {
    try {
        const updatedCart = await cartsModel.findByIdAndUpdate(req.params.cid, { $set: { products: [] } }, { new: true });
        if (!updatedCart) {
            console.log("No se encontró el carrito para vaciar con ID:", req.params.cid);
            return res.status(404).send("Carrito no encontrado.");
        }
        console.log("Carrito vaciado con éxito.");
        res.send(updatedCart);
    } catch (error) {
        console.error("Error al vaciar el carrito:", error);
        res.status(500).send("Error al vaciar el carrito.");
    }
};

export const purchaseCart = async (req, res) => {
    try {
        const cart = await Cart.findById(req.session.cartId).populate('products.product');
        if (!cart) {
            return res.status(404).send('Carrito no encontrado');
        }

        let totalAmount = 0;
        const purchaseProducts = [];

        for (const item of cart.products) {
            const product = await Product.findById(item.product._id);
            if (product.stock >= item.quantity) {
                product.stock -= item.quantity;
                await product.save();
                totalAmount += item.product.price * item.quantity;
                purchaseProducts.push(item);
            }
        }

        if (purchaseProducts.length === 0) {
            return res.status(400).send('No hay productos disponibles para la compra');
        }

        const newTicket = new Ticket({
            code: Math.random().toString(36).substring(2, 15),
            amount: totalAmount,
            purchaser: req.user._id
        });

        await newTicket.save();

        cart.products = cart.products.filter(item => !purchaseProducts.includes(item));
        await cart.save();

        res.status(200).json(newTicket);
    } catch (error) {
        res.status(500).send("Error procesando la compra: " + error.message);
    }
};
