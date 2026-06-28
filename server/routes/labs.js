const express = require('express');
const router = express.Router();
const { getLabs, getLabById, updateLab, recalculateTrust } = require('../controllers/labController');
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');

router.get('/', getLabs);
router.get('/:id', getLabById);
router.put('/:id', protect, roleCheck('lab'), updateLab);
router.post('/:id/recalculate-trust', protect, recalculateTrust);

module.exports = router;
