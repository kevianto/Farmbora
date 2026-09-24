import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Sprout, ArrowRight, ShieldCheck, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      setError('All fields are required to secure your account');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Security requirement: Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });
      navigate('/profile');
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row overflow-hidden font-sans">
      {/* Left Side: Brand & Benefits */}
      <div className="hidden md:flex md:w-1/2 bg-primary-600 relative p-16 flex-col justify-between overflow-hidden">
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-full bg-surface-900/10 -z-0"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 flex items-center space-x-3"
        >
          <div className="bg-white p-2.5 rounded-2xl shadow-lg shadow-primary-700/50">
            <Sprout className="h-8 w-8 text-primary-600" />
          </div>
          <span className="text-3xl font-black tracking-tight text-white">
            Farm<span className="text-primary-950/40">Bora</span>
          </span>
        </motion.div>

        <div className="relative z-10">
          <motion.h1 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl font-black text-white leading-tight tracking-tighter mb-12"
          >
            Join The <br />
            Digital Farming <br />
            Era.
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {[
              "Real-time IoT sensor telemetry",
              "AI-driven predictive analytics",
              "Transparent B2B marketplace"
            ].map((benefit, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="bg-white/20 p-1.5 rounded-full">
                  <CheckCircle2 className="h-5 w-5 text-white" />
                </div>
                <span className="text-white font-bold text-lg">{benefit}</span>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="relative z-10 flex items-center space-x-4 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl max-w-sm"
        >
          <div className="bg-white p-3 rounded-2xl text-primary-600">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <p className="text-white text-sm font-medium leading-relaxed">
            Over 50,000 farmers already trust our encrypted platform for their daily operations.
          </p>
        </motion.div>
      </div>

      {/* Right Side: Signup Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-surface-50 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md py-12"
        >
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-4xl font-black text-surface-900 tracking-tight mb-3">Create Account</h2>
            <p className="text-surface-500 font-bold">Start your 14-day premium free trial</p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-rose-50 border border-rose-100 text-rose-700 px-5 py-4 rounded-2xl mb-6 flex items-center space-x-3"
              >
                <div className="bg-rose-500 h-2 w-2 rounded-full"></div>
                <p className="text-sm font-bold">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-black text-surface-400 uppercase tracking-widest mb-2.5">Farmer Name</label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-surface-400 group-focus-within:text-primary-600 transition-colors">
                  <User className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="John Kamau"
                  className="w-full pl-14 pr-5 py-4 bg-white border border-surface-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-bold text-surface-900"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[10px] font-black text-surface-400 uppercase tracking-widest mb-2.5">Email Address</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-surface-400 group-focus-within:text-primary-600 transition-colors">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="name@email.com"
                    className="w-full pl-14 pr-5 py-4 bg-white border border-surface-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-bold text-surface-900 text-xs"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[10px] font-black text-surface-400 uppercase tracking-widest mb-2.5">Phone Number</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-surface-400 group-focus-within:text-primary-600 transition-colors">
                    <Phone className="h-5 w-5" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+254"
                    className="w-full pl-14 pr-5 py-4 bg-white border border-surface-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-bold text-surface-900 text-xs"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[10px] font-black text-surface-400 uppercase tracking-widest mb-2.5">Password</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-surface-400 group-focus-within:text-primary-600 transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    placeholder="••••••••"
                    className="w-full pl-14 pr-5 py-4 bg-white border border-surface-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-bold text-surface-900"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[10px] font-black text-surface-400 uppercase tracking-widest mb-2.5">Confirm</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-surface-400 group-focus-within:text-primary-600 transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    required
                    placeholder="••••••••"
                    className="w-full pl-14 pr-5 py-4 bg-white border border-surface-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-bold text-surface-900"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 text-white py-5 rounded-3xl font-black text-lg shadow-xl shadow-primary-200 hover:bg-primary-700 transition-all disabled:bg-surface-300 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
              >
                {loading ? (
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Create Farm Account</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-10 text-center">
            <p className="text-surface-500 font-bold text-sm">
              Member already?{' '}
              <Link to="/login" className="text-primary-600 font-black hover:text-primary-700 underline underline-offset-4">
                Sign In Instead
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
