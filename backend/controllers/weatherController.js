const axios = require('axios');
const Farm = require('../models/Farm');

exports.getWeather = async (req, res) => {
  const userId = req.user.id;
  const apiKey = process.env.OPENWEATHER_API_KEY;

  try {
    const farm = await Farm.findOne({ userId });
    
    let lat = -1.2921; // Default Nairobi
    let lon = 36.8219;
    
    if (farm && farm.location) {
      lat = farm.location.lat;
      lon = farm.location.lng;
    }

    // Fetch Current Weather
    const currentRes = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
    
    // Fetch 5-day Forecast (to get rain probability/forecast for demo)
    const forecastRes = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);

    const current = currentRes.data;
    // Get rain probability from the first forecast item (3-hour block)
    const nextForecast = forecastRes.data.list[0];

    const weatherData = {
      location: farm.location.address || current.name || (farm ? farm.name : "Nairobi"),
      temperature: current.main.temp,
      humidity: current.main.humidity,
      precipitation: current.rain ? current.rain['1h'] || 0 : 0,
      windSpeed: current.wind.speed,
      forecast: {
        maxTemp: current.main.temp_max,
        minTemp: current.main.temp_min,
        rainProb: nextForecast.pop ? Math.round(nextForecast.pop * 100) : 0 // pop is probability of precipitation (0-1)
      }
    };

    res.json({ weather: weatherData });
  } catch (error) {
    console.error('OpenWeather fetch error:', error.response?.data || error.message);
    res.status(500).json({ 
      message: 'Could not fetch weather data from OpenWeather', 
      error: error.response?.data?.message || error.message 
    });
  }
};
