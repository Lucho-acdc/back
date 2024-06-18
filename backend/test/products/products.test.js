import request from 'supertest';
import { app } from '../../src/main.js';
import ProductModel from '../../src/models/productModel.js';

describe('Products API', () => {
  
  let productId;

  before(async () => {
    await ProductModel.deleteMany({ code: 'Codigo test' });
    await ProductModel.deleteMany({ code: 'Codigo test nuevo' });

    const product = new ProductModel({
      title: 'Producto Test',
      description: 'Descripción del producto test',
      stock: 1,
      category: 'Categoria test',
      code: 'Codigo test',
      price: 100
    });
    await product.save();
    productId = product._id.toString();
  });

  after(async () => {
    await ProductModel.deleteMany({ code: 'Codigo test' });
  });

  it('debería crear un nuevo producto', (done) => {
    request(app)
      .post('/api/products')
      .send({
        title: 'Producto Test Nuevo',
        description: 'Descripción del producto test nuevo',
        stock: 1,
        category: 'Categoria test',
        code: 'Codigo test nuevo',
        price: 100,
      })
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it('debería obtener todos los productos', (done) => {
    request(app)
      .get('/api/products')
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it('debería obtener un producto por ID', (done) => {
    request(app)
      .get(`/api/products/${productId}`)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
});
