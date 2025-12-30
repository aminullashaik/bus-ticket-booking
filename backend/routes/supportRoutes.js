const express = require('express');
const router = express.Router();
const { createTicket, getTickets, getMyTickets, updateTicket } = require('../controllers/supportController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createTicket)
    .get(protect, admin, getTickets);

router.route('/mytickets')
    .get(protect, getMyTickets);

router.route('/:id')
    .put(protect, admin, updateTicket);

module.exports = router;
