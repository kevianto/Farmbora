import { useState } from 'react';
import { AlertTriangle, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import AlertCard from '../components/AlertCard';
import alertsDataMock from '../mock/alerts.json';

export default function Alerts() {
  const [alerts] = useState(alertsDataMock.alerts);
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterType, setFilterType] = useState('all');

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="h-8 w-8 text-orange-600" />
            <h1 className="text-3xl font-bold text-gray-900">Alerts & Notifications</h1>
          </div>
          <p className="text-gray-600">
            Stay informed about weather warnings, pest outbreaks, and growth stage reminders
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-center"
          >
            <div className="text-4xl font-bold text-red-600 mb-2">{severityCounts.critical}</div>
            <p className="text-sm font-semibold text-red-900">Critical Alerts</p>
            <p className="text-xs text-red-700 mt-1">Require immediate attention</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 text-center"
          >
            <div className="text-4xl font-bold text-yellow-600 mb-2">{severityCounts.warning}</div>
            <p className="text-sm font-semibold text-yellow-900">Warnings</p>
            <p className="text-xs text-yellow-700 mt-1">Monitor closely</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 text-center"
          >
            <div className="text-4xl font-bold text-blue-600 mb-2">{severityCounts.info}</div>
            <p className="text-sm font-semibold text-blue-900">Information</p>
            <p className="text-xs text-blue-700 mt-1">General updates</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-md p-6 mb-8"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-bold text-gray-900">Filter Alerts</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Severity
              </label>
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical Only</option>
                <option value="warning">Warnings Only</option>
                <option value="info">Information Only</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Types</option>
                <option value="drought">Drought</option>
                <option value="flood">Flood</option>
                <option value="pest">Pest Outbreak</option>
                <option value="growth">Growth Stage</option>
                <option value="weather">Weather</option>
              </select>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-sm text-gray-600 mb-4">
            Showing {filteredAlerts.length} alert{filteredAlerts.length !== 1 ? 's' : ''}
          </p>

          <div className="space-y-4">
            {filteredAlerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <AlertCard alert={alert} />
              </motion.div>
            ))}
          </div>

          {filteredAlerts.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-gray-500 text-lg">No alerts found matching your filters</p>
              <p className="text-sm text-gray-400 mt-2">Try adjusting your filter criteria</p>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-green-50 border-l-4 border-green-500 p-6 rounded-lg"
        >
          <h3 className="text-lg font-bold text-green-900 mb-3">About Alert Types</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-800">
            <div>
              <p className="font-semibold mb-1">Drought Warnings</p>
              <p>Below-average rainfall predictions requiring water conservation measures</p>
            </div>
            <div>
              <p className="font-semibold mb-1">Flood Alerts</p>
              <p>Heavy rainfall warnings requiring drainage preparation</p>
            </div>
            <div>
              <p className="font-semibold mb-1">Pest Outbreaks</p>
              <p>Notifications about pest activity in your region</p>
            </div>
            <div>
              <p className="font-semibold mb-1">Growth Reminders</p>
              <p>Stage-specific farming activities and best practices</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
