import express from 'express';
import { getProduct, getProductById, addToList } from '../controllers/ProductController.js';
import {
  ProductQueryRequest
} from '../middlewares/ProductMiddleware.js';
import jwtValidation from '../middlewares/AuthMiddleware.js';
const router = express.Router();

router
  .get('/', ProductQueryRequest, getProduct)
  .get('/details/:productId', getProductById)
  .post('/addtolist',jwtValidation, addToList)


export default router;
