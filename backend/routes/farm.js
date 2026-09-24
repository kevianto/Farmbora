const express = require('express');
const router = express.Router();
const farmController = require('../controllers/farmController');
const { verifyToken } = require('../middleware/auth');

router.post('/register', verifyToken, farmController.registerFarm);
router.get('/my-farm', verifyToken, farmController.getFarm);

module.exports = router;
