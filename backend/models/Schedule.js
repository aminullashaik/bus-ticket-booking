const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  bus: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
  route: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
  departureTime: { type: Date, required: true },
  arrivalTime: { type: Date, required: true },
  price: { type: Number, required: true },
  bookedSeats: [String], // Store seat numbers like "1A"
  status: { type: String, enum: ['Scheduled', 'Ongoing', 'Completed'], default: 'Scheduled' },
  otp: { type: String, default: () => Math.floor(1000 + Math.random() * 9000).toString() }
}, { timestamps: true });

module.exports = mongoose.model('Schedule', scheduleSchema);
