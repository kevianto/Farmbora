const Farm = require('../models/Farm');
const Alert = require('../models/Alert');
const geminiService = require('../services/geminiService');
const axios = require('axios');

exports.analyzeData = async (farmId, telemetry, weather) => {
  if (!farmId || !telemetry) return;

  const moisture = parseFloat(telemetry.soilMoisture.value);
  const temp = parseFloat(telemetry.airTemperature.value);
  const rainProb = weather ? weather.forecast.rainProb : 0;

  try {
    const farm = await Farm.findById(farmId);
    if (!farm) return;

    // 1. Irrigation / Drought Logic
    if (moisture < 35 && rainProb < 20) {
      const oneHourAgo = new Date(Date.now() - 1000 * 60 * 60);
      const recentDrought = await Alert.findOne({
        farmId,
        type: 'drought',
        createdAt: { $gte: oneHourAgo }
      });
      
      if (!recentDrought) {
        const aiAdvice = await geminiService.getAgronomicAdvice(
          farm.type, 
          farm.cropType, 
          telemetry, 
          weather || { temperature: temp, forecast: { rainProb } }, 
          "Critical Soil Moisture"
        );

        await Alert.create({
          farmId,
          type: 'drought',
          severity: 'critical',
          title: 'Critical Soil Moisture Level',
          message: `Soil moisture has dropped to ${moisture}%. With only a ${rainProb}% chance of rain, immediate action is required to prevent yield loss.`,
          aiAdvice
        });
      }
    }

    // 2. Pest Risk Logic
    if (temp > 28 && parseFloat(telemetry.humidity.value) > 70) {
      const twentyFourHoursAgo = new Date(Date.now() - 1000 * 60 * 60 * 24);
      const recentPest = await Alert.findOne({
        farmId,
        type: 'pest',
        createdAt: { $gte: twentyFourHoursAgo }
      });
      
      if (!recentPest) {
        const aiAdvice = await geminiService.getAgronomicAdvice(
          farm.type, 
          farm.cropType, 
          telemetry, 
          weather || { temperature: temp, forecast: { rainProb } }, 
          "High Fungal/Pest Risk"
        );

        await Alert.create({
          farmId,
          type: 'pest',
          severity: 'warning',
          title: 'High Fungal/Pest Risk Detected',
          message: `High temperatures (${temp}°C) combined with high humidity create ideal conditions for fungal infections like blight.`,
          aiAdvice
        });
      }
    }
  } catch (error) {
    console.error('AI Analysis Error:', error.message);
  }
};

exports.getInsights = async (req, res) => {
  const userId = req.user.id;
  try {
    const farm = await Farm.findOne({ userId });
    if (!farm) return res.status(404).json({ message: 'No farm registered' });

    // Fetch alerts for health score
    const alerts = await Alert.find({ farmId: farm._id }).sort({ createdAt: -1 }).limit(10);
    
    // We need current telemetry and weather for a real analysis
    // In a real app, we might fetch from a cache or the latest sensor read
    // For the demo, we'll simulate the parameters passed or let gemini use latest info
    // For now, let's use the static-ish data logic but call Gemini for the text
    
    const mockTelemetry = {
      airTemperature: { value: 26.5 },
      humidity: { value: 62 },
      soilMoisture: { value: 48 }
    };
    
    const geminiInsights = await geminiService.getFarmInsights(farm, mockTelemetry, { temperature: 26, forecast: { rainProb: 10 } });

    let healthScore = 98;
    if (alerts.length > 0) {
      healthScore -= alerts.filter(a => a.severity === 'critical').length * 15;
      healthScore -= alerts.filter(a => a.severity === 'warning').length * 5;
    }
    healthScore = Math.max(0, Math.min(100, healthScore));

    const insights = {
      healthScore,
      statusText: healthScore > 80 ? 'Optimal' : healthScore > 50 ? 'Fair' : 'Critical',
      systemStatus: geminiInsights.statusSummary,
      yieldPrediction: geminiInsights.yieldPrediction,
      alerts: alerts.slice(0, 5)
    };

    res.json({ insights });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching insights', error: error.message });
  }
};

