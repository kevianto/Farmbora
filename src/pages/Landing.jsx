import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sprout, ShieldCheck, Zap, Globe, ArrowRight, Activity, ShoppingBag, MessageSquare } from 'lucide-react';

export default function Landing() {
  const features = [
    {
      icon: Activity,
      title: "Real-time Monitoring",
      description: "Get instant data from your soil and air sensors directly to your dashboard."
    },
    {
      icon: Zap,
      title: "AI Predictions",
      description: "Advanced algorithms forecast weather patterns and crop yields for optimal planning."
    },
    {
      icon: ShoppingBag,
      title: "Direct Marketplace",
      description: "Sell your produce or buy farm inputs with our secure, peer-to-peer marketplace."
    },
    {
      icon: MessageSquare,
      title: "Expert AI Advisor",
      description: "Our farming-specialized AI is ready to answer your agricultural questions 24/7."
    }
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-surface-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-primary-600 p-2 rounded-xl">
              <Sprout className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight text-surface-900">
              Farm<span className="text-primary-600">Bora</span>
            </span>
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/login" className="text-surface-600 font-bold hover:text-primary-600 transition-colors">Login</Link>
            <Link to="/signup" className="bg-primary-600 text-white px-6 py-3 rounded-2xl font-black shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 relative">
        <div className="absolute top-0 right-0 w-1/2 h-[800px] bg-primary-50 rounded-bl-[200px] -z-10 animate-pulse"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full border border-emerald-100 mb-8">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-xs font-black uppercase tracking-widest">Next-Gen Agricultural Tech</span>
              </div>
              <h1 className="text-7xl font-black text-surface-900 tracking-tighter leading-none mb-6">
                Cultivate Your <span className="text-primary-600">Future</span> With Intelligence.
              </h1>
              <p className="text-surface-500 text-xl font-medium leading-relaxed mb-10 max-w-lg">
                The all-in-one smart farming platform that uses IoT and AI to maximize your yields and minimize risks.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup" className="bg-primary-600 text-white px-10 py-5 rounded-[2rem] font-black text-lg shadow-xl shadow-primary-200 hover:bg-primary-700 hover:scale-105 transition-all flex items-center justify-center space-x-2 group">
                  <span>Start Free Trial</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="bg-white text-surface-900 px-10 py-5 rounded-[2rem] font-black text-lg border-2 border-surface-200 hover:bg-surface-50 transition-all">
                  Watch Demo
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative"
            >
              <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-surface-200">
                <img 
                  src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=1000" 
                  alt="Smart Farm Dashboard"
                  className="w-full"
                />
              </div>
              <div className="absolute -bottom-10 -left-10 bg-surface-900 rounded-3xl p-8 shadow-2xl text-white max-w-[280px]">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-emerald-500 p-2 rounded-xl">
                    <Activity className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-surface-400">Current Health</p>
                    <p className="text-xl font-black">98.4% Optimal</p>
                  </div>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-[98%] bg-emerald-500 rounded-full"></div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 bg-surface-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-xs font-black text-primary-600 uppercase tracking-[0.3em] mb-4">The Platform</h2>
            <h3 className="text-5xl font-black text-surface-900 tracking-tight">Everything You Need to Scale Your Farm</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -10 }}
                className="bg-white p-10 rounded-[2.5rem] border border-surface-200 shadow-soft"
              >
                <div className="bg-primary-50 w-16 h-16 rounded-2xl flex items-center justify-center text-primary-600 mb-8">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h4 className="text-2xl font-black text-surface-900 tracking-tight mb-4">{feature.title}</h4>
                <p className="text-surface-500 font-medium leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div>
              <p className="text-6xl font-black text-surface-900 tracking-tighter mb-2">50k+</p>
              <p className="text-surface-500 font-bold uppercase tracking-widest text-sm">Active Farmers</p>
            </div>
            <div>
              <p className="text-6xl font-black text-primary-600 tracking-tighter mb-2">25%</p>
              <p className="text-surface-500 font-bold uppercase tracking-widest text-sm">Average Yield Increase</p>
            </div>
            <div>
              <p className="text-6xl font-black text-surface-900 tracking-tighter mb-2">12</p>
              <p className="text-surface-500 font-bold uppercase tracking-widest text-sm">Countries Supported</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto bg-surface-900 rounded-[3.5rem] p-16 relative overflow-hidden text-center">
          <div className="absolute inset-0 bg-primary-600/10 blur-[120px] rounded-full"></div>
          <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-8 relative z-10">
            Ready to transform <br/>your farming?
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
            <Link to="/signup" className="bg-primary-600 text-white px-12 py-6 rounded-[2rem] font-black text-xl shadow-2xl shadow-primary-500/20 hover:bg-primary-700 transition-all">
              Create Free Account
            </Link>
            <button className="bg-white/10 text-white px-12 py-6 rounded-[2rem] font-black text-xl border border-white/20 hover:bg-white/20 transition-all">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-surface-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex items-center space-x-2">
            <div className="bg-primary-600 p-2 rounded-xl">
              <Sprout className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight text-surface-900">
              Farm<span className="text-primary-600">Bora</span>
            </span>
          </div>
          <p className="text-surface-400 font-bold text-sm">© 2026 FarmBora. All rights reserved.</p>
          <div className="flex space-x-8 text-surface-400 font-bold text-sm">
            <a href="#" className="hover:text-primary-600 transition-colors">Twitter</a>
            <a href="#" className="hover:text-primary-600 transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-primary-600 transition-colors">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
