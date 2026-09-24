const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  name: { type: String, required: true },
  location: {
    lat: { type: Number },
    lng: { type: Number },
    address: { type: String }
  },
  type: { type: String, enum: ['plant', 'animal'], default: 'plant' },
  cropType: { type: String },
  isAgrovet: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Farm', farmSchema);
