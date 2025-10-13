import { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';
import marketDataMock from '../mock/market.json';

export default function Market() {
  const { profile } = useAuth();
  const [products, setProducts] = useState(marketDataMock.products);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [newProduct, setNewProduct] = useState({
    product: '',
    price: '',
    quantity: '',
    image: '',
    location: '',
    contact: '',
  });

  const handleAddProduct = (e) => {
    e.preventDefault();

    const platformFee = parseFloat(newProduct.price) * 0.02;

    const product = {
      id: 'prod_' + Date.now(),
      seller: profile?.isAgrovet ? 'My Agrovet' : 'Me',
      sellerType: profile?.isAgrovet ? 'agrovet' : 'farmer',
      product: newProduct.product,
      price: parseFloat(newProduct.price),
      quantity: newProduct.quantity,
      image: newProduct.image || 'https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?auto=compress&cs=tinysrgb&w=400',
      contact: newProduct.contact,
      location: newProduct.location,
      listedDate: new Date().toISOString().split('T')[0],
    };

    setProducts([product, ...products]);
    setShowAddModal(false);
    setNewProduct({
      product: '',
      price: '',
      quantity: '',
      image: '',
      location: '',
      contact: '',
    });

    alert(`Product added successfully! Platform fee: KES ${platformFee.toFixed(2)}`);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.seller.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' ||
                         (filterType === 'farmer' && product.sellerType === 'farmer') ||
                         (filterType === 'agrovet' && product.sellerType === 'agrovet');
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">FarmBora Marketplace</h1>
              <p className="text-gray-600">
                Buy and sell farm products directly with farmers and agrovets
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 md:mt-0 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>List Product</span>
            </button>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg mb-6">
            <p className="text-sm text-yellow-800">
              <span className="font-semibold">Platform Fee:</span> We charge a 2% fee on all transactions to maintain and improve the platform.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search products or sellers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Sellers</option>
                <option value="farmer">Farmers Only</option>
                <option value="agrovet">Agrovets Only</option>
              </select>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-sm text-gray-600 mb-4">
            Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found matching your criteria</p>
            </div>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">List New Product</h2>

              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={newProduct.product}
                    onChange={(e) => setNewProduct({ ...newProduct, product: e.target.value })}
                    required
                    placeholder="e.g., Maize 90kg Bag"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (KES) *
                  </label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    required
                    placeholder="3200"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  {newProduct.price && (
                    <p className="text-xs text-gray-600 mt-1">
                      Platform fee: KES {(parseFloat(newProduct.price) * 0.02).toFixed(2)}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity *
                  </label>
                  <input
                    type="text"
                    value={newProduct.quantity}
                    onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                    required
                    placeholder="e.g., 10 bags"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={newProduct.location}
                    onChange={(e) => setNewProduct({ ...newProduct, location: e.target.value })}
                    required
                    placeholder="e.g., Nakuru"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact (Phone/Email) *
                  </label>
                  <input
                    type="text"
                    value={newProduct.contact}
                    onChange={(e) => setNewProduct({ ...newProduct, contact: e.target.value })}
                    required
                    placeholder="0712345678 or email@example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL (optional)
                  </label>
                  <input
                    type="url"
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    List Product
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
