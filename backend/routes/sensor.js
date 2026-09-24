const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensorController');
const { verifyToken } = require('../middleware/auth');

router.get('/live', verifyToken, sensorController.getLiveTelemetry);

module.exports = router;
