const SupportTicket = require('../models/SupportTicket');

// @desc    Create a new support ticket
// @route   POST /api/support
// @access  Private
const createTicket = async (req, res) => {
  const { subject, message, priority } = req.body;

  try {
    const ticket = await SupportTicket.create({
      user: req.user._id,
      subject,
      message,
      priority: priority || 'low'
    });
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all tickets (Admin)
// @route   GET /api/support
// @access  Private/Admin
const getTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find({}).populate('user', 'name email');
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's tickets
// @route   GET /api/support/mytickets
// @access  Private
const getMyTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find({ user: req.user._id });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update ticket status/note (Admin)
// @route   PUT /api/support/:id
// @access  Private/Admin
const updateTicket = async (req, res) => {
    try {
        const ticket = await SupportTicket.findById(req.params.id);
        if (ticket) {
            ticket.status = req.body.status || ticket.status;
            ticket.adminNote = req.body.adminNote || ticket.adminNote;
            const updatedTicket = await ticket.save();
            res.json(updatedTicket);
        } else {
            res.status(404).json({ message: 'Ticket not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
  createTicket,
  getTickets,
  getMyTickets,
  updateTicket
};
