const Booking = require('../models/Booking');
const Lab = require('../models/Lab');
const Review = require('../models/Review');

// GET /api/dashboard/patient
exports.patientDashboard = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('labId', 'name location trustScore')
      .populate('testId', 'testName price reportTime')
      .sort({ createdAt: -1 });

    const stats = {
      totalBookings: bookings.length,
      activeBookings: bookings.filter(b => !['delivered', 'report_ready'].includes(b.status)).length,
      completedBookings: bookings.filter(b => b.status === 'delivered').length,
      totalSpent: bookings.reduce((s, b) => s + (b.totalAmount || 0), 0),
    };

    res.json({ stats, bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/dashboard/lab
exports.labDashboard = async (req, res) => {
  try {
    const lab = await Lab.findOne({ userId: req.user._id });
    if (!lab) return res.status(404).json({ message: 'Lab not found' });

    const bookings = await Booking.find({ labId: lab._id })
      .populate('userId', 'name email phone')
      .populate('testId', 'testName price')
      .sort({ createdAt: -1 });

    const reviews = await Review.find({ labId: lab._id });

    const stats = {
      totalBookings: bookings.length,
      pendingBookings: bookings.filter(b => b.status === 'booked').length,
      inProgressBookings: bookings.filter(b => ['sample_collected', 'testing'].includes(b.status)).length,
      completedBookings: bookings.filter(b => ['report_ready', 'delivered'].includes(b.status)).length,
      totalRevenue: bookings.reduce((s, b) => s + (b.totalAmount || 0), 0),
      trustScore: lab.trustScore,
      avgRating: lab.ratings,
      totalReviews: reviews.length,
    };

    res.json({ stats, bookings, lab });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
