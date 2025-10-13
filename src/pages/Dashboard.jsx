import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Thermometer, Droplets, TestTube, Sprout } from 'lucide-react';
import SensorCard from '../components/SensorCard';
import { motion } from 'framer-motion';
import sensorDataMock from '../mock/sensorData.json';

export default function Dashboard() {
  const { profile } = useAuth();
  const [sensorData, setSensorData] = useState(null);

  useEffect(() => {
    setSensorData(sensorDataMock);
  }, []);

  if (!sensorData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  const cropType = profile?.plantType || profile?.animalType || 'Maize';
  const favourableConditions = sensorData.favourableConditions[cropType] || sensorData.favourableConditions['Maize'];
  const farmingAdvice = sensorData.farmingAdvice[cropType] || sensorData.farmingAdvice['Maize'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Real-time monitoring and insights for your {cropType} {profile?.farmingType === 'plant' ? 'farm' : 'farming'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Last updated: {new Date(sensorData.lastUpdated).toLocaleString()}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SensorCard
            title="Air Temperature"
            value={sensorData.readings.airTemperature.value}
            unit={sensorData.readings.airTemperature.unit}
            status={sensorData.readings.airTemperature.status}
            range={sensorData.readings.airTemperature.range}
            icon={Thermometer}
          />
          <SensorCard
            title="Humidity"
            value={sensorData.readings.humidity.value}
            unit={sensorData.readings.humidity.unit}
            status={sensorData.readings.humidity.status}
            range={sensorData.readings.humidity.range}
            icon={Droplets}
          />
          {profile?.farmingType === 'plant' && (
            <>
              <SensorCard
                title="Soil pH"
                value={sensorData.readings.soilPH.value}
                unit={sensorData.readings.soilPH.unit}
                status={sensorData.readings.soilPH.status}
                range={sensorData.readings.soilPH.range}
                icon={TestTube}
              />
              <SensorCard
                title="Soil Moisture"
                value={sensorData.readings.soilMoisture.value}
                unit={sensorData.readings.soilMoisture.unit}
                status={sensorData.readings.soilMoisture.status}
                range={sensorData.readings.soilMoisture.range}
                icon={Droplets}
              />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center space-x-2 mb-4">
              <Sprout className="h-6 w-6 text-green-600" />
              <h2 className="text-xl font-bold text-gray-900">Favourable Conditions</h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">Optimal ranges for {cropType}</p>
            <div className="space-y-3">
              {Object.entries(favourableConditions).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center bg-green-50 p-3 rounded-lg">
                  <span className="font-medium text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="text-green-700 font-semibold">{value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-md p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Tips</h2>
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold text-green-700">Monitor Daily:</span> Check your sensor
                  readings every morning to catch any changes early.
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold text-green-700">Weather Alerts:</span> Enable notifications
                  to receive warnings about extreme weather conditions.
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold text-green-700">Market Ready:</span> Track your growth
                  stages to plan optimal harvest and market timing.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {farmingAdvice && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Farming Stage Advice</h2>
            <p className="text-gray-600 mb-6">Expert recommendations for each growth stage of {cropType}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {farmingAdvice.map((stage, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-2 border-green-200 rounded-lg p-5 hover:border-green-400 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-green-700">{stage.stage}</h3>
                    <span className="text-xs font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full">
                      {stage.duration}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{stage.advice}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
