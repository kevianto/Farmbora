import { useState, useEffect } from 'react';
import { Plus, Search, ShoppingBag, X, Database, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';
import marketData from '../mock/market.json';
import { api, endpoints } from '../services/api';

const FALLBACK_PRODUCTS = [
  {
    _id: "prod_001",
    id: "prod_001",
    seller: "Green Harvest Agrovets",
    sellerType: "agrovet",
    product: "Maize HB614 Premium Hybrid Seeds",
    price: 3450,
    quantity: "10kg Bag",
    image: "https://images.unsplash.com/photo-1551739440-5dd934d3a94a?auto=format&fit=crop&q=80&w=400",
    location: "Nakuru",
    contact: "info@greenharvest.com",
    trend: "up",
    listedDate: "2025-10-05T08:00:00.000Z"
  },
  {
    _id: "prod_002",
    id: "prod_002",
    seller: "Farmer John Kamau",
    sellerType: "farmer",
    product: "Organic Red Kidney Beans",
    price: 130,
    quantity: "1kg",
    image: "https://images.unsplash.com/photo-1550291652-6ea9114a47b1?auto=format&fit=crop&q=80&w=400",
    location: "Eldoret",
    contact: "0712345678",
    trend: "stable",
    listedDate: "2025-10-08T09:30:00.000Z"
  },
  {
    _id: "prod_003",
    id: "prod_003",
    seller: "Mary Wanjiru",
    sellerType: "farmer",
    product: "Fresh Grade-A Tomatoes",
    price: 1200,
    quantity: "15kg Crate",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=400",
    location: "Kiambu",
    contact: "0711223344",
    trend: "up",
    listedDate: "2025-10-10T11:15:00.000Z"
  },
  {
    _id: "prod_004",
    id: "prod_004",
    seller: "FarmTech Agrovet",
    sellerType: "agrovet",
    product: "NPK 17:17:17 Planting Fertilizer",
    price: 4500,
    quantity: "50kg Bag",
    image: "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&q=80&w=400",
    location: "Nairobi",
    contact: "+254722334455",
    trend: "down",
    listedDate: "2025-10-07T14:20:00.000Z"
  },
  {
    _id: "prod_005",
    id: "prod_005",
    seller: "Peter Omondi",
    sellerType: "farmer",
    product: "Fresh Pure Farm Milk",
    price: 70,
    quantity: "1 Liter",
    image: "https://images.unsplash.com/photo-1528498033373-3c6c08e93d79?auto=format&fit=crop&q=80&w=400",
    location: "Bomet",
    contact: "0733445566",
    trend: "up",
    listedDate: "2025-10-09T07:45:00.000Z"
  },
  {
    _id: "prod_006",
    id: "prod_006",
    seller: "Livestock Pro Agrovets",
    sellerType: "agrovet",
    product: "High-Protein Dairy Meal",
    price: 2800,
    quantity: "50kg Bag",
    image: "https://images.unsplash.com/photo-1535090467336-9501f96eef89?auto=format&fit=crop&q=80&w=400",
    location: "Nyeri",
    contact: "orders@livestockpro.co.ke",
    trend: "stable",
    listedDate: "2025-10-06T16:00:00.000Z"
  },
  {
    _id: "prod_007",
    id: "prod_007",
    seller: "SmartIrrigate Ltd",
    sellerType: "agrovet",
    product: "Drip Irrigation Starter Kit",
    price: 15500,
    quantity: "1/4 Acre Set",
    image: "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&q=80&w=400",
    location: "Thika",
    contact: "tech@smartirrigate.com",
    trend: "stable",
    listedDate: "2025-10-04T10:10:00.000Z"
  },
  {
    _id: "prod_008",
    id: "prod_008",
    seller: "Murang'a Farmers Co-op",
    sellerType: "farmer",
    product: "Export Grade Hass Avocados",
    price: 1800,
    quantity: "20kg Box",
    image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&q=80&w=400",
    location: "Murang'a",
    contact: "0799887766",
    trend: "up",
    listedDate: "2025-10-11T12:00:00.000Z"
  }
];

export default function Market() {
  const { profile } = useAuth();
  const [products, setProducts] = useState(() => {
    if (marketData && marketData.products && marketData.products.length > 0) {
      return marketData.products.map(p => ({ ...p, _id: p.id || p._id || Math.random().toString() }));
    }
    return FALLBACK_PRODUCTS;
  });
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [newProduct, setNewProduct] = useState({
    product: '', price: '', quantity: '', image: '', location: '', contact: '',
  });

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await api.get(endpoints.market.list);
        if (response.data && response.data.products && response.data.products.length > 0) {
          console.log("[Market] Products loaded from backend API:", response.data.products.length);
          setProducts(response.data.products.map(p => ({ ...p, _id: p._id || p.id || Math.random().toString() })));
        }
      } catch (err) {
        console.log("[Market] Backend API unreachable, using hardcoded dummy products:", err.message);
      }
    }
    loadProducts();
  }, []);

  const handleAddProduct = (e) => {
    e.preventDefault();
    const productData = {
      _id: `local_${Date.now()}`,
      seller: profile?.name || 'Me',
      sellerType: profile?.isAgrovet ? 'agrovet' : 'farmer',
      product: newProduct.product,
      price: parseFloat(newProduct.price),
      quantity: newProduct.quantity,
      image: newProduct.image || 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=400',
      contact: newProduct.contact,
      location: newProduct.location,
      listedDate: new Date().toISOString(),
      trend: 'stable'
    };
    
    setProducts([productData, ...products]);
    setShowAddModal(false);
    setNewProduct({ product: '', price: '', quantity: '', image: '', location: '', contact: '' });
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = (product.product?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (product.seller?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' ||
                         (filterType === 'farmer' && product.sellerType === 'farmer') ||
                         (filterType === 'agrovet' && product.sellerType === 'agrovet');
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-surface-50 pb-20">
      <div className="bg-white border-b border-surface-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary-50 skew-x-12 translate-x-1/2 -z-0"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-primary-600 p-2 rounded-xl">
                  <ShoppingBag className="h-5 w-5 text-white" />
                </div>
                <div className="flex items-center space-x-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-50 text-brand-accent border border-amber-100">
                  <Zap className="h-3 w-3" />
                  <span>Simulated Market Active</span>
                </div>
              </div>
              <h1 className="text-5xl font-black text-surface-900 tracking-tight mb-4">
                The Agri-<span className="text-primary-600 font-black">Trade</span> Network.
              </h1>
              <p className="text-surface-500 text-lg font-medium leading-relaxed max-w-xl">
                Global direct-to-farm marketplace. Real-time pricing engine powered by demand-simulation algorithms.
              </p>
            </motion.div>

            <button
              onClick={() => setShowAddModal(true)}
              className="bg-primary-600 text-white px-8 py-4 rounded-3xl font-black text-lg shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all flex items-center justify-center space-x-3 group"
            >
              <Plus className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
              <span>List Product</span>
            </button>
          </div>

          <div className="mt-12 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-surface-400 h-5 w-5 group-focus-within:text-primary-600 transition-colors" />
              <input
                type="text"
                placeholder="Search verified seeds, chemicals or produce..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-surface-50 border border-surface-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-bold"
              />
            </div>

            <div className="bg-white border border-surface-200 rounded-2xl p-1 flex">
              {['all', 'farmer', 'agrovet'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    filterType === type ? 'bg-surface-900 text-white shadow-md' : 'text-surface-500 hover:text-surface-900'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[3rem] shadow-soft border border-surface-100">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
            <p className="text-surface-500 font-bold uppercase tracking-widest text-xs italic">Syncing Trade Telemetry...</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
               <h2 className="text-2xl font-black text-surface-900 tracking-tight">Featured Trade Listings</h2>
               <div className="flex items-center space-x-2 text-surface-400 text-sm font-bold bg-white px-4 py-2 rounded-full border border-surface-100">
                  <ShoppingBag className="h-4 w-4" />
                  <span>{filteredProducts.length} Listings Synchronized</span>
               </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-surface-200 p-8 shadow-soft">
                <ShoppingBag className="h-12 w-12 text-surface-300 mx-auto mb-4" />
                <h3 className="text-xl font-black text-surface-900 mb-2">No matching listings found</h3>
                <p className="text-surface-500 font-medium max-w-md mx-auto text-sm mb-6">
                  Try clearing your search query or switching filters to see available trade listings.
                </p>
                <button
                  onClick={() => { setSearchTerm(''); setFilterType('all'); }}
                  className="px-6 py-3 bg-primary-600 text-white rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-primary-700 transition-all shadow-md"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                <AnimatePresence>
                  {filteredProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </>
        )}
      </div>

      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-surface-900/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl relative z-10 overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="bg-primary-600 p-8 text-white flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-black tracking-tight uppercase">List Produce</h2>
                  <p className="text-primary-100 font-bold text-sm mt-1 uppercase tracking-widest">Connect with verified buyers</p>
                </div>
                <button onClick={() => setShowAddModal(false)} className="bg-white/20 p-2 rounded-xl hover:bg-white/30 transition-colors"><X className="h-6 w-6" /></button>
              </div>
              <form onSubmit={handleAddProduct} className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-[10px] font-black text-surface-400 uppercase tracking-widest mb-2">Item Name</label>
                    <input type="text" required placeholder="e.g. Maize" className="w-full px-5 py-3 bg-surface-50 border border-surface-200 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none font-bold" value={newProduct.product} onChange={(e) => setNewProduct({ ...newProduct, product: e.target.value })} />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-[10px] font-black text-surface-400 uppercase tracking-widest mb-2">Price (KES)</label>
                    <input type="number" required placeholder="3400" className="w-full px-5 py-3 bg-surface-50 border border-surface-200 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none font-bold" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-[10px] font-black text-surface-400 uppercase tracking-widest mb-2">Volume/Qty</label>
                    <input type="text" required placeholder="e.g. 50 Bags" className="w-full px-5 py-3 bg-surface-50 border border-surface-200 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none font-bold" value={newProduct.quantity} onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })} />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-[10px] font-black text-surface-400 uppercase tracking-widest mb-2">Region</label>
                    <input type="text" required placeholder="e.g. Nakuru" className="w-full px-5 py-3 bg-surface-50 border border-surface-200 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none font-bold" value={newProduct.location} onChange={(e) => setNewProduct({ ...newProduct, location: e.target.value })} />
                  </div>
                </div>
                <div>
                   <label className="block text-[10px] font-black text-surface-400 uppercase tracking-widest mb-2">Contact Signal</label>
                   <input type="text" required placeholder="Phone or Email" className="w-full px-5 py-3 bg-surface-50 border border-surface-200 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none font-bold" value={newProduct.contact} onChange={(e) => setNewProduct({ ...newProduct, contact: e.target.value })} />
                </div>
                <button type="submit" className="w-full bg-primary-600 text-white py-5 rounded-3xl font-black text-lg shadow-xl shadow-primary-200 hover:bg-primary-700 transition-all uppercase">Verify and List</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
