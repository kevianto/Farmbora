import { AlertTriangle, Droplet, Bug, TrendingUp, Cloud, Sparkles, MapPin, Clock } from 'lucide-react';
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

  const getSeverityColors = () => {
    switch (alert.severity) {
      case 'critical':
        return {
          bg: 'bg-rose-50',
          border: 'border-rose-100',
          accent: 'border-rose-500',
          text: 'text-rose-900',
          icon: 'text-rose-600',
          badge: 'bg-rose-600 text-white',
          pulse: 'bg-rose-500'
        };
      case 'warning':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-100',
          accent: 'border-amber-500',
          text: 'text-amber-900',
          icon: 'text-amber-600',
          badge: 'bg-amber-600 text-white',
          pulse: 'bg-amber-500'
        };
      case 'info':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-100',
          accent: 'border-blue-500',
          text: 'text-blue-900',
          icon: 'text-blue-600',
          badge: 'bg-blue-600 text-white',
          pulse: 'bg-blue-500'
        };
      default:
        return {
          bg: 'bg-slate-50',
          border: 'border-slate-100',
          accent: 'border-slate-500',
          text: 'text-slate-900',
          icon: 'text-slate-600',
          badge: 'bg-slate-600 text-white',
          pulse: 'bg-slate-500'
        };
    }
  };

  const colors = getSeverityColors();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.01 }}
      className={`${colors.bg} ${colors.border} border border-l-4 ${colors.accent} rounded-3xl p-8 shadow-soft mb-6 relative overflow-hidden group transition-all duration-300`}
    >
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
        <div className="flex items-center space-x-4">
          <div className={`${colors.icon} bg-white p-3 rounded-2xl shadow-sm`}>
            {getAlertIcon()}
          </div>
          <div>
            <h3 className={`text-xl font-black ${colors.text} tracking-tight`}>{alert.title}</h3>
            <div className="flex items-center space-x-3 mt-1 text-surface-500 font-bold text-xs uppercase tracking-widest">
               <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {new Date(alert.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
               </div>
               {alert.location && (
                 <div className="flex items-center border-l border-surface-200 pl-3">
                    <MapPin className="h-3 w-3 mr-1" />
                    {alert.location}
                 </div>
               )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {alert.severity === 'critical' && (
            <span className="relative flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${colors.pulse} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${colors.pulse}`}></span>
            </span>
          )}
          <span className={`${colors.badge} px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-surface-200`}>
            {alert.severity}
          </span>
        </div>
      </div>

      <p className={`text-surface-700 font-medium leading-relaxed mb-8 max-w-3xl`}>
        {alert.message}
      </p>

      <div className="bg-white/60 backdrop-blur-sm rounded-[2rem] p-6 border border-white relative group-hover:bg-white transition-colors duration-300">
        <div className="flex items-center space-x-2 mb-3">
          <div className="bg-primary-600 p-1.5 rounded-lg">
            <Sparkles className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-[10px] font-black text-primary-700 uppercase tracking-widest">AI Intelligence Response</span>
        </div>
        <p className="text-surface-900 font-bold text-sm leading-relaxed italic">
          "{alert.aiAdvice}"
        </p>
      </div>
      
      {/* Decorative background element */}
      <div className={`absolute -right-4 -bottom-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-500`}>
         {getAlertIcon()}
      </div>
    </motion.div>
  );
}
