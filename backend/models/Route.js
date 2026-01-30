const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  source: { type: String, required: true },
  destination: { type: String, required: true },
  departurePoint: { type: String, required: true },
  arrivalPoint: { type: String, required: true },
  distance: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Route', routeSchema);
