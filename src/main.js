import express from 'express';
import productsRouter from './routers/productsRouter.js';
import cartsRouter from './routers/cartsRouter.js';
import { Server } from 'socket.io';
import { dirname, join } from 'path'; ;
import { fileURLToPath } from 'url';
import { engine } from 'express-handlebars';
import { ProductManager } from './productManager.js';

const app = express();
const port = 8080;

const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const io = new Server(server);
const productManager = new ProductManager();
const initialProducts = await productManager.getAllProducts();

io.on('connection', async (socket) => {
  console.log("Conexion con Socket.io");

  // socket.emit('initialProducts', { products: initialProducts });
});

app.engine('handlebars', engine());

app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/static', express.static(join(__dirname, 'public')));
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/img', express.static(join(__dirname, 'public', 'img')));

app.get('/', async (req, res) => {
  const initialProducts = await productManager.getAllProducts();
  res.render('templates/home', {
    mostrarProductos: true,
    products: initialProducts,
  });
});

// Prueba para ingresar un nuevo producto al json

// app.get('/new-product', (req, res) => {
//   res.render('templates/new-product-form');
// });

// app.post('/api/products', async (req, res) => {
//   console.error('Datos del producto recibidos:', req.body);

//   try {
//       const newProduct = req.body;
//       await productManager.addProduct(newProduct);
//       res.redirect('/');
//   } catch (error) {
//       console.error('Error al procesar el formulario:', error);
//       res.status(500).send('Error interno al procesar el formulario');
//   }
// });

