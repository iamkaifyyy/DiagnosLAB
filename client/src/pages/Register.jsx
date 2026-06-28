import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeartbeat } from 'react-icons/fa';
import { register as registerApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'patient', phone: '', city: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await registerApi(form);
      loginUser(res.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-primary-50/30 to-surface-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-medical-500 rounded-xl flex items-center justify-center shadow-lg">
              <FaHeartbeat className="text-white text-xl" />
            </div>
            <span className="font-display font-bold text-2xl text-surface-900">diagnosLAB</span>
          </Link>
          <h1 className="font-display text-3xl font-bold text-surface-900">Create your account</h1>
          <p className="text-surface-500 mt-1">Join the smarter diagnostics platform</p>
        </div>

        <div className="bg-white rounded-2xl shadow-card border border-surface-200 p-8 animate-slide-up">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="text-sm font-semibold text-surface-700 block mb-2">I am a</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { val: 'patient', label: '👤 Patient' },
                  { val: 'lab', label: '🧪 Lab' },
                  { val: 'doctor', label: '🩺 Doctor' },
                  { val: 'hospital', label: '🏥 Hospital' },
                ].map(r => (
                  <button
                    key={r.val}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, role: r.val }))}
                    className={`py-2.5 px-2 rounded-xl text-xs font-semibold border-2 transition-all ${
                      form.role === r.val ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-surface-200 text-surface-500 hover:border-primary-300'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-surface-700 block mb-1.5">Full Name</label>
              <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Rahul Sharma" className="input-field" required />
            </div>
            <div>
              <label className="text-sm font-semibold text-surface-700 block mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com" className="input-field" required />
            </div>
            <div>
              <label className="text-sm font-semibold text-surface-700 block mb-1.5">Password</label>
              <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Min 6 characters" className="input-field" required minLength={6} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold text-surface-700 block mb-1.5">Phone</label>
                <input type="text" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="9876543210" className="input-field" />
              </div>
              <div>
                <label className="text-sm font-semibold text-surface-700 block mb-1.5">City</label>
                <input type="text" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="Delhi" className="input-field" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full !py-3">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-surface-500">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:underline">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
