import Product from '../models/productModel.js';

export const generateMockProducts = async (req, res) => {
    try {
        
        await Product.deleteMany({});

        const mockProducts = Array.from({ length: 100 }, (_, index) => ({
            name: `Producto ${index + 1}`,
            price: Math.floor(Math.random() * 100) + 1,
            description: `Descripción del producto ${index + 1}`,
            stock: Math.floor(Math.random() * 100) + 1
        }));

        await Product.insertMany(mockProducts);
        res.status(200).send('Productos mock generados correctamente');
    } catch (error) {
        res.status(500).send("Error generando productos mock: " + error.message);
    }
};
