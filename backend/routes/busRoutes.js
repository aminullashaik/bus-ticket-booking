const express = require('express');
const router = express.Router();
const { getBuses, createBus, deleteBus } = require('../controllers/busController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getBuses).post(protect, admin, createBus);
router.route('/:id').delete(protect, admin, deleteBus);

module.exports = router;
