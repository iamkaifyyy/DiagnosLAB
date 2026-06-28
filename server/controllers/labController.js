const Lab = require('../models/Lab');
const Test = require('../models/Test');
const Review = require('../models/Review');
const { calculateTrustScore, getTrustTier } = require('../utils/trustScore');

// GET /api/labs
exports.getLabs = async (req, res) => {
  try {
    const { city, search, sortBy, homeCollection, minTrust, maxPrice } = req.query;
    let filter = {};

    if (city) filter['location.city'] = new RegExp(city, 'i');
    if (search) filter.name = new RegExp(search, 'i');
    if (homeCollection === 'true') filter.homeCollection = true;
    if (minTrust) filter.trustScore = { $gte: Number(minTrust) };

    let sort = {};
    if (sortBy === 'trust') sort = { trustScore: -1 };
    else if (sortBy === 'rating') sort = { ratings: -1 };
    else if (sortBy === 'name') sort = { name: 1 };
    else sort = { trustScore: -1 };

    const labs = await Lab.find(filter).sort(sort);

    // Attach test count and price range
    const labsWithMeta = await Promise.all(labs.map(async (lab) => {
      const tests = await Test.find({ labId: lab._id });
      const prices = tests.map(t => t.price);
      return {
        ...lab.toObject(),
        trustTier: lab.getTrustTier(),
        testCount: tests.length,
        priceRange: prices.length ? { min: Math.min(...prices), max: Math.max(...prices) } : null,
      };
    }));

    res.json(labsWithMeta);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/labs/:id
exports.getLabById = async (req, res) => {
  try {
    const lab = await Lab.findById(req.params.id);
    if (!lab) return res.status(404).json({ message: 'Lab not found' });

    const tests = await Test.find({ labId: lab._id });
    const reviews = await Review.find({ labId: lab._id }).populate('userId', 'name avatar').sort({ createdAt: -1 });

    res.json({
      ...lab.toObject(),
      trustTier: lab.getTrustTier(),
      tests,
      reviews,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/labs/:id
exports.updateLab = async (req, res) => {
  try {
    const lab = await Lab.findById(req.params.id);
    if (!lab) return res.status(404).json({ message: 'Lab not found' });

    Object.assign(lab, req.body);
    await lab.save();
    res.json(lab);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/labs/:id/recalculate-trust
exports.recalculateTrust = async (req, res) => {
  try {
    const lab = await Lab.findById(req.params.id);
    if (!lab) return res.status(404).json({ message: 'Lab not found' });

    const reviews = await Review.find({ labId: lab._id });
    const avgRating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
    const avgAccuracy = reviews.length ? reviews.reduce((s, r) => s + r.accuracyScore, 0) / reviews.length : 0;

    const drNorm = Math.min(lab.doctorRecommendations / 10, 5);
    const hrNorm = Math.min(lab.hospitalRecommendations / 5, 5);

    const trustScore = calculateTrustScore({
      rating: avgRating,
      accuracy: avgAccuracy,
      doctorRec: drNorm,
      hospitalRec: hrNorm,
      consistency: lab.reportConsistency,
    });

    lab.trustScore = trustScore;
    lab.ratings = Math.round(avgRating * 10) / 10;
    lab.totalReviews = reviews.length;
    await lab.save();

    res.json({ trustScore, tier: getTrustTier(trustScore) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
