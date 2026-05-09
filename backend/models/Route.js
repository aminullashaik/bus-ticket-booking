const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  source: { type: String, required: true },
  destination: { type: String, required: true },
  departurePoint: { type: String, required: true },
  arrivalPoint: { type: String, required: true },
  distance: { type: Number, required: true },
  sourceCoords: {
    lat: { type: Number },
    lng: { type: Number }
  },
  destinationCoords: {
    lat: { type: Number },
    lng: { type: Number }
  },
  stops: [{
    name: { type: String },
    lat: { type: Number },
    lng: { type: Number }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Route', routeSchema);
