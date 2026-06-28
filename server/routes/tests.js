const express = require('express');
const router = express.Router();
const { getTests, compareTests, createTest, getPopularTests } = require('../controllers/testController');
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');

router.get('/', getTests);
router.get('/compare', compareTests);
router.get('/popular', getPopularTests);
router.post('/', protect, roleCheck('lab'), createTest);

module.exports = router;
