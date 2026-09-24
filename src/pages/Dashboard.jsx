import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api, endpoints } from '../services/api';
import { Thermometer, Droplets, TestTube, Sprout, Activity, RefreshCcw, Info, ChevronRight, Sparkles, LayoutDashboard, Cloud, Wind, CloudRain, AlertTriangle } from 'lucide-react';
import SensorCard from '../components/SensorCard';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
  const { profile } = useAuth();
  // Initialize from localStorage for instant offline access & persistence
  const [sensorData, setSensorData] = useState(() => {
    try {
      const stored = localStorage.getItem('farmbora_sensorData');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });

  const [weatherData, setWeatherData] = useState(() => {
    try {
      const stored = localStorage.getItem('farmbora_weatherData');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });

  const [aiInsights, setAiInsights] = useState(() => {
    try {
      const stored = localStorage.getItem('farmbora_aiInsights');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [currentScenario, setCurrentScenario] = useState('optimal');
  const [error, setError] = useState(null);
  const [isOffline, setIsOffline] = useState(false);
  const navigate = useNavigate();

  const fetchDashboardData = useCallback(async () => {
    try {
      const [sensorRes, weatherRes, aiRes] = await Promise.all([
        api.get(endpoints.sensors.live),
        api.get(endpoints.weather.current),
        api.get(endpoints.ai.insights)
      ]);

      const telemetry = sensorRes.data.telemetry;
      const weather = weatherRes.data.weather;
      const insights = aiRes.data.insights;

      setSensorData(telemetry);
      setWeatherData(weather);
      setAiInsights(insights);
      setError(null);
      setIsOffline(false);

      // Persist to local storage for offline recovery
      localStorage.setItem('farmbora_sensorData', JSON.stringify(telemetry));
      localStorage.setItem('farmbora_weatherData', JSON.stringify(weather));
      localStorage.setItem('farmbora_aiInsights', JSON.stringify(insights));
    } catch (error) {
      console.error("Failed to fetch dashboard telemetry:", error);
      if (error.response?.status === 404) {
        navigate('/profile');
      } else {
        // If stored data exists, maintain UI and signal offline banner instead of blocking screen
        if (localStorage.getItem('farmbora_sensorData')) {
          setIsOffline(true);
          setError(null);
        } else {
          setError("Backend communication error. Please ensure the server is running on port 5000.");
        }
      }
    }
  }, [navigate]);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 5000);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchDashboardData();
    setIsRefreshing(false);
  };

  const handleScenarioChange = async (scenario) => {
    try {
      await api.post(endpoints.demo.setScenario, { scenario });
      setCurrentScenario(scenario);
      handleRefresh(); // Refresh UI immediately
    } catch (e) {
      console.error("Failed to set scenario:", e);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface-50 p-4">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-rose-100 text-center max-w-md">
          <div className="bg-rose-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="h-8 w-8 text-rose-500" />
          </div>
          <h2 className="text-2xl font-black text-surface-900 mb-2">Sync Connection Lost</h2>
          <p className="text-surface-500 font-medium mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-primary-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg hover:bg-primary-700 transition-all"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (!sensorData || !weatherData || !aiInsights) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-surface-500 font-bold tracking-tight">Syncing farm telemetry...</p>
        </div>
      </div>
    );
  }

  const cropType = profile?.cropType || 'Crop';

  return (
    <div className="min-h-screen bg-surface-50 pb-20">
      <div className="bg-white border-b border-surface-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="flex items-center space-x-2 text-primary-600 mb-2">
                <LayoutDashboard className="h-5 w-5" />
                <span className="text-sm font-black uppercase tracking-widest">Farm Control Center</span>
              </div>
              <h1 className="text-4xl font-black text-surface-900 tracking-tight">
                {profile?.name || 'My Farm'}
              </h1>
              <div className="flex flex-wrap items-center mt-3 gap-4">
                <div className={`flex items-center space-x-2 ${isOffline ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-100'} px-3 py-1 rounded-full border`}>
                  <span className="relative flex h-2 w-2">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isOffline ? 'bg-amber-400' : 'bg-emerald-400'} opacity-75`}></span>
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${isOffline ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wide">
                    {isOffline ? 'Cached Mode (Backend Unreachable)' : 'Live Feed Active'}
                  </span>
                </div>
                <p className="text-xs font-bold text-surface-400 flex items-center">
                  <RefreshCcw className={`h-3 w-3 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
                  LAST SYNC: {sensorData.lastSync ? new Date(sensorData.lastSync).toLocaleTimeString() : 'Cached'}
                </p>
                <div className="flex items-center space-x-2 ml-4">
                   <label className="text-xs font-bold text-surface-500 uppercase tracking-widest flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={demoMode} 
                        onChange={() => setDemoMode(!demoMode)} 
                        className="mr-2"
                      />
                      Exhibition Controls
                   </label>
                </div>
              </div>

              {/* Scenario Control Bar */}
              <AnimatePresence>
                {demoMode && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-6 flex items-center space-x-3 p-2 bg-surface-900 rounded-2xl shadow-xl inline-flex border border-surface-700"
                  >
                    <span className="text-[10px] font-black text-surface-400 uppercase tracking-widest px-3 border-r border-surface-700 mr-1">Scenario Simulator:</span>
                    {['optimal', 'drought', 'pest'].map((s) => (
                      <button
                        key={s}
                        onClick={() => handleScenarioChange(s)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          currentScenario === s 
                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/50' 
                            : 'text-surface-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {s === 'pest' ? 'Pest Outbreak' : s}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center space-x-3">
              <button 
                onClick={handleRefresh}
                className="bg-white border border-surface-200 text-surface-700 px-5 py-3 rounded-2xl font-bold text-sm shadow-sm hover:bg-surface-50 transition-all flex items-center space-x-2"
              >
                <RefreshCcw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Refresh Data</span>
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-6 text-white shadow-soft relative overflow-hidden"
            >
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-2xl rounded-full"></div>
               <div className="flex justify-between items-start mb-4 relative z-10">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-primary-100 mb-1">Local Weather</h3>
                    <p className="text-xl font-bold">{weatherData.location}</p>
                  </div>
                  <Cloud className="h-10 w-10 text-primary-200" />
               </div>
               <div className="flex items-end space-x-4 mb-4 relative z-10">
                  <span className="text-5xl font-black tracking-tighter">{weatherData.temperature}°C</span>
               </div>
               <div className="grid grid-cols-2 gap-2 text-sm font-medium border-t border-white/20 pt-4 relative z-10">
                  <div className="flex items-center"><Droplets className="h-4 w-4 mr-2 opacity-70"/> Humidity: {weatherData.humidity}%</div>
                  <div className="flex items-center"><Wind className="h-4 w-4 mr-2 opacity-70"/> Wind: {weatherData.windSpeed} km/h</div>
                  <div className="flex items-center col-span-2 mt-1 text-primary-200"><CloudRain className="h-4 w-4 mr-2"/> Forecast Rain Prob: {weatherData.forecast.rainProb}%</div>
               </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="col-span-2 bg-surface-900 rounded-3xl shadow-soft p-6 text-white relative overflow-hidden border border-surface-800"
            >
               <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-primary-500/20 p-2 rounded-xl text-primary-400">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                     <h2 className="text-lg font-black tracking-tight">AI Farm Intelligence</h2>
                     <p className="text-surface-400 text-[10px] font-bold uppercase tracking-widest">Real-time Analysis</p>
                  </div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                     <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-surface-300">Overall Health Score</span>
                        <span className={`text-xl font-black ${aiInsights.healthScore > 80 ? 'text-emerald-400' : 'text-brand-accent'}`}>{aiInsights.healthScore}/100</span>
                     </div>
                     <div className="h-2 w-full bg-surface-800 rounded-full overflow-hidden mb-4">
                        <div className={`h-full ${aiInsights.healthScore > 80 ? 'bg-emerald-500' : 'bg-brand-accent'}`} style={{ width: `${aiInsights.healthScore}%` }}></div>
                     </div>
                     <p className="text-surface-400 text-sm leading-relaxed italic border-l-2 border-surface-700 pl-3">
                        "{aiInsights.systemStatus}"
                     </p>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                     <h4 className="text-xs font-black uppercase tracking-widest text-primary-400 mb-2">Yield Prediction</h4>
                     <p className="text-surface-200 text-sm">{aiInsights.yieldPrediction}</p>
                  </div>
               </div>
            </motion.div>
        </div>

        <div className="mb-4 flex items-center justify-between">
           <h2 className="text-xl font-black text-surface-900 tracking-tight">Live Telemetry</h2>
           <span className="text-xs font-bold text-surface-500 uppercase tracking-widest">Updating every 5s</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SensorCard
            title="Air Temperature"
            value={sensorData.airTemperature.value}
            unit={sensorData.airTemperature.unit}
            status={sensorData.airTemperature.status}
            range={sensorData.airTemperature.range}
            icon={Thermometer}
          />
          <SensorCard
            title="Humidity"
            value={sensorData.humidity.value}
            unit={sensorData.humidity.unit}
            status={sensorData.humidity.status}
            range={sensorData.humidity.range}
            icon={Droplets}
          />
          <SensorCard
            title="Soil pH Level"
            value={sensorData.soilPH.value}
            unit={sensorData.soilPH.unit}
            status={sensorData.soilPH.status}
            range={sensorData.soilPH.range}
            icon={TestTube}
          />
          <SensorCard
            title="Soil Moisture"
            value={sensorData.soilMoisture.value}
            unit={sensorData.soilMoisture.unit}
            status={sensorData.soilMoisture.status}
            range={sensorData.soilMoisture.range}
            icon={Droplets}
          />
        </div>

        {aiInsights.alerts && aiInsights.alerts.length > 0 && (
           <div className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                 <AlertTriangle className="h-5 w-5 text-brand-accent" />
                 <h2 className="text-xl font-black text-surface-900 tracking-tight">Active AI Warnings</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <AnimatePresence>
                    {aiInsights.alerts.map((alert, index) => (
                       <motion.div 
                          key={alert._id || index}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={`bg-white border-l-4 ${alert.severity === 'critical' ? 'border-rose-500' : 'border-amber-500'} rounded-2xl p-5 shadow-soft flex flex-col`}
                       >
                          <div className="flex justify-between items-start mb-2">
                             <h3 className={`font-black ${alert.severity === 'critical' ? 'text-rose-700' : 'text-amber-700'}`}>{alert.title}</h3>
                             <span className="text-[10px] text-surface-400 font-bold">{new Date(alert.date).toLocaleTimeString()}</span>
                          </div>
                          <p className="text-surface-600 text-sm mb-4">{alert.message}</p>
                          <div className="mt-auto bg-surface-50 p-3 rounded-xl border border-surface-100">
                             <p className="text-[10px] font-black uppercase tracking-widest text-primary-600 mb-1 flex items-center">
                               <Sparkles className="h-3 w-3 mr-1" /> AI Action
                             </p>
                             <p className="text-surface-800 text-xs font-bold">{alert.aiAdvice}</p>
                          </div>
                       </motion.div>
                    ))}
                 </AnimatePresence>
              </div>
           </div>
        )}
      </div>
    </div>
  );
}
