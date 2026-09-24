const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');
const { verifyToken } = require('../middleware/auth');

router.get('/current', verifyToken, weatherController.getWeather);

module.exports = router;
