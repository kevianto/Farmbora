import { AlertTriangle, Droplet, Bug, TrendingUp, Cloud } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AlertCard({ alert }) {
  const getAlertIcon = () => {
    switch (alert.type) {
      case 'drought':
        return <Cloud className="h-6 w-6" />;
      case 'flood':
        return <Droplet className="h-6 w-6" />;
      case 'pest':
        return <Bug className="h-6 w-6" />;
      case 'growth':
        return <TrendingUp className="h-6 w-6" />;
      default:
        return <AlertTriangle className="h-6 w-6" />;
    }
  };

  const getSeverityStyles = () => {
    switch (alert.severity) {
      case 'critical':
        return 'bg-red-50 border-red-500 text-red-900';
      case 'warning':
        return 'bg-yellow-50 border-yellow-500 text-yellow-900';
      case 'info':
        return 'bg-blue-50 border-blue-500 text-blue-900';
      default:
        return 'bg-gray-50 border-gray-500 text-gray-900';
    }
  };

  const getSeverityBadge = () => {
    switch (alert.severity) {
      case 'critical':
        return 'bg-red-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-white';
      case 'info':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`${getSeverityStyles()} border-l-4 rounded-lg p-6 shadow-md mb-4`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          {getAlertIcon()}
          <h3 className="text-lg font-bold">{alert.title}</h3>
        </div>
        <span className={`${getSeverityBadge()} px-3 py-1 rounded-full text-xs font-bold uppercase`}>
          {alert.severity}
        </span>
      </div>

      <p className="text-sm mb-2">{alert.message}</p>

      {alert.location && (
        <p className="text-sm font-semibold mb-2">Location: {alert.location}</p>
      )}

      <p className="text-xs opacity-70 mb-3">
        {new Date(alert.date).toLocaleString('en-US', {
          dateStyle: 'medium',
          timeStyle: 'short'
        })}
      </p>

      <div className="bg-white bg-opacity-50 rounded-md p-4 mt-4">
        <p className="text-sm font-semibold mb-1">AI Recommendation:</p>
        <p className="text-sm">{alert.aiAdvice}</p>
      </div>
    </motion.div>
  );
}
