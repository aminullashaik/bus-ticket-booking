const express = require('express');
const router = express.Router();
const { createBooking, getBookings, getMyBookings, cancelBooking } = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, createBooking).get(protect, admin, getBookings);
router.route('/mybookings').get(protect, getMyBookings);
router.route('/:id/cancel').put(protect, admin, cancelBooking); // Or user can cancel? Frontend implies admin, let's allow admin for now.

module.exports = router;
