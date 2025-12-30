const Booking = require('../models/Booking');
const Schedule = require('../models/Schedule');
const { sendSMS, sendWhatsApp } = require('../utils/twilio');

// @desc    Create a booking
// @route   POST /api/bookings
// @access  Private
const simulatePaymentVerification = (method, amount) => {
    return new Promise((resolve) => {
        // Real-time Simulation Network Delay
        setTimeout(() => {
            resolve(true);
        }, 3000); // Increased to 3s for proficiency
    });
};

const createBooking = async (req, res) => {
  const { scheduleId, seats, paymentMethod, transactionId, passengerName, passengerPhone, deliveryMethod } = req.body;

  if (!passengerName || !passengerPhone) {
    return res.status(400).json({ message: 'Passenger name and phone number are required' });
  }

  if (!paymentMethod) {
    return res.status(400).json({ message: 'Payment method is required' });
  }

  try {
    const schedule = await Schedule.findById(scheduleId).populate('route');
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    // Check if seats are already booked
    const alreadyBooked = schedule.bookedSeats.filter(seat => seats.includes(seat));
    if (alreadyBooked.length > 0) {
      return res.status(400).json({ message: `Seats ${alreadyBooked.join(', ')} are already booked` });
    }

    const totalAmount = seats.length * schedule.price;

    // Simulate Payment Verification
    await simulatePaymentVerification(paymentMethod, totalAmount);

    // Realistic Payment Failure Simulation (5% chance)
    if (Math.random() < 0.05) {
      return res.status(402).json({ 
        message: 'Payment verification failed at bank gateway. Please try again or use a different method.',
        status: 'payment_failed'
      });
    }

    const booking = new Booking({
      user: req.user._id,
      schedule: scheduleId,
      seats,
      totalAmount,
      paymentId: transactionId || `PAY_${paymentMethod.toUpperCase()}_${Date.now()}`,
      paymentMethod,
      passengerName,
      passengerPhone,
      deliveryMethod: deliveryMethod || 'sms',
      status: 'booked'
    });

    const createdBooking = await booking.save();

    // Update booked seats in schedule
    schedule.bookedSeats = [...schedule.bookedSeats, ...seats];
    await schedule.save();

    // Dual-Channel Notification (Simulated or Real Twilio)
    const pnr = createdBooking._id.toString().slice(-6).toUpperCase();
    const message = `Ticket confirmed for ${schedule.route.source} to ${schedule.route.destination}. PNR: ${pnr}. Track live at: http://jbs-care.com/track/${pnr}`;
    
    // Trigger notifications (these will look for Twilio keys in .env)
    await sendSMS(passengerPhone, message);
    await sendWhatsApp(passengerPhone, message);

    res.status(201).json(createdBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private/Admin
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    const schedule = await Schedule.findById(booking.schedule);
    if (schedule) {
      // Release seats
      schedule.bookedSeats = schedule.bookedSeats.filter(seat => !booking.seats.includes(seat));
      await schedule.save();
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user bookings
// @route   GET /api/bookings/mybookings
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate('schedule')
        .populate({
            path: 'schedule',
            populate: { path: 'bus route' } // Deep populate
        })
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
        .populate('user', 'id name email')
        .populate({
            path: 'schedule',
            populate: { path: 'bus route' }
        });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookings,
  cancelBooking,
};
