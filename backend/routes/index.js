const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensorController');
const weatherController = require('../controllers/weatherController');
const aiController = require('../controllers/aiController');
const { verifyToken } = require('../middleware/auth');

const sensorRouter = express.Router();
sensorRouter.get('/live', verifyToken, sensorController.getLiveTelemetry);

const weatherRouter = express.Router();
weatherRouter.get('/current', verifyToken, weatherController.getWeather);

const aiRouter = express.Router();
aiRouter.get('/insights', verifyToken, aiController.getInsights);

module.exports = {
  sensorRouter,
  weatherRouter,
  aiRouter
};
