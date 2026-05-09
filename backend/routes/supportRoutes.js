const express = require('express');
const router = express.Router();
const { getTickets, updateTicket, createTicket } = require('../controllers/supportController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(protect, admin, getTickets).post(protect, createTicket);
router.route('/:id').put(protect, admin, updateTicket);

module.exports = router;
