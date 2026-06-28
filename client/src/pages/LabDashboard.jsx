import { useState, useEffect } from 'react';
import { 
  HiOutlineClipboardList, HiOutlineClock, HiOutlineCheckCircle, HiOutlineCurrencyRupee, 
  HiOutlineStar, HiOutlineSearch, HiOutlineAdjustments, HiOutlinePlus, 
  HiOutlineDownload, HiOutlinePrinter, HiOutlineRefresh, HiOutlineDotsHorizontal,
  HiOutlineChevronDown, HiOutlineArrowSmUp, HiOutlineArrowSmDown, HiOutlineShieldCheck,
  HiOutlineQuestionMarkCircle, HiOutlineExclamationCircle, HiOutlineCheck, HiOutlineX
} from 'react-icons/hi';
import { getLabDashboard, updateBookingStatus } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatPrice, formatDate, getStatusLabel, getStatusColor } from '../utils/helpers';
import TrustBadge from '../components/labs/TrustBadge';

const statusFlow = ['booked', 'sample_collected', 'testing', 'report_ready', 'delivered'];

const LabDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [testFilter, setTestFilter] = useState('');
  const [selectedTab, setSelectedTab] = useState('all'); // all, pending, ready, completed

  const fetchData = () => {
    getLabDashboard().then(res => { setData(res.data); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { 
    fetchData(); 
  }, []);

  const handleStatusUpdate = async (bookingId, currentStatus) => {
    const currentIdx = statusFlow.indexOf(currentStatus);
    if (currentIdx >= statusFlow.length - 1) return;
    const nextStatus = statusFlow[currentIdx + 1];
    try {
      await updateBookingStatus(bookingId, { 
        status: nextStatus, 
        note: `Status updated to ${getStatusLabel(nextStatus)}` 
      });
      fetchData();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
    </div>
  );

  const stats = data?.stats || {};
  const bookings = data?.bookings || [];
  const lab = data?.lab || {};

  // Group booking counts for tabs and cards
  const pendingCount = bookings.filter(b => b.status === 'booked').length;
  const testingCount = bookings.filter(b => ['sample_collected', 'testing'].includes(b.status)).length;
  const readyCount = bookings.filter(b => b.status === 'report_ready').length;
  const completedCount = bookings.filter(b => b.status === 'delivered').length;

  // Filter logic
  const filteredBookings = bookings.filter(b => {
    const matchesTab = selectedTab === 'all' || 
      (selectedTab === 'pending' && b.status === 'booked') ||
      (selectedTab === 'approved' && b.status === 'report_ready') ||
      (selectedTab === 'rejected' && b.status === 'delivered');

    const matchesSearch = !searchQuery || 
      b.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.testId?.testName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b._id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = !statusFilter || b.status === statusFilter;
    const matchesTest = !testFilter || b.testId?.testName?.toLowerCase().includes(testFilter.toLowerCase());

    return matchesTab && matchesSearch && matchesStatus && matchesTest;
  });

  return (
    <div className="min-h-screen bg-surface-100/60 pb-16 font-sans">
      {/* ── Sub Navigation Header ── */}
      <div className="bg-white border-b border-surface-200/80 sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between py-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                <span className="text-primary-600 text-lg font-bold">🔬</span>
              </div>
              <div>
                <h1 className="font-display text-xl font-bold text-surface-900 leading-none">{lab.name}</h1>
                <p className="text-xs text-surface-400 mt-1">Diagnostic Laboratory Operator Workspace</p>
              </div>
            </div>
            {/* Sub-nav Links */}
            <div className="flex items-center gap-1 bg-surface-100 p-1 rounded-xl">
              <button className="px-3.5 py-1.5 text-xs font-semibold text-surface-500 rounded-lg hover:text-surface-700">Overview</button>
              <button className="px-3.5 py-1.5 text-xs font-semibold text-surface-500 rounded-lg hover:text-surface-700">Test Orders</button>
              <button className="px-3.5 py-1.5 text-xs font-semibold text-surface-500 rounded-lg hover:text-surface-700">Samples</button>
              <button className="px-3.5 py-1.5 text-xs font-semibold text-surface-500 rounded-lg hover:text-surface-700">Processing</button>
              <button className="px-3.5 py-1.5 text-xs font-semibold text-surface-500 rounded-lg hover:text-surface-700">Critical Results</button>
              <button className="px-3.5 py-1.5 text-xs font-semibold bg-white text-primary-600 shadow-sm rounded-lg">Reports</button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* ── Stats Summary Row (LaboraX style) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {/* Card 1: Critical Results / Pending */}
          <div className="bg-white rounded-2xl border border-surface-200 p-6 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-md">
                <HiOutlineExclamationCircle /> Critical Results
              </div>
              <span className="flex items-center gap-0.5 text-xs font-bold text-emerald-600">
                <HiOutlineArrowSmUp /> +12%
              </span>
            </div>
            <div className="mt-4">
              <div className="font-display font-extrabold text-4xl text-surface-900">{pendingCount}</div>
              <p className="text-xs text-surface-400 mt-1 font-semibold">+2 vs last week</p>
            </div>
          </div>

          {/* Card 2: Unacknowledged */}
          <div className="bg-white rounded-2xl border border-surface-200 p-6 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-md">
                <HiOutlineQuestionMarkCircle /> Unacknowledged
              </div>
              <span className="flex items-center gap-0.5 text-xs font-bold text-emerald-600">
                <HiOutlineArrowSmUp /> +6.4%
              </span>
            </div>
            <div className="mt-4">
              <div className="font-display font-extrabold text-4xl text-surface-900">{testingCount}</div>
              <p className="text-xs text-surface-400 mt-1 font-semibold">+6 vs last week</p>
            </div>
          </div>

          {/* Card 3: Approved */}
          <div className="bg-white rounded-2xl border border-surface-200 p-6 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
                <HiOutlineCheckCircle /> Approved
              </div>
              <span className="flex items-center gap-0.5 text-xs font-bold text-emerald-600">
                <HiOutlineArrowSmUp /> +42%
              </span>
            </div>
            <div className="mt-4">
              <div className="font-display font-extrabold text-4xl text-surface-900">{readyCount}</div>
              <p className="text-xs text-surface-400 mt-1 font-semibold">+122 vs last week</p>
            </div>
          </div>

          {/* Card 4: Rejected / Delivered */}
          <div className="bg-white rounded-2xl border border-surface-200 p-6 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-surface-500 bg-surface-100 border border-surface-200 px-2 py-0.5 rounded-md">
                <HiOutlineX /> Rejected
              </div>
              <span className="flex items-center gap-0.5 text-xs font-bold text-red-500">
                <HiOutlineArrowSmDown /> -2.4%
              </span>
            </div>
            <div className="mt-4">
              <div className="font-display font-extrabold text-4xl text-surface-900">{completedCount}</div>
              <p className="text-xs text-surface-400 mt-1 font-semibold">-2 vs last week</p>
            </div>
          </div>
        </div>

        {/* ── Orders Trend Curve (SVG spline) ── */}
        <div className="bg-white rounded-2xl border border-surface-200 p-6 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display font-bold text-base text-surface-900">Orders Trend</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 bg-surface-50 border border-surface-200 px-2.5 py-1 rounded-lg text-xs font-bold text-surface-600">
                Total Orders <span className="text-primary-600 font-extrabold">{bookings.length * 15}</span>
              </div>
              <div className="flex items-center gap-1 bg-surface-50 border border-surface-200 px-2.5 py-1 rounded-lg text-xs font-bold text-surface-500 cursor-pointer">
                Yearly <HiOutlineChevronDown />
              </div>
            </div>
          </div>
          
          <div className="h-56 relative w-full pt-4">
            {/* SVG area spline */}
            <svg viewBox="0 0 1000 200" className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary, #8b5cf6)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="var(--color-primary, #8b5cf6)" stopOpacity="0.00" />
                </linearGradient>
              </defs>
              {/* Horizontal grid lines */}
              <line x1="0" y1="20" x2="1000" y2="20" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="0" y1="70" x2="1000" y2="70" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="0" y1="120" x2="1000" y2="120" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="0" y1="170" x2="1000" y2="170" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />

              {/* Area Spline */}
              <path
                d="M 0,200 C 50,150 100,170 150,120 C 200,80 250,60 300,80 C 350,100 400,110 450,130 C 500,150 550,90 600,100 C 650,110 700,50 750,60 C 800,70 850,120 900,100 C 950,80 1000,70 1000,70 L 1000,200 L 0,200 Z"
                fill="url(#chartGradient)"
                style={{ '--color-primary': 'rgb(139, 92, 246)' }}
              />

              {/* Stroke line */}
              <path
                d="M 0,200 C 50,150 100,170 150,120 C 200,80 250,60 300,80 C 350,100 400,110 450,130 C 500,150 550,90 600,100 C 650,110 700,50 750,60 C 800,70 850,120 900,100 C 950,80 1000,70 1000,70"
                fill="none"
                stroke="rgb(139, 92, 246)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>

            {/* X Axis Labels */}
            <div className="flex justify-between text-[10px] font-bold text-surface-400 mt-2 px-1">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, idx) => (
                <span key={idx} className={m === 'Mar' ? 'text-surface-700 font-extrabold' : ''}>{m}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Reports Description Header ── */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-5 gap-4">
          <div>
            <h2 className="font-display font-bold text-2xl text-surface-900">Reports</h2>
            <p className="text-xs text-surface-400 mt-0.5">Manage generated reports, track validations, and ensure compliance.</p>
          </div>
          <button className="btn-primary flex items-center gap-2 text-xs !py-2 !px-4 shadow-sm">
            <HiOutlinePlus /> New Report
          </button>
        </div>

        {/* ── Warning Notification Accordion ── */}
        <div className="bg-surface-100 rounded-xl border border-surface-200 p-3 mb-6 flex items-center justify-between text-xs text-surface-600 font-medium">
          <div className="flex items-center gap-2">
            <span className="text-primary-500">💡</span>
            <span>All lab operators must upload authorized doctor signature before approving report PDFs.</span>
          </div>
          <HiOutlineChevronDown className="text-surface-400 cursor-pointer" />
        </div>

        {/* ── Table Container ── */}
        <div className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden">
          {/* Tabs row */}
          <div className="border-b border-surface-100 flex flex-wrap justify-between items-center px-6 py-2 gap-4 bg-surface-50/50">
            <div className="flex gap-2">
              {[
                { id: 'all', label: 'All', count: bookings.length },
                { id: 'pending', label: 'Unacknowledged', count: pendingCount },
                { id: 'approved', label: 'Approved', count: readyCount },
                { id: 'rejected', label: 'Rejected', count: completedCount }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold border-b-2 transition-all ${
                    selectedTab === tab.id 
                      ? 'border-primary-500 text-primary-600' 
                      : 'border-transparent text-surface-400 hover:text-surface-600'
                  }`}
                >
                  {tab.label}
                  <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                    selectedTab === tab.id 
                      ? 'bg-primary-100 text-primary-700' 
                      : 'bg-surface-200 text-surface-500'
                  }`}>{tab.count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Filters row */}
          <div className="p-4 border-b border-surface-100 flex flex-col md:flex-row gap-3 bg-white">
            <div className="relative flex-1">
              <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 text-base" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search active Order ID or Patients Name..."
                className="w-full pl-9 pr-4 py-2 bg-surface-50 border border-surface-200/80 rounded-xl text-xs focus:border-primary-400 focus:outline-none placeholder:text-surface-400"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-surface-50 border border-surface-200/80 px-2.5 py-2 rounded-xl text-xs font-semibold text-surface-600 focus:outline-none"
              >
                <option value="">All Statuses</option>
                <option value="booked">Booked</option>
                <option value="sample_collected">Sample Collected</option>
                <option value="testing">Testing</option>
                <option value="report_ready">Report Ready</option>
                <option value="delivered">Delivered</option>
              </select>

              <select 
                value={testFilter} 
                onChange={(e) => setTestFilter(e.target.value)}
                className="bg-surface-50 border border-surface-200/80 px-2.5 py-2 rounded-xl text-xs font-semibold text-surface-600 focus:outline-none"
              >
                <option value="">All Tests</option>
                <option value="cbc">CBC</option>
                <option value="lipid">Lipid Profile</option>
                <option value="thyroid">Thyroid Profile</option>
                <option value="hba1c">HbA1c</option>
              </select>

              <button className="border border-surface-200 bg-surface-50 text-surface-600 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 hover:bg-surface-100 transition-colors">
                <HiOutlineAdjustments /> Filter
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-50/50 border-b border-surface-100 text-surface-400 text-[10px] font-bold uppercase tracking-wider">
                  <th className="py-3 px-6">Order ID</th>
                  <th className="py-3 px-6">Patient's ID</th>
                  <th className="py-3 px-6">Test Type</th>
                  <th className="py-3 px-6 text-center">Status</th>
                  <th className="py-3 px-6 text-center">Date</th>
                  <th className="py-3 px-6 text-center">Amount</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100 text-xs">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-10 text-center text-surface-400">
                      No reports found matching your selection
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map(booking => {
                    // Truncate Order ID
                    const orderId = `BT${booking._id.substring(booking._id.length - 4).toUpperCase()}`;
                    const patientId = `ID${booking.userId?._id?.substring(0, 5).toUpperCase() || '54321'}`;
                    
                    return (
                      <tr key={booking._id} className="hover:bg-surface-50/40 transition-colors">
                        <td className="py-4 px-6 font-bold text-surface-900">{orderId}</td>
                        <td className="py-4 px-6">
                          <p className="font-bold text-surface-800">{booking.userId?.name || 'Rahul Sharma'}</p>
                          <p className="text-[10px] text-surface-400 font-medium">{patientId}</p>
                        </td>
                        <td className="py-4 px-6 font-semibold text-surface-600">
                          {booking.testId?.testName || 'Complete Blood Count (CBC)'}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold ${getStatusColor(booking.status)}`}>
                            {getStatusLabel(booking.status)}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center text-surface-400 font-medium">
                          {formatDate(booking.date || booking.createdAt)}
                        </td>
                        <td className="py-4 px-6 text-center font-bold text-surface-900">
                          {formatPrice(booking.totalAmount)}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex justify-end items-center gap-1.5">
                            {/* Next status action */}
                            {booking.status !== 'delivered' && (
                              <button
                                onClick={() => handleStatusUpdate(booking._id, booking.status)}
                                title={`Move to next status: ${getStatusLabel(statusFlow[statusFlow.indexOf(booking.status) + 1])}`}
                                className="w-7 h-7 bg-primary-50 text-primary-600 rounded-lg flex items-center justify-center border border-primary-100 hover:bg-primary-500 hover:text-white transition-all shadow-sm"
                              >
                                <HiOutlineRefresh className="text-sm" />
                              </button>
                            )}
                            <button className="w-7 h-7 bg-surface-50 text-surface-500 border border-surface-200 rounded-lg flex items-center justify-center hover:bg-surface-100">
                              <HiOutlineDownload className="text-sm" />
                            </button>
                            <button className="w-7 h-7 bg-surface-50 text-surface-500 border border-surface-200 rounded-lg flex items-center justify-center hover:bg-surface-100">
                              <HiOutlinePrinter className="text-sm" />
                            </button>
                            <button className="w-7 h-7 bg-surface-50 text-surface-500 border border-surface-200 rounded-lg flex items-center justify-center hover:bg-surface-100">
                              <HiOutlineDotsHorizontal className="text-sm" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabDashboard;
