const Schedule = require('../models/Schedule');

// @desc    Get all schedules (optionally filter by route)
// @route   GET /api/schedules
// @access  Public
const getSchedules = async (req, res) => {
  try {
    const { from, to, date } = req.query;
    // Basic filtering logic
    let query = {};
    if (date) {
        // Match date part only
        const startOfDay = new Date(date);
        const endOfDay = new Date(date);
        endOfDay.setDate(endOfDay.getDate() + 1);
        query.departureTime = { $gte: startOfDay, $lt: endOfDay };
    }
    
    // Search by route source/dest requires joining Route, which is complex in simple find.
    // For simplicity, we fetch schedules and populate route, then filter in memory or client side,
    // Or we find Route IDs first.
    
    // Better: If from/to provided, find matching Routes first
    if (from && to) {
        // This logic requires circular dependency or import logic. 
        // For now, simpler implementation:
    }

    const schedules = await Schedule.find(query).populate('bus').populate('route');
    
    // Filter by route source/dest if params exist
    let result = schedules;
    if (from && to) {
        result = schedules.filter(s => 
            s.route.source.toLowerCase() === from.toLowerCase() && 
            s.route.destination.toLowerCase() === to.toLowerCase()
        );
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get schedule by ID
// @route   GET /api/schedules/:id
// @access  Public
const getScheduleById = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id).populate('bus').populate('route');
    if (schedule) {
      res.json(schedule);
    } else {
      res.status(404).json({ message: 'Schedule not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a schedule
// @route   POST /api/schedules
// @access  Private/Admin
const createSchedule = async (req, res) => {
  const { busId, routeId, departureTime, arrivalTime, price } = req.body;

  try {
    const schedule = new Schedule({
      bus: busId,
      route: routeId,
      departureTime,
      arrivalTime,
      price,
    });

    const createdSchedule = await schedule.save();
    res.status(201).json(createdSchedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a schedule
// @route   DELETE /api/schedules/:id
// @access  Private/Admin
const deleteSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);

    if (schedule) {
      // Check if there are active bookings for this schedule?
      // For now, simplicity:
      await schedule.deleteOne();
      res.json({ message: 'Schedule removed' });
    } else {
      res.status(404).json({ message: 'Schedule not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSchedules,
  getScheduleById,
  createSchedule,
  deleteSchedule
};
