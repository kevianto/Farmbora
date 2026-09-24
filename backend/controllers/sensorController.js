const User = require('../models/User');
const Farm = require('../models/Farm');
const aiController = require('./aiController');
const demoController = require('./demoController');
const axios = require('axios');

// Simulate IoT Data
exports.getLiveTelemetry = async (req, res) => {
  const userId = req.user.id;
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const scenario = demoController.getScenario();

  try {
    const farm = await Farm.findOne({ userId });
    if (!farm) return res.status(404).json({ message: 'No farm registered' });

    // Base values modified by EXHIBITION SCENARIO (Adjusted for Kakamega context)
    let baseTemp = 24.5;
    let baseHum = 78;
    let baseMoisture = 62;
    const basePh = 6.2;

    if (scenario === 'drought') {
      baseTemp = 34;
      baseMoisture = 22;
      baseHum = 35;
    } else if (scenario === 'pest') {
      baseTemp = 29;
      baseHum = 82;
      baseMoisture = 55;
    }

    // Simulate realistic random fluctuations
    const tempFluct = (Math.random() * 2) - 1;
    const humFluct = (Math.random() * 4) - 2;
    const moistureFluct = (Math.random() * 3) - 1.5;

    const telemetry = {
      airTemperature: {
        value: (baseTemp + tempFluct).toFixed(1),
        unit: '°C',
        status: (baseTemp + tempFluct) > 30 ? 'warning' : 'optimal',
        range: { min: 18, max: 28 }
      },
      humidity: {
        value: (baseHum + humFluct).toFixed(1),
        unit: '%',
        status: (baseHum + humFluct) < 50 ? 'warning' : 'optimal',
        range: { min: 55, max: 75 }
      },
      soilMoisture: {
        value: (baseMoisture + moistureFluct).toFixed(1),
        unit: '%',
        status: (baseMoisture + moistureFluct) < 30 ? 'critical' : 'optimal',
        range: { min: 40, max: 60 }
      },
      soilPH: {
        value: (basePh + (Math.random() * 0.2 - 0.1)).toFixed(2),
        unit: 'pH',
        status: 'optimal',
        range: { min: 6.0, max: 7.0 }
      },
      lastSync: new Date().toISOString()
    };

    // Trigger AI analysis silently in the background
    try {
      let lat = farm.location?.lat || -1.2921;
      let lon = farm.location?.lng || 36.8219;
      
      // Call OpenWeather for rain probability
      const forecastRes = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
      const nextForecast = forecastRes.data.list[0];
      const rainProb = nextForecast.pop ? Math.round(nextForecast.pop * 100) : 0;
      
      const weatherMock = { 
        temperature: forecastRes.data.list[0].main.temp,
        forecast: { rainProb } 
      };
      
      aiController.analyzeData(farm._id, telemetry, weatherMock);
    } catch (e) {
      console.error("AI Analysis Weather Background Call Failed:", e.message);
      aiController.analyzeData(farm._id, telemetry, { forecast: { rainProb: 0 } });
    }

    res.json({ telemetry });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching telemetry', error: error.message });
  }
};
