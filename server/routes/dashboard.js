const express = require('express');
const router = express.Router();
const { patientDashboard, labDashboard } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

router.get('/patient', protect, patientDashboard);
router.get('/lab', protect, labDashboard);

module.exports = router;
