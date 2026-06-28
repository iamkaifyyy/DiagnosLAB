import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineSearch, HiOutlineShieldCheck, HiOutlineStar, HiOutlineTruck, HiArrowRight, HiOutlineLocationMarker } from 'react-icons/hi';
import { FaHeartbeat, FaFlask, FaMicroscope, FaVial, FaDna, FaStethoscope } from 'react-icons/fa';
import { getLabs, getPopularTests } from '../services/api';
import TrustBadge from '../components/labs/TrustBadge';

const popularTestIcons = {
  'Complete Blood Count (CBC)': <FaFlask />,
  'Lipid Profile': <FaVial />,
  'Thyroid Profile (T3, T4, TSH)': <FaStethoscope />,
  'HbA1c': <FaMicroscope />,
  'Vitamin D': <FaDna />,
  'Full Body Health Checkup': <FaHeartbeat />,
};

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [topLabs, setTopLabs] = useState([]);
  const [popularTests, setPopularTests] = useState([]);

  useEffect(() => {
    getLabs({ sortBy: 'trust' }).then(res => setTopLabs(res.data.slice(0, 4))).catch(() => {});
    getPopularTests().then(res => setPopularTests(res.data.slice(0, 6))).catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/search?test=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <div className="min-h-screen bg-[#051424] text-[#d4e4fa] font-sans selection:bg-teal-500/30 overflow-x-hidden pb-12">
      <style>{`
        .glass-panel {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .vitality-gradient {
          background: linear-gradient(135deg, #4edea3 0%, #06b6d4 100%);
        }

        .vitality-text {
          background: linear-gradient(135deg, #4edea3 0%, #06b6d4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .emerald-glow {
          box-shadow: 0 0 25px rgba(78, 222, 163, 0.25);
        }

        .hero-overlay {
          background-image: linear-gradient(to bottom, rgba(5, 20, 36, 0.8), #051424), 
                            url('https://lh3.googleusercontent.com/aida-public/AB6AXuDPi_wH7ThRrrZYdV1jeuIAzmrYsYeuuS9r_rlTlm4-lnYJp8oXWOuCMWqgC0g3J2mLGoT94R-KeOEUI30P3waP7JA_YaceTCGkQ46DA41y6sNXUGbKji7nXw_T-Ctv4jFxKCmQVvAJx9cwPPR5Z1NB9IUAnk6D7FlmgYub3WEABA14agXQ3WJRWNTPZHyYaQ__UtcQL2YH2gxcbDO2jZEnvdQosg4ZqLZMvbFSEMbdpTyBD6aznmaej5KNykVQdpbsS75yDnWPZ1D8');
          background-size: cover;
          background-position: center;
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative hero-overlay py-24 md:py-36 border-b border-white/5">
        <div className="absolute top-20 right-1/4 w-96 h-96 vitality-gradient opacity-10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-10 left-1/4 w-72 h-72 bg-cyan-500/10 blur-[100px] rounded-full" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[#4edea3] text-sm font-semibold mb-8 shadow-sm">
            <HiOutlineShieldCheck className="text-lg" />
            Trusted by 10,000+ patients across India
          </div>

          <h1 className="font-display text-4xl md:text-6xl font-extrabold text-white leading-tight tracking-tight">
            Patients don't need more labs.
            <br />
            <span className="vitality-text">
              They need the RIGHT lab.
            </span>
          </h1>

          <p className="mt-6 text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Compare accuracy, speed, and cost with India's first intelligence-driven lab selection platform. 
            Smart diagnostics start here.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mt-10 max-w-2xl mx-auto">
            <div className="relative">
              <HiOutlineSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tests (e.g., CBC, Thyroid, Lipid)..."
                className="w-full pl-14 pr-36 py-4.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 backdrop-blur-md text-base shadow-2xl transition-all"
              />
              <button
                type="submit"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 vitality-gradient text-[#051424] font-bold py-2.5 px-6 rounded-xl hover:scale-105 transition-transform duration-200 shadow-lg"
              >
                Search
              </button>
            </div>
          </form>

          {/* Quick Stats */}
          <div className="mt-16 grid grid-cols-3 gap-6 max-w-xl mx-auto">
            {[
              { num: '4.9/5', label: 'Avg. User Rating' },
              { num: '1,200+', label: 'Verified Labs' },
              { num: '2 Hr', label: 'Turnaround Available' },
            ].map((s, i) => (
              <div key={i} className="text-center bg-white/5 border border-white/5 p-4 rounded-2xl backdrop-blur-sm">
                <div className="font-display font-extrabold text-2xl text-white">{s.num}</div>
                <div className="text-xs text-slate-400 mt-1 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-[#051424]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">How it Works</h2>
            <p className="text-slate-400 mt-2">Three simple steps to better diagnostics</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Search & Compare', desc: 'Find tests across multiple labs. Compare prices, trust scores, and report times side-by-side.', icon: <HiOutlineSearch className="text-3xl" /> },
              { step: '02', title: 'Check Trust Score', desc: 'Our Trust Score Engine analyzes reviews, accuracy, and doctor recommendations to rate every lab.', icon: <HiOutlineShieldCheck className="text-3xl" /> },
              { step: '03', title: 'Book Home Collection', desc: 'Book your test with home collection option. Track your report status in real-time.', icon: <HiOutlineTruck className="text-3xl" /> },
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className="glass-panel rounded-3xl p-8 text-center card-hover h-full transition-all duration-300 hover:bg-white/5">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl vitality-gradient flex items-center justify-center text-[#051424] shadow-md group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <div className="text-xs font-bold text-[#4edea3] tracking-widest mb-2 uppercase">STEP {item.step}</div>
                  <h3 className="font-display font-bold text-xl text-white mb-2">{item.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Tests */}
      <section className="py-24 bg-gradient-to-b from-[#051424] to-[#040e1b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Popular Tests</h2>
              <p className="text-slate-400 mt-2">Most booked diagnostic tests</p>
            </div>
            <Link to="/search" className="hidden md:flex items-center gap-1 text-[#4edea3] font-semibold text-sm hover:gap-2 transition-all">
              View All <HiArrowRight />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {popularTests.map((test, i) => (
              <Link
                key={i}
                to={`/compare?test=${encodeURIComponent(test.testName)}`}
                className="glass-panel rounded-2xl p-6 text-center card-hover group flex flex-col justify-between hover:bg-white/5 transition-all"
              >
                <div>
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl vitality-gradient flex items-center justify-center text-[#051424] text-xl group-hover:scale-110 transition-transform">
                    {popularTestIcons[test.testName] || <FaFlask />}
                  </div>
                  <h4 className="font-bold text-sm text-white leading-snug">{test.testName}</h4>
                </div>
                <p className="text-xs text-slate-400 mt-4 font-medium">{test.labs?.length || 0} labs available</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top Rated Labs & Trust Score Engine */}
      <section className="py-24 bg-[#040e1b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            
            {/* Labs List */}
            <div className="lg:col-span-7">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-extrabold text-white tracking-tight">Top Rated Labs</h2>
                  <p className="text-slate-400 mt-1">Highest trust scores across India</p>
                </div>
                <Link to="/search" className="hidden md:flex items-center gap-1 text-[#4edea3] font-semibold text-sm hover:gap-2 transition-all">
                  View All <HiArrowRight />
                </Link>
              </div>

              <div className="space-y-4">
                {topLabs.map((lab) => (
                  <Link key={lab._id} to={`/lab/${lab._id}`} className="block">
                    <div className="glass-panel p-5 rounded-2xl flex items-center justify-between hover:border-[#4edea3]/50 transition-all card-hover group">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-white p-2 flex items-center justify-center flex-shrink-0">
                          {lab.image ? (
                            <img className="h-full w-full object-contain" src={lab.image} alt={lab.name} />
                          ) : (
                            <div className="h-full w-full rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white font-extrabold text-xl">
                              {lab.name?.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-display font-bold text-lg text-white group-hover:text-[#4edea3] transition-colors">{lab.name}</h4>
                          <div className="flex items-center gap-1.5 text-slate-400 text-sm mt-1">
                            <HiOutlineLocationMarker className="text-slate-500" />
                            <span>{lab.location?.area}, {lab.location?.city}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right flex-shrink-0 ml-4">
                        <div className="text-[#4edea3] font-extrabold text-2xl">
                          {lab.trustScore}
                          <span className="text-sm font-normal text-slate-400">/100</span>
                        </div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-0.5">Trust Score</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Trust Score Engine */}
            <div className="lg:col-span-5">
              <div className="glass-panel p-8 rounded-[2rem] border-[#4edea3]/20 shadow-[0_0_50px_rgba(78,222,163,0.05)]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full vitality-gradient flex items-center justify-center text-[#051424]">
                    <HiOutlineShieldCheck className="text-2xl" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-white">Trust Score Engine <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider ml-1">v2.0</span></h3>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  Our proprietary algorithm analyzes over 50 real-time parameters to rank labs objectively.
                </p>

                <div className="space-y-5">
                  {[
                    { label: 'Lab Accuracy & Precision', value: 95 },
                    { label: 'User Reviews & Feedback', value: 90 },
                    { label: 'Equipment Modernity', value: 85 },
                    { label: 'Turnaround Consistency', value: 92 },
                  ].map((w, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-xs font-semibold mb-2">
                        <span className="text-slate-300">{w.label}</span>
                        <span className="text-[#4edea3] font-bold">{w.value}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full vitality-gradient rounded-full" style={{ width: `${w.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-4 rounded-xl bg-teal-500/5 border border-teal-500/10">
                  <p className="text-xs text-slate-400 leading-relaxed">
                    <span className="font-bold text-[#4edea3]">Note:</span> Weights are dynamically adjusted based on lab certification levels (NABL, CAP) and recent inspection reports.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-[#051424]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="glass-panel rounded-[2.5rem] p-12 relative overflow-hidden">
            <div className="absolute -top-24 -left-24 w-64 h-64 vitality-gradient opacity-5 blur-[100px] rounded-full" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 vitality-gradient opacity-5 blur-[100px] rounded-full" />
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Ready to find the right lab?</h2>
              <p className="text-slate-300 mb-8 max-w-lg mx-auto">
                Join thousands of patients who prioritize precision and transparency in their healthcare journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/search"
                  className="vitality-gradient text-[#051424] font-bold py-3 px-8 rounded-2xl text-lg emerald-glow hover:scale-105 active:scale-95 transition-all duration-200"
                >
                  Start Searching Now
                </Link>
                <Link
                  to="/register"
                  className="py-3 px-8 rounded-2xl font-bold text-lg border border-white/10 hover:bg-white/5 transition-all text-white"
                >
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
