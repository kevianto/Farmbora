const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  farmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
  type: { type: String, required: true },
  severity: { type: String, enum: ['critical', 'warning', 'info'], default: 'info' },
  title: { type: String, required: true },
  message: { type: String, required: true },
  aiAdvice: { type: String },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Alert', alertSchema);
