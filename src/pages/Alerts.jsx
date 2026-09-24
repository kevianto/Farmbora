import { useState, useEffect } from 'react';
import { AlertTriangle, Filter, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AlertCard from '../components/AlertCard';
import { api, endpoints } from '../services/api';

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchAlerts = async () => {
    try {
      const res = await api.get(endpoints.ai.alerts);
      setAlerts(res.data.alerts || []);
    } catch (error) {
      console.error("Failed to fetch alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    // Poll every 10 seconds for new alerts in demo
    const interval = setInterval(fetchAlerts, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchAlerts();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity;
    const matchesType = filterType === 'all' || alert.type === filterType;
    return matchesSeverity && matchesType;
  });

  const severityCounts = {
    critical: alerts.filter(a => a.severity === 'critical').length,
    warning: alerts.filter(a => a.severity === 'warning').length,
    info: alerts.filter(a => a.severity === 'info').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-surface-500 font-bold tracking-tight">Syncing AI Intelligence...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 pb-20">
      <div className="bg-white border-b border-surface-200 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className="bg-brand-accent/10 p-2 rounded-xl">
                  <AlertTriangle className="h-6 w-6 text-brand-accent" />
                </div>
                <h1 className="text-3xl font-black text-surface-900 tracking-tight">Intelligence Log</h1>
              </div>
              <p className="text-surface-500 font-bold">
                Real-time AI analysis of telemetry, weather events, and agronomic risks.
              </p>
            </motion.div>

            <motion.button 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={handleRefresh}
              className="bg-white border border-surface-200 text-surface-700 px-5 py-3 rounded-2xl font-bold text-sm shadow-sm hover:bg-surface-50 transition-all flex items-center space-x-2"
            >
              <RefreshCcw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Sync Log</span>
            </motion.button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-rose-50 border border-rose-100 rounded-3xl p-6 shadow-soft relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl"></div>
            <div className="text-5xl font-black text-rose-600 mb-1 relative z-10">{severityCounts.critical}</div>
            <p className="text-sm font-black uppercase tracking-widest text-rose-900 relative z-10">Critical Risks</p>
            <p className="text-xs font-bold text-rose-700/70 mt-1 relative z-10">Immediate action required</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-amber-50 border border-amber-100 rounded-3xl p-6 shadow-soft relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl"></div>
            <div className="text-5xl font-black text-amber-600 mb-1 relative z-10">{severityCounts.warning}</div>
            <p className="text-sm font-black uppercase tracking-widest text-amber-900 relative z-10">Warnings</p>
            <p className="text-xs font-bold text-amber-700/70 mt-1 relative z-10">Elevated monitoring needed</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-blue-50 border border-blue-100 rounded-3xl p-6 shadow-soft relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>
            <div className="text-5xl font-black text-blue-600 mb-1 relative z-10">{severityCounts.info}</div>
            <p className="text-sm font-black uppercase tracking-widest text-blue-900 relative z-10">Insights</p>
            <p className="text-xs font-bold text-blue-700/70 mt-1 relative z-10">System notifications</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-[2rem] shadow-soft p-6 mb-8 border border-surface-200"
        >
          <div className="flex items-center space-x-2 mb-6">
            <Filter className="h-5 w-5 text-surface-400" />
            <h2 className="text-lg font-black text-surface-900 tracking-tight">Filter Intelligence Log</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black text-surface-400 uppercase tracking-widest mb-2">
                Severity Level
              </label>
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="w-full px-5 py-4 bg-surface-50 border border-surface-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-bold text-surface-900 appearance-none"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical Only</option>
                <option value="warning">Warnings Only</option>
                <option value="info">Information Only</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black text-surface-400 uppercase tracking-widest mb-2">
                Event Classification
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-5 py-4 bg-surface-50 border border-surface-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-bold text-surface-900 appearance-none"
              >
                <option value="all">All Types</option>
                <option value="drought">Drought</option>
                <option value="flood">Flood</option>
                <option value="pest">Pest Outbreak</option>
                <option value="growth">Growth Stage</option>
                <option value="weather">Weather Event</option>
              </select>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
             <p className="text-xs font-bold text-surface-500 uppercase tracking-widest">
               Showing {filteredAlerts.length} Event{filteredAlerts.length !== 1 ? 's' : ''}
             </p>
          </div>

          <div className="space-y-6">
             <AnimatePresence>
              {filteredAlerts.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <AlertCard alert={alert} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredAlerts.length === 0 && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="text-center py-20 bg-white rounded-[2.5rem] shadow-soft border border-dashed border-surface-300"
            >
              <div className="bg-surface-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                 <AlertTriangle className="h-6 w-6 text-surface-300" />
              </div>
              <p className="text-surface-900 text-xl font-black tracking-tight mb-1">No AI Events Found</p>
              <p className="text-sm text-surface-500 font-bold">Your farm is operating under optimal conditions.</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

