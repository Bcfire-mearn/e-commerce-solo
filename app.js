import express from 'express';
// import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import bodyParser from 'body-parser';

import { fileURLToPath } from 'url';

import UserRouter from './routers/UserRouter.js';
import ProductRouter from './routers/ProductRouter.js';
// import StaticRouter from './routers/StaticRouter.js';


// Get the directory name equivalent to __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// enable cors

const allowedOrigins = ['http://localhost:3000','http://127.0.0.1:3000','http://localhost:5500', 'http://127.0.0.1:5500'];

app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// enable cookies for express
app.use(cookieParser());
// access assets - images  
const routes = ['/home', '/product', '/login', '/signup', '/admin','/notfound', '/profile'];
const assetsPath = path.join(__dirname, 'assets');
routes.forEach(route => {
  app.use(route, express.static(assetsPath));
});


app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

app.use('/views', express.static(path.join(__dirname, 'views')));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "views" directory

app.use(express.static('views'));
// app.use('/', StaticRouter);

app.use('/api/user', UserRouter);
app.use('/api/products', ProductRouter);


app.all('*', (_req, res) => {
  return res.redirect('/notfound'); 
  return res.status(404).json({ message: 'Not Found' });
});

export default app;
