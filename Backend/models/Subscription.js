const mongoose = require('mongoose');

const subSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cost: { type: Number, required: true },
  billingCycle: { type: String, required: true, enum: ['Monthly', 'Yearly'] },
  category: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subSchema);