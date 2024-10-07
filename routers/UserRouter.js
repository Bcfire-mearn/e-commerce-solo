import express from 'express';
import {
  register,
  login,
  logout,
  getCurrentUser,
  adminAccess
} from '../controllers/UserController.js';
import {
  AJVSignUpValidation,
  loginUserValidation,
} from '../middlewares/UserMiddleware.js';
import jwtValidation from '../middlewares/AuthMiddleware.js';

const router = express.Router();

router
  .get('/logout', logout)
  .get('/me', jwtValidation, getCurrentUser)
  .get('/admin', jwtValidation, adminAccess)
  .post('/register', AJVSignUpValidation, register)
  .post('/login', loginUserValidation, login);

export default router;
