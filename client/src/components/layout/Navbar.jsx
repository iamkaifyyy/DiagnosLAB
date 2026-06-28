import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HiOutlineMenu, HiOutlineX, HiOutlineSearch, HiOutlineUser, HiOutlineLogout } from 'react-icons/hi';
import { FaHeartbeat } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?test=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    const map = { patient: '/dashboard', lab: '/lab-dashboard', doctor: '/doctor-dashboard', hospital: '/hospital-dashboard' };
    return map[user.role] || '/dashboard';
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-surface-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-medical-500 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-glow-teal transition-all duration-300">
              <FaHeartbeat className="text-white text-lg" />
            </div>
            <span className="font-display font-bold text-xl text-surface-900">
              diagnos<span className="gradient-text">LAB</span>
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 text-lg" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tests (e.g., CBC, Thyroid, Lipid)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-50 border border-surface-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:outline-none transition-all text-sm"
              />
            </div>
          </form>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/search" className="px-4 py-2 text-sm font-medium text-surface-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
              Find Labs
            </Link>
            <Link to="/compare" className="px-4 py-2 text-sm font-medium text-surface-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
              Compare
            </Link>

            {user ? (
              <div className="relative ml-2">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary-50 border border-primary-200 hover:border-primary-400 transition-all"
                >
                  <div className="w-7 h-7 bg-gradient-to-br from-primary-500 to-medical-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{user.name?.charAt(0)}</span>
                  </div>
                  <span className="text-sm font-medium text-surface-700">{user.name?.split(' ')[0]}</span>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-surface-200 py-2 animate-slide-down">
                    <div className="px-4 py-2 border-b border-surface-100">
                      <p className="text-sm font-semibold text-surface-800">{user.name}</p>
                      <p className="text-xs text-surface-400 capitalize">{user.role}</p>
                    </div>
                    <Link
                      to={getDashboardLink()}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-surface-600 hover:bg-surface-50 transition-colors"
                    >
                      <HiOutlineUser className="text-lg" /> Dashboard
                    </Link>
                    <button
                      onClick={() => { logout(); setProfileOpen(false); navigate('/'); }}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <HiOutlineLogout className="text-lg" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-surface-600 hover:text-primary-600 transition-colors">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary text-sm !py-2 !px-5">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg hover:bg-surface-100 transition-colors">
            {menuOpen ? <HiOutlineX className="w-6 h-6" /> : <HiOutlineMenu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-surface-100 animate-slide-down">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tests..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-50 border border-surface-200 focus:border-primary-400 focus:outline-none text-sm"
                />
              </div>
            </form>
            <Link to="/search" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-surface-600 hover:bg-surface-50 rounded-lg">Find Labs</Link>
            <Link to="/compare" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-surface-600 hover:bg-surface-50 rounded-lg">Compare</Link>
            {user ? (
              <>
                <Link to={getDashboardLink()} onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-surface-600 hover:bg-surface-50 rounded-lg">Dashboard</Link>
                <button onClick={() => { logout(); setMenuOpen(false); navigate('/'); }} className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-surface-600 hover:bg-surface-50 rounded-lg">Sign In</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="block px-4 py-3 mt-2 text-center btn-primary text-sm">Get Started</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