exports.getAllAlerts = async (req, res) => {
  const userId = req.user.id;
  try {
    const farm = await Farm.findOne({ userId });
    if (!farm) return res.status(404).json({ message: 'No farm registered' });

    let alerts = await Alert.find({ farmId: farm._id }).sort({ createdAt: -1 });

    // Seed alerts for demo if empty
    if (alerts.length === 0) {
      const mockTelemetry = {
        airTemperature: { value: 26.5 },
        humidity: { value: 62 },
        soilMoisture: { value: 48 }
      };
      
      const seedData = [
        { type: 'growth', severity: 'info', title: 'Vegetative Stage Commenced', message: `Your ${farm.cropType} has entered the critical vegetative growth phase. Nutrient uptake is peaking.` },
        { type: 'pest', severity: 'warning', title: 'Elevated Pest Risk', message: 'Local regional data indicates a spike in Fall Armyworm activity. Increased field scouting is advised.' },
        { type: 'weather', severity: 'info', title: 'Favorable Planting Window', message: 'Upcoming stable temperatures and moderate humidity create an ideal window for top-dressing application.' }
      ];

      for (const item of seedData) {
        const aiAdvice = await geminiService.getAgronomicAdvice(
          farm.type, 
          farm.cropType, 
          mockTelemetry, 
          { temperature: 26, forecast: { rainProb: 10 } }, 
          item.title
        );
        await Alert.create({ ...item, farmId: farm._id, aiAdvice });
      }
      alerts = await Alert.find({ farmId: farm._id }).sort({ createdAt: -1 });
    }

    res.json({ alerts });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching alerts', error: error.message });
  }
};

const weatherCache = new Map();

function getCachedWeather(key) {
  const item = weatherCache.get(key);
  if (item && Date.now() < item.expiry) return item.value;
  if (item) weatherCache.delete(key);
  return null;
}

function setCachedWeather(key, value, ttlMs = 10 * 60 * 1000) {
  weatherCache.set(key, { value, expiry: Date.now() + ttlMs });
}

exports.getPredictions = async (req, res) => {
  const userId = req.user.id;
  const { timeline } = req.query;
  const apiKey = process.env.OPENWEATHER_API_KEY;

  try {
    const farm = await Farm.findOne({ userId });
    if (!farm) return res.status(404).json({ message: 'No farm registered' });

    const lat = farm.location?.lat || -1.2921;
    const lon = farm.location?.lng || 36.8219;
    const weatherCacheKey = `weather_${lat.toFixed(2)}_${lon.toFixed(2)}`;

    let weatherContext = getCachedWeather(weatherCacheKey);

    if (!weatherContext) {
      weatherContext = { current: {}, forecast: [] };
      try {
        const [currentRes, forecastRes] = await Promise.all([
          axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`),
          axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
        ]);

        weatherContext.current = currentRes.data;
        weatherContext.forecast = forecastRes.data.list.slice(0, 5);
        setCachedWeather(weatherCacheKey, weatherContext, 10 * 60 * 1000);
      } catch (e) {
        console.error("Weather context fetch failed for predictions:", e.message);
      }
    }

    const prediction = await geminiService.getPredictions(timeline || '1 week', farm, weatherContext);
    res.json({ prediction });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching predictions', error: error.message });
  }
};

exports.handleChat = async (req, res) => {
  const userId = req.user.id;
  const { message } = req.body;
  const apiKey = process.env.OPENWEATHER_API_KEY;

  try {
    const farm = await Farm.findOne({ userId });
    if (!farm) return res.status(404).json({ message: 'No farm registered' });

    // Get context for the AI
    let telemetry = {};
    let weather = { temperature: 25, forecast: { rainProb: 0 } };

    try {
      const lat = farm.location?.lat || -1.2921;
      const lon = farm.location?.lng || 36.8219;
      
      const [weatherRes, forecastRes] = await Promise.all([
        axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`),
        axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
      ]);

      weather = {
        temperature: weatherRes.data.main.temp,
        forecast: { rainProb: Math.round(forecastRes.data.list[0].pop * 100) }
      };

      // In a real app we'd fetch from real sensors, here we simulate same as sensorController
      telemetry = {
        airTemperature: { value: 26.5, unit: '°C' },
        humidity: { value: 62, unit: '%' },
        soilMoisture: { value: 48, unit: '%' },
        soilPH: { value: 6.5, unit: 'pH' }
      };
    } catch (e) {
      console.error("Chat context fetch failed:", e.message);
    }

    const response = await geminiService.getChatResponse(message, farm, telemetry, weather);
    res.json({ response });
  } catch (error) {
    res.status(500).json({ message: 'Server error in AI chat', error: error.message });
  }
};
