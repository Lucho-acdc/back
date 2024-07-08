import cartsModel from '../models/cartsModel.js';
import Ticket from '../models/ticketModel.js';
import Product from '../models/productModel.js';
import { sendMail } from '../config/mailer.js';
import logger from '../config/logger.js';

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
        res.redirect('/cart');
    } catch (error) {
        console.error("Error al vaciar el carrito:", error);
        res.status(500).send("Error al vaciar el carrito.");
    }
};

// Agregar un producto al carrito
export const addProductToCart = async (req, res) => {
    const { cid, pid } = req.params;
  
    try {
      const cart = await cartsModel.findById(cid);
      if (!cart) {
        return res.status(404).json({ message: 'Carrito no encontrado' });
      }
  
      const product = await Product.findById(pid);
      if (!product) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
  
      // Verificar si el producto ya está en el carrito
      const existingProductIndex = cart.products.findIndex(p => p.id_prod.toString() === pid);
      if (existingProductIndex > -1) {
        cart.products[existingProductIndex].quantity += 1;
      } else {
        cart.products.push({ id_prod: product._id, quantity: 1 });
      }
  
      await cart.save();
      
      res.redirect('/cart');
    } catch (err) {
      console.error('Error al agregar producto al carrito:', err);
      res.status(500).json({ message: 'Error al agregar producto al carrito' });
    }
  };

  

  export const purchaseCart = async (req, res) => {
    const { name, email, address } = req.body;
    const cartId = req.session.cartId;
  
    try {
      const cart = await cartsModel.findById(cartId).populate('products.id_prod');
      if (!cart) {
        return res.status(404).json({ message: 'Carrito no encontrado' });
      }
  
      let totalAmount = 0;
      const purchaseProducts = [];
  
      for (const item of cart.products) {
        const product = await Product.findById(item.id_prod._id);
        if (product.stock >= item.quantity) {
          product.stock -= item.quantity;
          await product.save();
          totalAmount += item.id_prod.price * item.quantity;
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
  
      cart.products = [];
      await cart.save();
  
      const emailContent = `
        <h1>Gracias por tu compra, ${name}</h1>
        <p>Dirección: ${address}</p>
        <p>Total: $${totalAmount}</p>
        <p>Ticket de Compra: ${newTicket.code}</p>
        <ul>
          ${purchaseProducts.map(item => `
            <li>
              Producto: ${item.id_prod.title} - Precio: $${item.id_prod.price} - Cantidad: ${item.quantity}
            </li>`).join('')}
        </ul>
      `;
      await sendMail(email, 'Confirmación de Compra', emailContent);
  
      res.render('templates/confirmation', { name });
    } catch (error) {
      logger.error('Error al finalizar la compra:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };