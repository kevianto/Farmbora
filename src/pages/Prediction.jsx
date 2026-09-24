import { useState, useEffect, useCallback } from 'react';
import { Cloud, Droplets, Thermometer, TrendingUp, Calendar, RefreshCcw, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api, endpoints } from '../services/api';

export default function Prediction() {
  const [selectedTimeline, setSelectedTimeline] = useState('1 week');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const timelines = ['1 day', '1 week', '1 month', '3 months', '6 months'];

  // Local client cache for instant UI rendering across timeline switches
  const [predictionCache, setPredictionCache] = useState({});

  const fetchPrediction = useCallback(async (timeline, forceRefresh = false) => {
    if (!forceRefresh && predictionCache[timeline]) {
      setPrediction(predictionCache[timeline]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await api.get(`${endpoints.ai.predictions}?timeline=${timeline}`);
      const data = res.data.prediction;
      setPrediction(data);
      setPredictionCache((prev) => ({ ...prev, [timeline]: data }));
    } catch (error) {
      console.error("Failed to fetch AI predictions:", error);
    } finally {
      setLoading(false);
    }
  }, [predictionCache]);

  useEffect(() => {
    fetchPrediction(selectedTimeline);
  }, [selectedTimeline, fetchPrediction]);

  const handleTimelineChange = (timeline) => {
    setSelectedTimeline(timeline);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchPrediction(selectedTimeline, true);
    setIsRefreshing(false);
  };

  return (
    <div className="min-h-screen bg-surface-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-surface-200 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className="bg-primary-600/10 p-2 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-primary-600" />
                </div>
                <h1 className="text-3xl font-black text-surface-900 tracking-tight">AI Forecasting</h1>
              </div>
              <p className="text-surface-500 font-bold">
                Advanced predictive analytics powered by Gemini 1.5 Flash.
              </p>
            </motion.div>

            <motion.button 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={handleRefresh}
              className="bg-white border border-surface-200 text-surface-700 px-5 py-3 rounded-2xl font-bold text-sm shadow-sm hover:bg-surface-50 transition-all flex items-center space-x-2"
            >
              <RefreshCcw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Update Forecast</span>
            </motion.button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2rem] shadow-soft p-8 mb-8 border border-surface-200"
        >
          <div className="flex items-center space-x-2 mb-8">
            <Calendar className="h-5 w-5 text-primary-600" />
            <h2 className="text-lg font-black text-surface-900 tracking-tight">Strategic Planning Timeline</h2>
          </div>

          <div className="flex flex-wrap gap-3">
            {timelines.map((timeline) => (
              <button
                key={timeline}
                onClick={() => handleTimelineChange(timeline)}
                className={`py-4 px-8 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
                  selectedTimeline === timeline
                    ? 'bg-surface-900 text-white shadow-xl scale-105'
                    : 'bg-surface-50 text-surface-500 hover:bg-surface-100'
                }`}
              >
                {timeline}
              </button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24"
            >
              <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
              <p className="text-surface-500 font-bold uppercase tracking-widest text-xs">Querying AI Agronomist...</p>
            </motion.div>
          ) : prediction && (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-[2.5rem] p-8 text-white shadow-soft relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full"></div>
                  <div className="flex items-center space-x-4 mb-6 relative z-10">
                    <div className="bg-white/20 p-3 rounded-2xl">
                      <Droplets className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-widest text-blue-100">Rainfall Prediction</h3>
                      <p className="text-sm font-bold opacity-70">{selectedTimeline} scope</p>
                    </div>
                  </div>
                  <p className="text-3xl font-black tracking-tight mb-2 relative z-10">
                    {prediction.rainfallPrediction}
                  </p>
                  <div className="flex items-center space-x-2 relative z-10">
                    <span className="text-sm font-bold opacity-80 uppercase tracking-widest text-blue-100">Expected Vol:</span>
                    <span className="text-xl font-black text-white">{prediction.rainfallAmount}</span>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-gradient-to-br from-amber-500 to-amber-700 rounded-[2.5rem] p-8 text-white shadow-soft relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full"></div>
                  <div className="flex items-center space-x-4 mb-6 relative z-10">
                    <div className="bg-white/20 p-3 rounded-2xl">
                      <Thermometer className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-widest text-amber-100">Thermal Outlook</h3>
                      <p className="text-sm font-bold opacity-70">{selectedTimeline} scope</p>
                    </div>
                  </div>
                  <p className="text-3xl font-black tracking-tight mb-2 relative z-10">
                    {prediction.temperaturePrediction}
                  </p>
                  <div className="flex items-center space-x-2 relative z-10">
                    <span className="text-sm font-bold opacity-80 uppercase tracking-widest text-amber-100">Avg Range:</span>
                    <span className="text-xl font-black text-white">{prediction.temperatureRange}</span>
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-surface-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden border border-surface-800"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600 opacity-10 blur-[100px] -z-0"></div>
                
                <div className="flex items-start space-x-6 mb-10 relative z-10">
                  <div className="bg-primary-600 p-4 rounded-3xl shadow-lg shadow-primary-900/50">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black tracking-tight mb-1 uppercase">AI Agronomic Strategy</h2>
                    <p className="text-surface-400 text-xs font-bold uppercase tracking-[0.3em]">Precision Recommendations</p>
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-[2rem] p-8 border border-white/10 relative z-10">
                  <p className="text-surface-100 text-xl leading-relaxed italic font-medium">
                    "{prediction.aiAdvice}"
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 relative z-10">
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10 flex flex-col justify-between">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="text-blue-400 bg-blue-400/10 p-2 rounded-xl"><Droplets className="h-5 w-5" /></div>
                      <span className="text-xs font-black uppercase tracking-widest text-surface-300">Humidity Outlook</span>
                    </div>
                    <p className="text-surface-100 font-bold text-sm">{prediction.humidityOutlook || 'Optimal ranges expected'}</p>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10 flex flex-col justify-between">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="text-rose-400 bg-rose-400/10 p-2 rounded-xl"><Cloud className="h-5 w-5" /></div>
                      <span className="text-xs font-black uppercase tracking-widest text-surface-300">Pest & Pathogen Risk</span>
                    </div>
                    <p className="text-surface-100 font-bold text-sm">{prediction.pestPlausibility || 'Low risk anticipated'}</p>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10 flex flex-col justify-between">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="text-emerald-400 bg-emerald-400/10 p-2 rounded-xl"><TrendingUp className="h-5 w-5" /></div>
                      <span className="text-xs font-black uppercase tracking-widest text-surface-300">Irrigation Action</span>
                    </div>
                    <p className="text-surface-100 font-bold text-sm">{prediction.irrigationStrategy || 'Standard watering schedule'}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
