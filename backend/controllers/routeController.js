const Route = require('../models/Route');

const getRoutes = async (req, res) => {
  try {
    const routes = await Route.find({});
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createRoute = async (req, res) => {
  try {
    const route = await Route.create(req.body);
    res.status(201).json(route);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteRoute = async (req, res) => {
    try {
        const route = await Route.findById(req.params.id);
        if(route) {
            await route.deleteOne();
            res.json({ message: 'Route removed' });
        } else {
            res.status(404).json({ message: 'Route not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getRoutes, createRoute, deleteRoute };
