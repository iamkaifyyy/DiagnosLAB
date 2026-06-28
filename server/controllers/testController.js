const Test = require('../models/Test');
const Lab = require('../models/Lab');

// GET /api/tests
exports.getTests = async (req, res) => {
  try {
    const { search, category, popular } = req.query;
    let filter = {};
    if (search) filter.testName = new RegExp(search, 'i');
    if (category) filter.category = new RegExp(category, 'i');
    if (popular === 'true') filter.popular = true;

    const tests = await Test.find(filter).populate('labId', 'name trustScore location ratings');
    res.json(tests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/tests/compare?test=CBC&city=Delhi
exports.compareTests = async (req, res) => {
  try {
    const { test, city } = req.query;
    if (!test) return res.status(400).json({ message: 'Test name is required' });

    let labFilter = {};
    if (city) labFilter['location.city'] = new RegExp(city, 'i');

    const labs = await Lab.find(labFilter).select('_id');
    const labIds = labs.map(l => l._id);

    const tests = await Test.find({
      testName: new RegExp(test, 'i'),
      labId: { $in: labIds },
    }).populate('labId', 'name trustScore location ratings homeCollection');

    // Sort by price and tag
    const sorted = tests.sort((a, b) => a.price - b.price);
    const tagged = sorted.map((t, i) => ({
      ...t.toObject(),
      tag: i === 0 ? 'Cheapest' : (t.labId?.trustScore >= 80 ? 'Best Value' : (t.price > sorted[0].price * 1.5 ? 'Premium' : null)),
    }));

    res.json(tagged);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/tests
exports.createTest = async (req, res) => {
  try {
    const test = await Test.create({ ...req.body });
    res.status(201).json(test);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/tests/popular
exports.getPopularTests = async (req, res) => {
  try {
    const tests = await Test.find({ popular: true }).populate('labId', 'name trustScore');
    // Group by test name
    const grouped = {};
    tests.forEach(t => {
      if (!grouped[t.testName]) {
        grouped[t.testName] = { testName: t.testName, category: t.category, labs: [] };
      }
      grouped[t.testName].labs.push({
        labName: t.labId?.name,
        price: t.price,
        reportTime: t.reportTime,
        trustScore: t.labId?.trustScore,
      });
    });
    res.json(Object.values(grouped));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
