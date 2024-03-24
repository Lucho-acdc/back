import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo';

import productsRouter from './routers/productsRouter.js';
import cartsRouter from './routers/cartsRouter.js';
import userRouter from './routers/userRouter.js';
import viewsRouter from './routers/viewsRouter.js';

import productModel from "./models/productModel.js"
import messageModel from './models/messageModel.js'

import { Server } from 'socket.io';
import { dirname, join } from 'path'; ;
import { fileURLToPath } from 'url';
import { engine } from 'express-handlebars';



const app = express();
const port = 8080;

const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const io = new Server(server);
const productManager = new productModel();

io.on('connection', async (socket) => {
  console.log("Conexion con Socket.io");
  
  socket.on('chat message', (msg) => {
    console.log('Mensaje recibido:', msg);
    if (msg.toLowerCase() === 'hola') {
      socket.emit('chat message', 'Hola! ¿Cómo puedo ayudarte?');
    } else {
      socket.emit('chat message', 'Solo respondo al "hola".');
    }
  });

  socket.on('mensaje', async (mensaje) => {
    try {
        await messageModel.create(mensaje)
        const mensajes = await messageModel.find()
        io.emit('mensajeLogs', mensajes)
    } catch (e) {
        io.emit('mensajeLogs', e)
    }

});

});

mongoose.connect("mongodb+srv://lucianohamoroso:proyectoCoderhouse@ecommerce.nrjqzf8.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=ecommerce")
.then(() => console.log('Conexión a MongoDB establecida.'))
.catch(err => console.error('Error al conectar a MongoDB', err));

const mongoUrl = "mongodb+srv://lucianohamoroso:proyectoCoderhouse@ecommerce.nrjqzf8.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=ecommerce"

// Solucion para los href en los handlebars.
const buildCartUrl = (cartId) => '/carts/' + cartId;

app.engine('handlebars', engine({
  defaultLayout: 'main',
  helpers: {
    buildCartUrl: buildCartUrl,
  },
}));

app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

app.use(session({
  secret: 'superSecreto',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl }),
}));

app.use((req, res, next) => {
  if (req.session.user) {
    res.locals.user = req.session.user;
  }
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/static', express.static(join(__dirname, 'public')));
app.use('/api/users', userRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);
app.use('/img', express.static(join(__dirname, 'public', 'img')));
app.use('/js', express.static(join(__dirname, 'public', 'js')));
