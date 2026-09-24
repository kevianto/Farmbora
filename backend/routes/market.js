const express = require('express');
const router = express.Router();
const marketController = require('../controllers/marketController');
const { verifyToken } = require('../middleware/auth');

router.get('/products', marketController.getAllProducts);
router.post('/products/create', verifyToken, marketController.createProduct);

module.exports = router;
