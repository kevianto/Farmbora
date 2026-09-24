const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

// Connect to MongoDB
connectDB();

const authRoutes = require('./routes/auth');
const farmRoutes = require('./routes/farm');
const sensorRoutes = require('./routes/sensor');
const weatherRoutes = require('./routes/weather');
const aiRoutes = require('./routes/ai');
const marketRoutes = require('./routes/market');
const demoController = require('./controllers/demoController');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/farm', farmRoutes);
app.use('/api/sensor', sensorRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/market', marketRoutes);
app.post('/api/demo/scenario', demoController.setScenario);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Online', timestamp: new Date(), scenario: demoController.getScenario() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`FarmBora Backend running on port ${PORT}`);
});
