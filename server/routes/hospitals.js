const express = require('express');
const router = express.Router();
const { getHospitals, recommendLab } = require('../controllers/hospitalController');
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');

router.get('/', getHospitals);
router.post('/recommend', protect, roleCheck('hospital'), recommendLab);

module.exports = router;
