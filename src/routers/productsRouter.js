import express from 'express';
import productModel from "../models/productModel.js"

const productsRouter = express.Router();

productsRouter.get('/', async (req, res) => {
  try {
    const products = await productModel.find();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

productsRouter.get('/:pid', async (req, res) => {
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
});

productsRouter.post('/', async (req, res) => {
  try {
    const newProduct = req.body;
    await productModel.create(newProduct);
    res.status(201).json({ message: 'Product added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

productsRouter.put('/:pid', async (req, res) => {
  try {
    const productId = req.params.pid;
    const updatedFields = req.body;
    await productModel.findByIdAndUpdate(productId, updatedFields);
    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

productsRouter.delete('/:pid', async (req, res) => {
  try {
    const productId = req.params.pid;
    await productModel.findByIdAndDelete(productId);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default productsRouter;
