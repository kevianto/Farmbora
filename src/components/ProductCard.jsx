import { MapPin, Calendar, Phone, Mail, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function ProductCard({ product }) {
  const [showContact, setShowContact] = useState(false);

  const platformFee = (product.price * 0.02).toFixed(2);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={product.image}
          alt={product.product}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold">
          {product.sellerType === 'agrovet' ? 'Agrovet' : 'Farmer'}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{product.product}</h3>

        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-2xl font-bold text-green-600">KES {product.price.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Platform fee: KES {platformFee}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 flex items-center">
              <Package className="h-4 w-4 mr-1" />
              {product.quantity}
            </p>
          </div>
        </div>

        <div className="space-y-2 mb-4 text-sm text-gray-600">
          <p className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
            {product.location}
          </p>
          <p className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
            Listed: {new Date(product.listedDate).toLocaleDateString()}
          </p>
        </div>

        <div className="border-t pt-3">
          <p className="text-sm font-semibold text-gray-700 mb-2">Seller: {product.seller}</p>

          {!showContact ? (
            <button
              onClick={() => setShowContact(true)}
              className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors font-medium"
            >
              Contact Seller
            </button>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-md p-3 space-y-2">
              <p className="text-sm font-semibold text-green-800">Contact Information:</p>
              {product.contact.includes('@') ? (
                <p className="text-sm flex items-center text-gray-700">
                  <Mail className="h-4 w-4 mr-2 text-green-600" />
                  <a href={`mailto:${product.contact}`} className="hover:text-green-600">
                    {product.contact}
                  </a>
                </p>
              ) : (
                <p className="text-sm flex items-center text-gray-700">
                  <Phone className="h-4 w-4 mr-2 text-green-600" />
                  <a href={`tel:${product.contact}`} className="hover:text-green-600">
                    {product.contact}
                  </a>
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
