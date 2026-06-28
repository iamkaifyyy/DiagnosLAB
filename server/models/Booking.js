const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  labId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lab', required: true },
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
  status: {
    type: String,
    enum: ['booked', 'sample_collected', 'testing', 'report_ready', 'delivered'],
    default: 'booked',
  },
  timeSlot: { type: String, required: true },
  date: { type: Date, required: true },
  homeCollection: { type: Boolean, default: false },
  address: { type: String, default: '' },
  trackingUpdates: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    note: { type: String, default: '' },
  }],
  totalAmount: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
