const mongoose = require('mongoose');

const subSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cost: { type: Number, required: true },
  brandColor: { type: String, required: false },
  userId: { type: String, required: true },
  userName: { type: String, required: false }
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subSchema);