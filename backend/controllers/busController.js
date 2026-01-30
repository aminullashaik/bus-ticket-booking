const Bus = require('../models/Bus');

const getBuses = async (req, res) => {
  try {
    const buses = await Bus.find({});
    res.json(buses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createBus = async (req, res) => {
  try {
    const bus = await Bus.create(req.body);
    res.status(201).json(bus);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteBus = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if(bus) {
        await bus.deleteOne();
        res.json({ message: 'Bus removed' });
    } else {
        res.status(404).json({ message: 'Bus not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getBuses, createBus, deleteBus };
