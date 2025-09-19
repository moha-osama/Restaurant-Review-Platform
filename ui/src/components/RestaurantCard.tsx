import { FaMapMarkerAlt, FaTrophy, FaMedal, FaAward } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Rating } from "react-simple-star-rating";
import { useEffect, useState } from "react";

// Simple skeleton loader for location
const LocationSkeleton = () => (
  <span className="inline-block bg-gray-200 rounded w-32 h-4 animate-pulse" />
);

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL as string;

interface RestaurantCardProps {
  id: string;
  name: string;
  description?: string | null;
  rating: number;
  location: string;
  image?: string;
  rank?: number;
  totalReviews?: number;
  avgSentiment?: number | null;
  variant?: 'default' | 'top';
  onClick?: () => void;
  lat: number;
  lon: number;
}

const RestaurantCard = ({
  id,
  name,
  description,
  rating,
  location,
  image,
  rank,
  totalReviews,
  avgSentiment,
  lat,
  lon,
  variant = 'default',
  onClick,
}: RestaurantCardProps) => {
  const navigate = useNavigate();

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <FaTrophy className="text-yellow-500 text-2xl" />;
    if (rank === 2) return <FaMedal className="text-gray-400 text-2xl" />;
    if (rank === 3) return <FaAward className="text-amber-600 text-2xl" />;
    return null;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-r from-yellow-400 to-yellow-500";
    if (rank === 2) return "bg-gradient-to-r from-gray-300 to-gray-400";
    if (rank === 3) return "bg-gradient-to-r from-amber-500 to-amber-600";
    return "bg-gradient-to-r from-blue-400 to-blue-500";
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/restaurant/${id}`);
    }
  };


  // State for readable location
  const [readableLocation, setReadableLocation] = useState<string | null>(null);

  useEffect(() => {
    // Check if location is in lat,lon format
    if (lat && lon) {
      fetch(`${BASE_API_URL}/location/encode?lat=${lat}&lon=${lon}`)
        .then(res => res.json())
        .then(data => {
          if (data.location && data.location.display_name) {
            setReadableLocation(data.location.display_name);
          } else {
            setReadableLocation(null);
          }
        })
        .catch(() => setReadableLocation(null));
    } else {
      setReadableLocation(location);
    }
  }, [location]);

  const isTopVariant = variant === 'top';

  return (
    <div
      onClick={handleClick}
      className={`card cursor-pointer overflow-hidden border border-gray-100 rounded-xl ${
        isTopVariant 
          ? 'hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1' 
          : 'hover:shadow-lg transition-all duration-200'
      }`}
    >
      <div className="relative">
        {/* Rank Badge - Only for top variant */}
        {isTopVariant && rank && (
          <div className={`absolute top-4 left-4 ${getRankColor(rank)} text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg z-10 shadow-lg`}>
            {getRankIcon(rank) || rank}
          </div>
        )}

        {/* Restaurant Image - Always show image for both variants */}
        <div className="w-full h-48 md:h-52">
          <img loading="lazy" 
            src={image || "https://via.placeholder.com/400x300/E3CAA0/775924?text=Restaurant"}
            alt={name}
            className="w-full h-full object-cover rounded-t-xl"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://via.placeholder.com/400x300/E3CAA0/775924?text=Restaurant";
            }}
          />
        </div>

        {/* Rating Overlay */}
        <div className="absolute top-4 right-4 bg-white rounded-2xl pb-2 pt-1 px-4 shadow-lg backdrop-blur-sm border border-gray-100">
          <Rating
            readonly
            initialValue={rating}
            size={24}
            SVGstyle={{ display: "inline" }}
            fillColor="var(--selective-yellow)"
            emptyColor="var(--dim-gray)"
          />
        </div>
      </div>

      <div className={`${isTopVariant ? 'p-6 space-y-4' : 'p-4 space-y-3'}`}>
        <div className="flex items-start justify-between">
          <h3
            className="text-xl font-bold leading-tight flex-1"
            style={{ color: "var(--night)" }}
          >
            {name}
          </h3>
        </div>

        <p
          className={`leading-relaxed font-light ${
            isTopVariant ? 'text-sm line-clamp-2' : 'text-sm'
          }`}
          style={{ color: "var(--dim-gray)" }}
        >
          {description || "No description available"}
        </p>

        <div className={`flex items-center ${isTopVariant ? 'justify-between' : 'space-x-2 pt-2'}`}>
          <div
            className="flex items-center space-x-2"
            style={{ color: "var(--dim-gray)" }}
          >
            <FaMapMarkerAlt className="text-sm" />
            <span className="text-sm font-medium">
              {readableLocation === null ? <LocationSkeleton /> : readableLocation}
            </span>
          </div>
          
          {/* Rating display - Different layout for top variant */}
          {isTopVariant ? (
            <div className="text-right">
              <div className="text-lg font-bold" style={{ color: "var(--selective-yellow)" }}>
                {rating.toFixed(1)}
              </div>
              {totalReviews && (
                <div className="text-xs text-gray-500">
                  {totalReviews} reviews
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Sentiment Score - Only for top variant */}
        {isTopVariant && avgSentiment !== null && avgSentiment !== undefined && (
          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <span style={{ color: "var(--dim-gray)" }}>Sentiment Score:</span>
              <span 
                className={`font-medium ${
                  avgSentiment > 0.6 ? 'text-green-600' : 
                  avgSentiment > 0.3 ? 'text-yellow-600' : 'text-red-600'
                }`}
              >
                {(avgSentiment * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantCard;
