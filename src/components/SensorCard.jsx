import { motion } from 'framer-motion';

export default function SensorCard({ title, value, unit, status, range, icon: Icon }) {
  const getStatusColor = () => {
    switch (status) {
      case 'optimal':
        return 'bg-green-100 border-green-500 text-green-800';
      case 'fair':
        return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      case 'critical':
        return 'bg-red-100 border-red-500 text-red-800';
      default:
        return 'bg-gray-100 border-gray-500 text-gray-800';
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'optimal':
        return 'bg-green-500 text-white';
      case 'fair':
        return 'bg-yellow-500 text-white';
      case 'critical':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${getStatusColor()} rounded-lg border-2 p-6 shadow-md hover:shadow-lg transition-shadow`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          {Icon && <Icon className="h-6 w-6" />}
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <span className={`${getStatusBadge()} px-3 py-1 rounded-full text-xs font-bold uppercase`}>
          {status}
        </span>
      </div>

      <div className="mb-2">
        <p className="text-4xl font-bold">
          {value}{unit}
        </p>
      </div>

      {range && (
        <div className="text-sm mt-3 opacity-80">
          <p>Optimal Range: {range.min}{unit} - {range.max}{unit}</p>
        </div>
      )}
    </motion.div>
  );
}
