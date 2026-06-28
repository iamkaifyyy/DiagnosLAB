const Hospital = require('../models/Hospital');
const Lab = require('../models/Lab');

// GET /api/hospitals
exports.getHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find()
      .populate('doctors', 'name email')
      .populate('recommendedLabs', 'name trustScore location');
    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/hospitals/recommend
exports.recommendLab = async (req, res) => {
  try {
    const { hospitalId, labId } = req.body;
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) return res.status(404).json({ message: 'Hospital not found' });

    if (!hospital.recommendedLabs.includes(labId)) {
      hospital.recommendedLabs.push(labId);
      await hospital.save();

      // Increment lab recommendation count
      const lab = await Lab.findById(labId);
      if (lab) {
        lab.hospitalRecommendations += 1;
        await lab.save();
      }
    }
    res.json({ message: 'Lab recommended successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
