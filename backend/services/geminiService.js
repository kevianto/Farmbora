const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

exports.getAgronomicAdvice = async (farmType, cropType, telemetry, weather, alertType) => {
  try {
    const prompt = `
      You are an expert AI agronomist for the FarmBora platform. 
      Context:
      - Farm Type: ${farmType}
      - Primary Crop/Livestock: ${cropType}
      - Live Telemetry: Temp ${telemetry.airTemperature.value}°C, Humidity ${telemetry.humidity.value}%, Soil Moisture ${telemetry.soilMoisture.value}%
      - Weather: ${weather.temperature}°C, Rain Prob ${weather.forecast.rainProb}%
      - Alert Event: ${alertType}

      Task: Provide a concise, professional, and actionable 2-sentence agronomic advice for the farmer based on this specific situation. 
      Keep it high-impact and specific to the ${cropType}. 
      Do not use introductory phrases like "As an AI...".
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    return "Ensure optimal irrigation and monitor local conditions closely. Consult a local expert if parameters persist.";
  }
};

exports.getFarmInsights = async (farm, telemetry, weather) => {
  try {
    const prompt = `
      As an AI agronomist, analyze this farm data:
      Farm: ${farm.name}, Crop: ${farm.cropType}
      Current Telemetry: ${JSON.stringify(telemetry)}
      Current Weather: ${JSON.stringify(weather)}

      Provide a 1-sentence overall status summary and a 1-sentence yield prediction based ONLY on these environmental factors.
      Return as a JSON object with keys: "statusSummary" and "yieldPrediction".
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    // Find the JSON block in case Gemini adds markdown
    const jsonStr = text.match(/\{.*\}/s)[0];
    return JSON.parse(jsonStr);
  } catch (error) {
    return {
      statusSummary: "Farm parameters are within nominal ranges for the current cycle.",
      yieldPrediction: "Current data suggests a stable harvest aligned with regional historical averages."
    };
  }
};

// Simple in-memory cache with TTL (15 minutes default)
const cache = new Map();

function getCached(key) {
  const item = cache.get(key);
  if (!item) return null;
  if (Date.now() > item.expiry) {
    cache.delete(key);
    return null;
  }
  return item.value;
}

function setCache(key, value, ttlMs = 15 * 60 * 1000) {
  cache.set(key, { value, expiry: Date.now() + ttlMs });
}

exports.getPredictions = async (timeline, farm, weatherData) => {
  const cacheKey = `prediction_${farm._id || farm.name}_${timeline}`;
  const cached = getCached(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    // Extract only essential weather attributes to shrink prompt size & speed up Gemini processing
    const compactCurrent = weatherData.current?.main ? {
      temp: weatherData.current.main.temp,
      humidity: weatherData.current.main.humidity,
      weather: weatherData.current.weather?.[0]?.description
    } : weatherData.current;

    const compactForecast = Array.isArray(weatherData.forecast)
      ? weatherData.forecast.slice(0, 5).map(f => ({
          temp: f.main?.temp,
          pop: f.pop,
          weather: f.weather?.[0]?.description
        }))
      : [];

    const prompt = `
      You are the FarmBora Precision AI engine. Generate a comprehensive, detailed agronomic forecast:
      Farm: ${farm.name}, Primary Crop: ${farm.cropType}
      Current Weather: ${JSON.stringify(compactCurrent)}
      Forecast: ${JSON.stringify(compactForecast)}
      Timeline: ${timeline}

      Provide thorough details formatted strictly as JSON with these keys:
      {
        "rainfallPrediction": "string (detailed summary)",
        "rainfallAmount": "string (e.g. 35-50mm)",
        "temperaturePrediction": "string (detailed thermal outlook)",
        "temperatureRange": "string (e.g. 19-24°C)",
        "humidityOutlook": "string (e.g. 60-75% high humidity)",
        "pestPlausibility": "string (e.g. Low/Moderate/High risk of fungal blight)",
        "irrigationStrategy": "string (specific watering schedule/action)",
        "aiAdvice": "string (3 detailed agronomic sentences covering crop protection, soil management, and harvest/growth action steps)"
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : text);

    // Cache valid predictions for 15 minutes
    setCache(cacheKey, parsed, 15 * 60 * 1000);
    return parsed;
  } catch (error) {
    console.error("Gemini Prediction Error:", error.message);
    
    // Dynamic detailed local fallback based on weather context
    const isRainy = weatherData?.forecast?.some(f => (f.pop || 0) > 0.4);
    const temp = weatherData?.current?.main?.temp || 23;
    const humidity = weatherData?.current?.main?.humidity || 65;
    const crop = farm?.cropType || "crops";

    const fallback = {
      rainfallPrediction: isRainy ? "Increased cloud density with moderate to heavy precipitation likelihood" : "Predominantly dry, clear skies with minimal rain probability",
      rainfallAmount: isRainy ? "30-55mm" : "0-5mm",
      temperaturePrediction: temp > 25 ? "Elevated daytime thermal levels with mild evening cooling" : "Moderate thermal stability optimal for growth",
      temperatureRange: `${Math.round(temp - 3)}-${Math.round(temp + 4)}°C`,
      humidityOutlook: `${humidity}% relative humidity level`,
      pestPlausibility: isRainy ? "Elevated risk of fungal rust due to humidity spikes" : "Low pest vector activity anticipated",
      irrigationStrategy: isRainy ? "Suspend automated irrigation; check trench lines for standing water." : "Maintain deep morning irrigation cycles every 2 days.",
      aiAdvice: isRainy
        ? `Ensure effective field trenching for ${crop} to prevent root rot. Delay foliar fertilizer application until weather stabilizes. Monitor leaves for early signs of fungal infection.`
        : `Optimize soil moisture retention for your ${crop} through organic mulching. Apply balanced potassium nutrients to fortify heat stress resilience. Inspect drip lines regularly for blockage.`
    };

    setCache(cacheKey, fallback, 5 * 60 * 1000);
    return fallback;
  }
};

exports.getChatResponse = async (userMessage, farm, telemetry, weather) => {
  try {
    const prompt = `
      You are the FarmBora AI Assistant, a precision agriculture expert.
      
      CONTEXT:
      - Farmer: ${farm.name}
      - Operation: ${farm.cropType} (${farm.type})
      - LIVE TELEMETRY: ${JSON.stringify(telemetry)}
      - WEATHER: ${JSON.stringify(weather)}

      USER MESSAGE: "${userMessage}"

      INSTRUCTIONS:
      1. Answer the farmer's question with high technical accuracy.
      2. ALWAYS reference the LIVE TELEMETRY data provided above to make your answer hyper-local and specific.
      3. If the telemetry shows any issues (e.g. low moisture), proactively mention it.
      4. Keep the tone professional, helpful, and concise (max 3-4 sentences).
      5. Do not use markdown formatting like bolding in your response.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error("Gemini Chat Error:", error.message);
    return "I am currently analyzing your farm's telemetry. How else can I help you today?";
  }
};
