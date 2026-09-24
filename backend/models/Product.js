const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  seller: { type: String, required: true },
  sellerType: { type: String, enum: ['farmer', 'agrovet'], required: true },
  product: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: String, required: true },
  image: { type: String, required: true },
  location: { type: String, required: true },
  contact: { type: String, required: true },
  trend: { type: String, enum: ['up', 'down', 'stable'], default: 'stable' },
  listedDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
