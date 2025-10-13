import { useState } from 'react';
import { Cloud, Droplets, Thermometer, TrendingUp, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import predictionsMock from '../mock/predictions.json';

export default function Prediction() {
  const [selectedTimeline, setSelectedTimeline] = useState('1 week');
  const [prediction, setPrediction] = useState(
    predictionsMock.predictions.find(p => p.timeline === '1 week')
  );

  const timelines = ['1 day', '1 week', '1 month', '3 months', '6 months'];

  const handleTimelineChange = (timeline) => {
    setSelectedTimeline(timeline);
    const newPrediction = predictionsMock.predictions.find(p => p.timeline === timeline);
    setPrediction(newPrediction);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Weather Predictions</h1>
          <p className="text-gray-600">
            AI-powered forecasts to help you plan your farming activities
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6 mb-8"
        >
          <div className="flex items-center space-x-2 mb-6">
            <Calendar className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-bold text-gray-900">Select Forecast Timeline</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {timelines.map((timeline) => (
              <button
                key={timeline}
                onClick={() => handleTimelineChange(timeline)}
                className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                  selectedTimeline === timeline
                    ? 'bg-green-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {timeline}
              </button>
            ))}
          </div>
        </motion.div>

        {prediction && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-md p-6 border-2 border-blue-200"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <Droplets className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Rainfall Prediction</h3>
                    <p className="text-sm text-gray-600">{selectedTimeline} forecast</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-blue-700 mb-2">
                  {prediction.rainfallPrediction}
                </p>
                <p className="text-lg text-blue-600">
                  Expected: {prediction.rainfallAmount}
                </p>
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <p className="text-sm text-gray-700">
                    This forecast helps you plan irrigation, drainage, and planting schedules.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg shadow-md p-6 border-2 border-orange-200"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <Thermometer className="h-8 w-8 text-orange-600" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Temperature Prediction</h3>
                    <p className="text-sm text-gray-600">{selectedTimeline} forecast</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-orange-700 mb-2">
                  {prediction.temperaturePrediction}
                </p>
                <p className="text-lg text-orange-600">
                  Range: {prediction.temperatureRange}
                </p>
                <div className="mt-4 pt-4 border-t border-orange-200">
                  <p className="text-sm text-gray-700">
                    Temperature affects crop growth rates, pest activity, and water needs.
                  </p>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-lg p-8 border-2 border-green-300"
            >
              <div className="flex items-start space-x-4 mb-6">
                <div className="bg-green-600 p-3 rounded-full">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Analysis & Recommendations</h2>
                  <p className="text-gray-600">
                    Based on {selectedTimeline} forecast and current farm conditions
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <p className="text-gray-800 text-lg leading-relaxed">
                  {prediction.aiAdvice}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-white rounded-lg p-4 text-center">
                  <Cloud className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-gray-700">Weather Pattern</p>
                  <p className="text-xs text-gray-600 mt-1">Analyzed from regional data</p>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <Droplets className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-gray-700">Water Management</p>
                  <p className="text-xs text-gray-600 mt-1">Optimize irrigation timing</p>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-gray-700">Growth Optimization</p>
                  <p className="text-xs text-gray-600 mt-1">Maximize yield potential</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg"
            >
              <h3 className="text-lg font-bold text-blue-900 mb-2">How to Use This Forecast</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start">
                  <span className="font-bold mr-2">1.</span>
                  <span>Review the rainfall and temperature predictions for your selected timeline</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">2.</span>
                  <span>Read the AI recommendations carefully and plan your activities accordingly</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">3.</span>
                  <span>Check back regularly as forecasts update with new data</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">4.</span>
                  <span>Combine predictions with your local observations for best results</span>
                </li>
              </ul>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
