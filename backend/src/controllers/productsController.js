import productModel from "../models/productModel.js";
import logger from '../config/logger.js';

export const getAllProducts = async (req, res) => {
    try {
        const { limit, page, filter, sort } = req.query;
        let metFilter;
        const pag = page || 1;
        const limi = limit || 10;

        if (filter === "true" || filter === "false") {
            metFilter = "status";
        } else if (filter) {
            metFilter = "category";
        }

        const query = metFilter ? { [metFilter]: filter } : {};
        const sortQuery = sort ? { price: sort } : {};

        const products = await productModel.paginate(query, { limit: limi, page: pag, sort: sortQuery });
        
        logger.info('Productos obtenidos correctamente');
        res.status(200).send(products);
    } catch (error) {
        logger.error('Error al obtener productos:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getProductById = async (req, res) => {
    try {
        const productId = req.params.pid;
        const product = await productModel.findById(productId);
        
        if (product) {
            logger.info(`Producto ${productId} obtenido correctamente`);
            res.json(product);
        } else {
            logger.warn(`Producto ${productId} no encontrado`);
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        logger.error(`Error al obtener el producto ${req.params.pid}:`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const createProduct = async (req, res) => {
    try {
        const newProduct = req.body;
        await productModel.create(newProduct);
        logger.info('Producto creado correctamente:', newProduct);
        res.status(201).json({ message: 'Product added successfully' });
    } catch (error) {
        logger.error('Error al crear producto:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const productId = req.params.pid;
        const updatedFields = req.body;
        await productModel.findByIdAndUpdate(productId, updatedFields);
        logger.info(`Producto ${productId} actualizado correctamente`);
        res.json({ message: 'Product updated successfully' });
    } catch (error) {
        logger.error(`Error al actualizar el producto ${req.params.pid}:`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.pid;
        await productModel.findByIdAndDelete(productId);
        logger.info(`Producto ${productId} eliminado correctamente`);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        logger.error(`Error al eliminar el producto ${req.params.pid}:`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
