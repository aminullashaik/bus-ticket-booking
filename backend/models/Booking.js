const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  schedule: { type: mongoose.Schema.Types.ObjectId, ref: 'Schedule', required: true },
  seats: [String],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['booked', 'cancelled'], default: 'booked' },
  passengerName: { type: String, required: true },
  passengerPhone: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  transactionId: { type: String, required: true },
  deliveryMethod: { type: String, default: 'sms' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
