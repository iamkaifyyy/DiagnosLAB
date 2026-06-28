const Booking = require('../models/Booking');

// POST /api/bookings
exports.createBooking = async (req, res) => {
  try {
    const { labId, testId, timeSlot, date, homeCollection, address, totalAmount } = req.body;
    const booking = await Booking.create({
      userId: req.user._id,
      labId,
      testId,
      timeSlot,
      date,
      homeCollection,
      address,
      totalAmount,
      status: 'booked',
      trackingUpdates: [{ status: 'booked', timestamp: new Date(), note: 'Booking confirmed' }],
    });
    const populated = await Booking.findById(booking._id)
      .populate('labId', 'name location')
      .populate('testId', 'testName price reportTime');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/bookings/my
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('labId', 'name location phone')
      .populate('testId', 'testName price reportTime')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/bookings/lab
exports.getLabBookings = async (req, res) => {
  try {
    const Lab = require('../models/Lab');
    const lab = await Lab.findOne({ userId: req.user._id });
    if (!lab) return res.status(404).json({ message: 'Lab not found for this user' });

    const bookings = await Booking.find({ labId: lab._id })
      .populate('userId', 'name email phone')
      .populate('testId', 'testName price reportTime')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/bookings/:id/status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.status = status;
    booking.trackingUpdates.push({ status, timestamp: new Date(), note: note || '' });
    await booking.save();

    const populated = await Booking.findById(booking._id)
      .populate('labId', 'name location')
      .populate('testId', 'testName price reportTime')
      .populate('userId', 'name email');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/bookings/:id
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('labId', 'name location phone')
      .populate('testId', 'testName price reportTime')
      .populate('userId', 'name email');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
