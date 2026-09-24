import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Sprout, Eye, EyeOff, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please enter your credentials to continue');
      setLoading(false);
      return;
    }

    try {
      await login(email, password);
      // Let AuthContext fetch profile and handle routing, or we navigate based on profile state
      // For simplicity, we just go to dashboard and AuthRoute will redirect if needed
      navigate('/dashboard');
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail('demo@farmbora.com');
    setPassword('demo1234');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row overflow-hidden font-sans">
      {/* Left Side: Brand & Visuals */}
      <div className="hidden md:flex md:w-1/2 bg-surface-900 relative p-16 flex-col justify-between overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-full h-full bg-primary-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-full h-full bg-primary-900/20 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 flex items-center space-x-3"
        >
          <div className="bg-primary-600 p-2.5 rounded-2xl shadow-lg shadow-primary-900/50">
            <Sprout className="h-8 w-8 text-white" />
          </div>
          <span className="text-3xl font-black tracking-tight text-white">
            Farm<span className="text-primary-500">Bora</span>
          </span>
        </motion.div>

        <div className="relative z-10">
          <motion.h1 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl font-black text-white leading-tight tracking-tighter mb-8"
          >
            Empowering <br />
            The Next <span className="text-primary-500 italic">Green</span> <br />
            Revolution.
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center space-x-4 bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl max-w-sm"
          >
            <div className="bg-primary-500/20 p-3 rounded-2xl text-primary-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <p className="text-surface-300 text-sm font-medium leading-relaxed">
              Trusted by over 50,000 farmers across the continent for smart irrigation and yield optimization.
            </p>
          </motion.div>
        </div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="relative z-10 text-surface-500 text-sm font-bold uppercase tracking-widest"
        >
          © 2026 FarmBora • Smart Agri-Solutions
        </motion.p>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-surface-50">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="mb-10">
            <h2 className="text-4xl font-black text-surface-900 tracking-tight mb-3">Welcome Back</h2>
            <p className="text-surface-500 font-bold">Access your farm control center</p>
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-black text-surface-400 uppercase tracking-widest mb-3">
                Account Email
              </label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-surface-400 group-focus-within:text-primary-600 transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-14 pr-5 py-4 bg-white border border-surface-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all font-bold text-surface-900"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-xs font-black text-surface-400 uppercase tracking-widest">
                  Secure Password
                </label>
                <a href="#" className="text-xs font-black text-primary-600 hover:text-primary-700">Forgot?</a>
              </div>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-surface-400 group-focus-within:text-primary-600 transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-14 pr-14 py-4 bg-white border border-surface-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all font-bold text-surface-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 transform -translate-y-1/2 text-surface-400 hover:text-surface-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-5 rounded-3xl font-black text-lg shadow-xl shadow-primary-200 hover:bg-primary-700 transition-all disabled:bg-surface-300 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center space-x-3"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In to FarmBora</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8">
            <button
              onClick={handleDemoLogin}
              className="w-full bg-white border border-surface-200 text-surface-900 py-4 rounded-3xl font-black text-sm hover:bg-surface-50 transition-all flex items-center justify-center space-x-3"
            >
              <div className="bg-emerald-100 p-1.5 rounded-lg">
                <Sparkles className="h-4 w-4 text-emerald-600" />
              </div>
              <span>Try Demo Account</span>
            </button>
          </div>

          <div className="mt-12 text-center">
            <p className="text-surface-500 font-bold text-sm">
              New to the platform?{' '}
              <Link to="/signup" className="text-primary-600 font-black hover:text-primary-700 underline underline-offset-4">
                Create Account
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
