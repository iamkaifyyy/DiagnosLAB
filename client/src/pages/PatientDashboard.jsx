import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineClipboardList, HiOutlineClock, HiOutlineCheckCircle, HiOutlineCurrencyRupee } from 'react-icons/hi';
import { getPatientDashboard } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatPrice, formatDate, getStatusLabel, getStatusColor } from '../utils/helpers';
import ReportTracker from '../components/tracking/ReportTracker';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    getPatientDashboard().then(res => { setData(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
    </div>
  );

  const stats = data?.stats || {};

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-surface-900">
            Welcome, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-surface-500 mt-1">Track your bookings and reports</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: <HiOutlineClipboardList className="text-2xl" />, label: 'Total Bookings', value: stats.totalBookings, color: 'from-primary-500 to-teal-500' },
            { icon: <HiOutlineClock className="text-2xl" />, label: 'Active', value: stats.activeBookings, color: 'from-medical-500 to-blue-500' },
            { icon: <HiOutlineCheckCircle className="text-2xl" />, label: 'Completed', value: stats.completedBookings, color: 'from-emerald-500 to-green-500' },
            { icon: <HiOutlineCurrencyRupee className="text-2xl" />, label: 'Total Spent', value: formatPrice(stats.totalSpent || 0), color: 'from-accent-500 to-orange-500' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-surface-200 p-5 card-hover">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white mb-3`}>
                {s.icon}
              </div>
              <div className="font-display font-bold text-2xl text-surface-900">{s.value}</div>
              <div className="text-xs text-surface-400 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Bookings List */}
          <div className="lg:col-span-2">
            <h2 className="font-display font-bold text-xl text-surface-900 mb-4">Your Bookings</h2>
            {data?.bookings?.length === 0 ? (
              <div className="bg-white rounded-2xl border border-surface-200 p-8 text-center">
                <div className="text-5xl mb-3">📋</div>
                <p className="text-surface-500">No bookings yet</p>
                <Link to="/search" className="btn-primary mt-4 inline-block text-sm">Find Labs</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {data?.bookings?.map(booking => (
                  <button
                    key={booking._id}
                    onClick={() => setSelectedBooking(selectedBooking?._id === booking._id ? null : booking)}
                    className={`w-full text-left bg-white rounded-xl border-2 p-5 transition-all hover:shadow-md ${
                      selectedBooking?._id === booking._id ? 'border-primary-500' : 'border-surface-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-surface-900">{booking.testId?.testName}</h4>
                        <p className="text-sm text-surface-500 mt-0.5">{booking.labId?.name}</p>
                        <p className="text-xs text-surface-400 mt-1">{formatDate(booking.date)} · {booking.timeSlot}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                          {getStatusLabel(booking.status)}
                        </span>
                        <p className="text-sm font-semibold text-surface-700 mt-1">{formatPrice(booking.totalAmount)}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Report Tracker */}
          <div>
            {selectedBooking ? (
              <ReportTracker booking={selectedBooking} />
            ) : (
              <div className="bg-white rounded-2xl border border-surface-200 p-6 text-center">
                <div className="text-4xl mb-3">📊</div>
                <p className="text-surface-500 text-sm">Select a booking to track its report</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
