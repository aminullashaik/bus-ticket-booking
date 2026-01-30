const SupportTicket = require('../models/SupportTicket');

const getTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find({}).populate('user', 'name email');
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTicket = async (req, res) => {
    try {
        const ticket = await SupportTicket.findById(req.params.id);
        if (ticket) {
            ticket.status = req.body.status || ticket.status;
            await ticket.save();
            res.json(ticket);
        } else {
            res.status(404).json({ message: 'Ticket not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getTickets, updateTicket };
