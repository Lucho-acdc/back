import productModel from "../models/productModel.js";

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
        
        res.status(200).send(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getProductById = async (req, res) => {
    try {
        const productId = req.params.pid;
        const product = await productModel.findById(productId);
        
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const createProduct = async (req, res) => {
    try {
        const newProduct = req.body;
        await productModel.create(newProduct);
        res.status(201).json({ message: 'Product added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const productId = req.params.pid;
        const updatedFields = req.body;
        await productModel.findByIdAndUpdate(productId, updatedFields);
        res.json({ message: 'Product updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.pid;
        await productModel.findByIdAndDelete(productId);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
