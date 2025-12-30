const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  busNumber: {
    type: String,
    required: true,
    unique: true,
  },
  operatorName: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['AC', 'Non-AC', 'Sleeper', 'Seater'],
    required: true,
  },
  totalSeats: {
    type: Number,
    required: true,
  },
  // Layout could be stored as JSON or defined structure
  layout: {
      type: Array, // simplified for now: ['1A', '1B', ...]
      default: []
  }
}, { timestamps: true });

module.exports = mongoose.model('Bus', busSchema);
