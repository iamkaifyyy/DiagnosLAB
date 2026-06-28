import { Link } from 'react-router-dom';
import { HiOutlineStar, HiOutlineClock, HiOutlineLocationMarker } from 'react-icons/hi';
import { FaHome, FaUserMd, FaHospital } from 'react-icons/fa';
import TrustBadge from './TrustBadge';
import { formatPrice, getTrustTier } from '../../utils/helpers';

const LabCard = ({ lab }) => {
  const tier = getTrustTier(lab.trustScore);

  const borderColor = {
    green: 'border-l-emerald-500',
    amber: 'border-l-amber-500',
    red: 'border-l-red-500',
  };

  return (
    <Link to={`/lab/${lab._id}`} className="block">
      <div className={`bg-white rounded-2xl border border-surface-200 border-l-4 ${borderColor[tier.color]} shadow-card card-hover overflow-hidden`}>
        <div className="flex flex-col sm:flex-row">
          {/* Lab Image */}
          {lab.image && (
            <div className="sm:w-48 h-36 sm:h-auto relative flex-shrink-0 bg-surface-100">
              <img
                src={lab.image}
                alt={lab.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/5" />
            </div>
          )}

          <div className="p-5 flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              {/* Lab Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-bold text-lg text-surface-900 truncate">{lab.name}</h3>
                <div className="flex items-center gap-1.5 mt-1 text-surface-500 text-sm">
                  <HiOutlineLocationMarker className="flex-shrink-0" />
                  <span className="truncate">{lab.location?.area}, {lab.location?.city}</span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {lab.doctorRecommendations > 10 && (
                    <span className="tag-doctor flex items-center gap-1">
                      <FaUserMd className="text-[10px]" /> Doctor Recommended
                    </span>
                  )}
                  {lab.hospitalRecommendations > 3 && (
                    <span className="tag-hospital flex items-center gap-1">
                      <FaHospital className="text-[10px]" /> Hospital Approved
                    </span>
                  )}
                  {lab.homeCollection && (
                    <span className="tag-home flex items-center gap-1">
                      <FaHome className="text-[10px]" /> Home Collection
                    </span>
                  )}
                </div>

                {/* Stats Row */}
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1">
                    <HiOutlineStar className="text-accent-500" />
                    <span className="font-semibold text-sm text-surface-800">{lab.ratings}</span>
                    <span className="text-xs text-surface-400">({lab.totalReviews})</span>
                  </div>
                  {lab.priceRange && (
                    <div className="text-sm text-surface-600 font-medium">
                      {formatPrice(lab.priceRange.min)} – {formatPrice(lab.priceRange.max)}
                    </div>
                  )}
                  {lab.testCount > 0 && (
                    <div className="text-xs text-surface-400">{lab.testCount} tests</div>
                  )}
                </div>

                {lab.accreditedBy?.length > 0 && (
                  <div className="flex gap-1.5 mt-2.5">
                    {lab.accreditedBy.map((acc, i) => (
                      <span key={i} className="text-[10px] font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-md border border-primary-100">
                        {acc}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Trust Badge */}
              <div className="flex-shrink-0">
                <TrustBadge score={lab.trustScore} size="md" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default LabCard;
