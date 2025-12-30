const express = require('express');
const router = express.Router();
const { getSchedules, getScheduleById, createSchedule, deleteSchedule } = require('../controllers/scheduleController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getSchedules).post(protect, admin, createSchedule);
router.route('/:id').get(getScheduleById).delete(protect, admin, deleteSchedule);

module.exports = router;
