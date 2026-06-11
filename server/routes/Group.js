const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  createdBy: { type: String, default: 'Anonymous' }
}, { timestamps: true });

module.exports = mongoose.model('Group', groupSchema);