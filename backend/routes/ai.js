const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { verifyToken } = require('../middleware/auth');

router.get('/insights', verifyToken, aiController.getInsights);
router.get('/alerts', verifyToken, aiController.getAllAlerts);
router.get('/predictions', verifyToken, aiController.getPredictions);
router.post('/chat', verifyToken, aiController.handleChat);

module.exports = router;
