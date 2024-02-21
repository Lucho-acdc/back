import { promises as fs } from 'fs';
import crypto from 'crypto';

const RUTA = './src/data/products.json';

export class ProductManager {
  constructor() {
    this.products = [];
    this.loadProducts();
  }

  async loadProducts() {
    try {
      const data = await fs.readFile(RUTA, 'utf-8');
      this.products = JSON.parse(data);
      // console.log("Productos cargados correctamente:", this.products);
    } catch (error) {
      this.products = [];
      console.error("Error al cargar productos:", error);
    }
  }
  

  async saveProducts() {
    try {
      if (this.products.length > 0) {
        const data = JSON.stringify(this.products, null, 2);
        await fs.writeFile(RUTA, data, 'utf-8');
        console.log("Productos guardados correctamente.");
      } else {
        console.log("No hay productos para guardar.");
      }
    } catch (error) {
      console.error("Error al guardar productos:", error);
    }
  }

  async getAllProducts(limit) {
    await this.loadProducts();
    // console.log('Productos obtenidos:', this.products);
    if (limit) {
      return this.products.slice(0, parseInt(limit, 10));
    }
    return this.products;
  }

  async getProductById(id) {
    await this.loadProducts();
    return this.products.find(product => product.id === id);
  }

  async addProduct(product) {
    try {
      console.log('Datos del producto recibidos:', product);
      product.id = crypto.randomBytes(10).toString('hex');
      this.products.push(product);
      await this.saveProducts();
      console.log("Producto agregado correctamente.");
    } catch (error) {
      console.error('Error al agregar el producto:', error);
      throw error; // Re-lanzar el error para que pueda ser manejado en el controlador POST.
    }
  }
  

  async updateProduct(id, updatedFields) {
    const index = this.products.findIndex(product => product.id === id);
    if (index !== -1) {
      Object.keys(updatedFields).forEach(key => {
        if (typeof this.products[index][key] === 'number' && typeof updatedFields[key] === 'number') {
          this.products[index][key] += updatedFields[key];
        } else {
          this.products[index][key] = updatedFields[key];
        }
      });

      await this.saveProducts();

      console.log("Producto actualizado correctamente.");
    } else {
      console.error("Producto no encontrado.");
    }
  }

  async deleteProduct(id) {
    const index = this.products.findIndex(product => product.id === id);
    if (index !== -1) {
      this.products.splice(index, 1);
      await this.saveProducts();
      console.log("Producto eliminado correctamente.");
    } else {
      console.error("Producto no encontrado.");
    }
  }
}
