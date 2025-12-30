const Bus = require('../models/Bus');

// @desc    Get all buses
// @route   GET /api/buses
// @access  Public
const getBuses = async (req, res) => {
  try {
    const buses = await Bus.find({});
    res.json(buses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get bus by ID
// @route   GET /api/buses/:id
// @access  Public
const getBusById = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (bus) {
      res.json(bus);
    } else {
      res.status(404).json({ message: 'Bus not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a bus
// @route   POST /api/buses
// @access  Private/Admin
const createBus = async (req, res) => {
    const { busNumber, operatorName, type, totalSeats, layout } = req.body;

  try {
    const busExists = await Bus.findOne({ busNumber });
    if (busExists) {
        return res.status(400).json({ message: 'Bus already exists' });
    }

    const bus = new Bus({
      busNumber,
      operatorName,
      type,
      totalSeats,
      layout
    });

    const createdBus = await bus.save();
    res.status(201).json(createdBus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a bus
// @route   PUT /api/buses/:id
// @access  Private/Admin
const updateBus = async (req, res) => {
  const { busNumber, operatorName, type, totalSeats, layout } = req.body;

  try {
    const bus = await Bus.findById(req.params.id);

    if (bus) {
      bus.busNumber = busNumber || bus.busNumber;
      bus.operatorName = operatorName || bus.operatorName;
      bus.type = type || bus.type;
      bus.totalSeats = totalSeats || bus.totalSeats;
      bus.layout = layout || bus.layout;

      const updatedBus = await bus.save();
      res.json(updatedBus);
    } else {
      res.status(404).json({ message: 'Bus not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a bus
// @route   DELETE /api/buses/:id
// @access  Private/Admin
const deleteBus = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);

    if (bus) {
      await bus.deleteOne();
      res.json({ message: 'Bus removed' });
    } else {
      res.status(404).json({ message: 'Bus not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBuses,
  getBusById,
  createBus,
  updateBus,
  deleteBus,
};
