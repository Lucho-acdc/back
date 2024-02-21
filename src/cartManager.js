import { promises as fs } from 'fs';

const CARTS_FILE_PATH = './carts.json';

export class CartManager {
  async createCart(cart) {
    try {
      const carts = await this.loadCarts();
      cart.id = this.generateId();
      carts.push(cart);
      await this.saveCarts(carts);
    } catch (error) {
      throw error;
    }
  }

  async getCartById(cartId) {
    try {
      const carts = await this.loadCarts();
      return carts.find(cart => cart.id === cartId);
    } catch (error) {
      throw error;
    }
  }

  async addProductToCart(cartId, productId, quantity) {
    try {
      const carts = await this.loadCarts();
      const cart = carts.find(cart => cart.id === cartId);

      if (cart) {
        const existingProduct = cart.products.find(product => product.id === productId);

        if (existingProduct) {
          existingProduct.quantity += quantity;
        } else {
          cart.products.push({ id: productId, quantity });
        }

        await this.saveCarts(carts);
      } else {
        throw new Error('Cart not found');
      }
    } catch (error) {
      throw error;
    }
  }

  async loadCarts() {
    try {
      const data = await fs.readFile(CARTS_FILE_PATH, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async saveCarts(carts) {
    try {
      const data = JSON.stringify(carts, null, 2);
      await fs.writeFile(CARTS_FILE_PATH, data, 'utf-8');
    } catch (error) {
      throw error;
    }
  }

  generateId() {
    return Math.random().toString(36).substr(2, 9);
  }
}
