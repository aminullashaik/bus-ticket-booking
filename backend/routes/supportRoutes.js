const express = require('express');
const router = express.Router();
const { getTickets, updateTicket } = require('../controllers/supportController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(protect, admin, getTickets);
router.route('/:id').put(protect, admin, updateTicket);

module.exports = router;
