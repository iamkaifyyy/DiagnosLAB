import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HiOutlineSearch } from 'react-icons/hi';
import { compareTests } from '../services/api';
import TrustBadge from '../components/labs/TrustBadge';
import { formatPrice } from '../utils/helpers';
import { Link } from 'react-router-dom';

const Compare = () => {
  const [searchParams] = useSearchParams();
  const [testName, setTestName] = useState(searchParams.get('test') || '');
  const [city, setCity] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e, currentTest = testName) => {
    if (e) e.preventDefault();
    if (!currentTest.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await compareTests({ test: currentTest, city });
      setResults(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    const testParam = searchParams.get('test') || '';
    if (testParam) {
      setTestName(testParam);
      handleSearch(null, testParam);
    }
  }, [searchParams]);

  const tagStyle = {
    'Cheapest': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Best Value': 'bg-medical-100 text-medical-700 border-medical-200',
    'Premium': 'bg-purple-100 text-purple-700 border-purple-200',
  };

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="bg-white border-b border-surface-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="font-display text-2xl font-bold text-surface-900 mb-2">Compare Test Prices</h1>
          <p className="text-surface-500 mb-6">See the same test across multiple labs — compare price, trust, and report time</p>
          
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
              <input
                type="text"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                placeholder="Enter test name (e.g., CBC, Thyroid, HbA1c)..."
                className="input-field !pl-11"
              />
            </div>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City (optional)"
              className="input-field sm:!w-40"
            />
            <button type="submit" className="btn-primary !px-8">Compare</button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
          </div>
        ) : !searched ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">💰</div>
            <h3 className="font-display font-bold text-xl text-surface-700">Search for a test to compare prices</h3>
            <p className="text-surface-400 mt-1">e.g., Complete Blood Count, Thyroid Profile, HbA1c</p>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔎</div>
            <h3 className="font-display font-bold text-xl text-surface-700">No results found</h3>
            <p className="text-surface-400 mt-1">Try a different test name or city</p>
          </div>
        ) : (
          <div>
            <p className="text-sm text-surface-500 mb-6">{results.length} labs offering <strong>"{testName}"</strong></p>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-surface-100 rounded-xl">
                    <th className="text-left py-3.5 px-5 text-xs font-semibold text-surface-500 uppercase tracking-wider rounded-l-xl">Lab</th>
                    <th className="text-center py-3.5 px-5 text-xs font-semibold text-surface-500 uppercase tracking-wider">Trust Score</th>
                    <th className="text-center py-3.5 px-5 text-xs font-semibold text-surface-500 uppercase tracking-wider">Price</th>
                    <th className="text-center py-3.5 px-5 text-xs font-semibold text-surface-500 uppercase tracking-wider">Report Time</th>
                    <th className="text-center py-3.5 px-5 text-xs font-semibold text-surface-500 uppercase tracking-wider">Tag</th>
                    <th className="text-right py-3.5 px-5 text-xs font-semibold text-surface-500 uppercase tracking-wider rounded-r-xl">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100">
                  {results.map((test, i) => (
                    <tr key={test._id} className="bg-white hover:bg-surface-50 transition-colors">
                      <td className="py-4 px-5">
                        <Link to={`/lab/${test.labId?._id}`} className="font-semibold text-surface-900 hover:text-primary-600 transition-colors">
                          {test.labId?.name}
                        </Link>
                        <p className="text-xs text-surface-400 mt-0.5">{test.labId?.location?.city}</p>
                      </td>
                      <td className="py-4 px-5 text-center">
                        <div className="flex justify-center">
                          <TrustBadge score={test.labId?.trustScore || 0} size="sm" />
                        </div>
                      </td>
                      <td className="py-4 px-5 text-center">
                        <span className="font-display font-bold text-lg text-surface-900">{formatPrice(test.price)}</span>
                      </td>
                      <td className="py-4 px-5 text-center text-sm text-surface-600">{test.reportTime}h</td>
                      <td className="py-4 px-5 text-center">
                        {test.tag && (
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${tagStyle[test.tag] || ''}`}>
                            {test.tag}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-5 text-right">
                        <Link to={`/booking?lab=${test.labId?._id}&test=${test._id}`} className="btn-primary !py-2 !px-4 text-sm">
                          Book
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Compare;
