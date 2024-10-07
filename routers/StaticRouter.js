import express from 'express';
const router = express.Router();
router.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', '')); 
  })
  .get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', '')); 
  })
  .get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', '')); 
  })
  .get('/product', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', '')); 
  })  
  .get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', '')); 
  })


export default router;