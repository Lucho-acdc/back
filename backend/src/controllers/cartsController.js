import cartsModel from '../models/cartsModel.js';


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
