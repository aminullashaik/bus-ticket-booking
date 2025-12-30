const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  schedule: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Schedule',
    required: true,
  },
  seats: {
    type: [String],
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'booked', 'cancelled'],
    default: 'pending',
  },
  passengerName: {
      type: String,
      required: true
  },
  passengerPhone: {
      type: String,
      required: true
  },
  deliveryMethod: {
      type: String,
      enum: ['sms', 'whatsapp'],
      default: 'sms'
  },
  paymentId: {
      type: String // Mock payment ID
  },
  paymentMethod: {
      type: String,
      enum: ['card', 'upi', 'netbanking'],
      required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
