import { MapPin, Calendar, Phone, Mail, Package, ExternalLink, ShieldCheck, User, Store, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function ProductCard({ product = {} }) {
  const [showContact, setShowContact] = useState(false);

  const price = Number(product.price) || 0;
  const platformFee = (price * 0.02).toFixed(2);
  const contactStr = product.contact || 'No contact provided';
  const isEmail = contactStr.includes('@');
  const imageSrc = product.image || 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=400';
  const listedDateStr = product.listedDate && !isNaN(new Date(product.listedDate).getTime()) 
    ? new Date(product.listedDate).toLocaleDateString() 
    : new Date().toLocaleDateString();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="bg-white rounded-3xl border border-surface-200 overflow-hidden shadow-soft hover:shadow-xl transition-all duration-300 flex flex-col h-full"
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={imageSrc}
          alt={product.product || 'Agricultural Product'}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
        />
        <div className="absolute top-4 left-4">
          <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg backdrop-blur-md ${
            product.sellerType === 'agrovet' 
              ? 'bg-blue-600/90 text-white' 
              : 'bg-primary-600/90 text-white'
          }`}>
            {product.sellerType === 'agrovet' ? <Store className="h-3 w-3" /> : <User className="h-3 w-3" />}
            <span>{product.sellerType || 'farmer'}</span>
          </div>
        </div>
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-2xl shadow-lg border border-surface-100">
           <div className="flex items-center space-x-1 text-primary-600">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span className="text-[10px] font-black uppercase tracking-tight">Verified</span>
           </div>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-black text-surface-900 tracking-tight mb-1">{product.product || 'Produce Item'}</h3>
            <div className="flex items-center text-surface-400 text-xs font-bold">
              <MapPin className="h-3 w-3 mr-1" />
              {product.location || 'Kenya'}
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end space-x-1 mb-1">
               {product.trend === 'up' && <TrendingUp className="h-3 w-3 text-emerald-500" />}
               {product.trend === 'down' && <TrendingDown className="h-3 w-3 text-rose-500" />}
               {(product.trend === 'stable' || !product.trend) && <Minus className="h-3 w-3 text-surface-300" />}
               <span className={`text-[8px] font-black uppercase tracking-widest ${
                 product.trend === 'up' ? 'text-emerald-500' : product.trend === 'down' ? 'text-rose-500' : 'text-surface-400'
               }`}>
                 {product.trend || 'stable'}
               </span>
            </div>
            <p className="text-2xl font-black text-primary-600 tracking-tighter leading-none">
              <span className="text-xs font-bold mr-0.5">KES</span>
              {price.toLocaleString()}
            </p>
            <p className="text-[10px] text-surface-400 font-bold mt-1 uppercase tracking-tighter">
              + {platformFee} fee
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-surface-50 rounded-2xl p-3 border border-surface-100">
            <div className="flex items-center text-surface-400 text-[10px] font-black uppercase tracking-widest mb-1">
              <Package className="h-3 w-3 mr-1" />
              Stock
            </div>
            <p className="text-surface-900 font-bold text-sm">{product.quantity || 'In Stock'}</p>
          </div>
          <div className="bg-surface-50 rounded-2xl p-3 border border-surface-100">
            <div className="flex items-center text-surface-400 text-[10px] font-black uppercase tracking-widest mb-1">
              <Calendar className="h-3 w-3 mr-1" />
              Listed
            </div>
            <p className="text-surface-900 font-bold text-sm">{listedDateStr}</p>
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-surface-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-surface-100 flex items-center justify-center text-surface-600 font-bold text-xs border border-surface-200">
                {product.seller?.charAt(0) || 'M'}
              </div>
              <p className="text-sm font-bold text-surface-700">{product.seller || 'Verified Seller'}</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!showContact ? (
              <motion.button
                key="contact-btn"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowContact(true)}
                className="w-full bg-surface-900 text-white py-3.5 rounded-2xl font-black text-sm hover:bg-surface-800 transition-all shadow-lg shadow-surface-200 flex items-center justify-center space-x-2"
              >
                <span>Contact Seller</span>
                <ExternalLink className="h-4 w-4" />
              </motion.button>
            ) : (
              <motion.div
                key="contact-info"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-primary-50 border border-primary-100 rounded-2xl p-4 space-y-3"
              >
                <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest text-center">Contact Securely</p>
                {isEmail ? (
                  <a 
                    href={`mailto:${contactStr}`} 
                    className="flex items-center justify-center space-x-2 text-sm font-bold text-surface-900 bg-white p-2.5 rounded-xl border border-primary-200 hover:border-primary-400 transition-all"
                  >
                    <Mail className="h-4 w-4 text-primary-600" />
                    <span>{contactStr}</span>
                  </a>
                ) : (
                  <a 
                    href={`tel:${contactStr}`} 
                    className="flex items-center justify-center space-x-2 text-sm font-bold text-surface-900 bg-white p-2.5 rounded-xl border border-primary-200 hover:border-primary-400 transition-all"
                  >
                    <Phone className="h-4 w-4 text-primary-600" />
                    <span>{contactStr}</span>
                  </a>
                )}
                <button 
                  onClick={() => setShowContact(false)}
                  className="w-full text-[10px] font-bold text-surface-400 hover:text-surface-600 uppercase tracking-tighter"
                >
                  Close Info
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
