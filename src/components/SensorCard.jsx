import { motion } from 'framer-motion';

export default function SensorCard({ title, value, unit, status, range, icon: Icon }) {
  const getStatusColors = () => {
    switch (status) {
      case 'optimal':
        return {
          bg: 'bg-emerald-50',
          border: 'border-emerald-100',
          text: 'text-emerald-900',
          icon: 'text-emerald-600',
          indicator: 'bg-emerald-500',
          shadow: 'shadow-emerald-100',
          gradient: 'from-emerald-50 to-white'
        };
      case 'fair':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-100',
          text: 'text-amber-900',
          icon: 'text-amber-600',
          indicator: 'bg-amber-500',
          shadow: 'shadow-amber-100',
          gradient: 'from-amber-50 to-white'
        };
      case 'critical':
        return {
          bg: 'bg-rose-50',
          border: 'border-rose-100',
          text: 'text-rose-900',
          icon: 'text-rose-600',
          indicator: 'bg-rose-500',
          shadow: 'shadow-rose-100',
          gradient: 'from-rose-50 to-white'
        };
      default:
        return {
          bg: 'bg-slate-50',
          border: 'border-slate-100',
          text: 'text-slate-900',
          icon: 'text-slate-600',
          indicator: 'bg-slate-500',
          shadow: 'shadow-slate-100',
          gradient: 'from-slate-50 to-white'
        };
    }
  };

  const colors = getStatusColors();

  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={`relative overflow-hidden bg-white rounded-3xl border ${colors.border} p-6 ${colors.shadow} shadow-soft transition-all duration-300`}
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-50 -z-10`} />
      
      <div className="flex items-center justify-between mb-6">
        <div className={`p-3 rounded-2xl ${colors.bg} ${colors.icon}`}>
          {Icon && <Icon className="h-6 w-6" />}
        </div>
        <div className="flex items-center space-x-2">
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${colors.indicator} opacity-75`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${colors.indicator}`}></span>
          </span>
          <span className={`text-[10px] font-black uppercase tracking-widest ${colors.text} opacity-70`}>
            {status}
          </span>
        </div>
      </div>

      <div>
        <h3 className="text-surface-500 text-sm font-bold mb-1">{title}</h3>
        <div className="flex items-baseline space-x-1">
          <span className="text-4xl font-black text-surface-900 tracking-tight">
            {value}
          </span>
          <span className="text-lg font-bold text-surface-400">{unit}</span>
        </div>
      </div>

      {range && (
        <div className="mt-6">
          <div className="flex justify-between text-[10px] font-bold text-surface-400 uppercase tracking-tighter mb-2">
            <span>Optimal Range</span>
            <span>{range.min}{unit} - {range.max}{unit}</span>
          </div>
          <div className="h-1.5 w-full bg-surface-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (value / range.max) * 100)}%` }}
              className={`h-full ${colors.indicator} rounded-full`}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}
