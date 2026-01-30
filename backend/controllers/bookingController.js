const Booking = require('../models/Booking');
const Schedule = require('../models/Schedule');

const createBooking = async (req, res) => {
  const { scheduleId, seats, paymentMethod, transactionId, passengerName, passengerPhone, deliveryMethod } = req.body;

  try {
    const schedule = await Schedule.findById(scheduleId);
    if (!schedule) {
        return res.status(404).json({ message: 'Schedule not found' });
    }

    // check if seats are already booked
    const unavailableSeats = seats.filter(seat => schedule.bookedSeats.includes(seat));
    if (unavailableSeats.length > 0) {
        return res.status(400).json({ message: `Seats ${unavailableSeats.join(', ')} are already booked` });
    }

    // Calculate total amount (optional check, though frontend sends it mainly)
    const totalAmount = seats.length * schedule.price;

    const booking = await Booking.create({
      user: req.user._id,
      schedule: scheduleId,
      seats,
      totalAmount,
      passengerName,
      passengerPhone,
      paymentMethod,
      transactionId,
      deliveryMethod
    });

    // Update schedule bookedSeats
    schedule.bookedSeats.push(...seats);
    await schedule.save();

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({})
            .populate('user', 'name email')
            .populate({
                path: 'schedule',
                populate: { path: 'bus route' }
            });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate({
                path: 'schedule',
                populate: { path: 'bus route' }
            });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if(!booking) return res.status(404).json({ message: 'Booking not found' });

        // Update status
        booking.status = 'cancelled';
        await booking.save();

        // Release seats
        const schedule = await Schedule.findById(booking.schedule);
        if(schedule) {
            schedule.bookedSeats = schedule.bookedSeats.filter(seat => !booking.seats.includes(seat));
            await schedule.save();
        }

        res.json({ message: 'Booking cancelled' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createBooking, getBookings, getMyBookings, cancelBooking };
