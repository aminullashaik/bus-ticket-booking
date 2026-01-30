const Schedule = require('../models/Schedule');

const getSchedules = async (req, res) => {
  try {
    const { from, to, date } = req.query;
    let query = {};
    
    // If filtering by route
    if (from && to) {
        // Find routes that match source/dest (requires populating first or separate query)
        // Since we store route ObjectId in Schedule, we need to populate 'route' 
        // to filter by route fields, OR find matching Route IDs first.
        // Easiest is to populate and filter in memory if dataset small, 
        // or finding Route IDs first. Let's find IDs first.
        const Route = require('../models/Route');
        const routes = await Route.find({ 
            source: { $regex: new RegExp(from, 'i') }, 
            destination: { $regex: new RegExp(to, 'i') } 
        });
        const routeIds = routes.map(r => r._id);
        query.route = { $in: routeIds };
    }

    if (date) {
        const queryDate = new Date(date);
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        
        query.departureTime = {
            $gte: queryDate,
            $lt: nextDay
        };
    }

    const schedules = await Schedule.find(query)
        .populate('bus')
        .populate('route');
        
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getScheduleById = async (req, res) => {
    try {
        const schedule = await Schedule.findById(req.params.id)
            .populate('bus')
            .populate('route');
            
        if(schedule) {
            res.json(schedule);
        } else {
            res.status(404).json({ message: 'Schedule not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.create(req.body);
    res.status(201).json(schedule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteSchedule = async (req, res) => {
    try {
        const schedule = await Schedule.findById(req.params.id);
        if(schedule) {
            await schedule.deleteOne();
            res.json({ message: 'Schedule removed' });
        } else {
            res.status(404).json({ message: 'Schedule not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getSchedules, getScheduleById, createSchedule, deleteSchedule };
