import { FaMapMarkerAlt, FaClock, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const RestaurantInfoSkeleton = () => {
  const navigate = useNavigate();
  return (
  <>
      <button
        onClick={() => navigate("/")}
        className="flex items-center space-x-2 mb-8 text-lg font-medium transition-transform duration-200"
        style={{ color: "var(--dim-gray)", cursor: "pointer" }}
      >
        <FaArrowLeft />
        <span>Back to Restaurants</span>
      </button>

    <div className="card border border-gray-100 shadow-xl overflow-hidden animate-pulse">

      {/* Hero Image Skeleton */}
      <div className="relative h-64 md:h-80 bg-gray-200" />
      {/* Rating Badge Skeleton */}
      <div className="absolute top-8 right-8">
        <div className="bg-white/95 backdrop-blur-sm rounded-full px-6 py-3 flex items-center space-x-2 shadow-lg">
          <div className="h-7 w-28 bg-gray-200 rounded" />
          <div className="h-7 w-10 bg-gray-200 rounded" />
        </div>
      </div>
      {/* Restaurant Details Skeleton */}
      <div className="p-8 space-y-6">
        {/* Header Skeleton */}
        <div className="space-y-3">
          <div className="h-10 w-2/3 bg-gray-200 rounded" />
          <div className="flex items-center space-x-4 text-lg">
            <div className="flex items-center space-x-2">
              <FaMapMarkerAlt className="text-gray-300" />
              <div className="h-6 w-32 bg-gray-200 rounded" />
            </div>
            <div className="flex items-center space-x-2">
              <FaClock className="text-gray-300" />
              <div className="h-6 w-24 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
        {/* Description Skeleton */}
        <div className="space-y-3">
          <div className="h-6 w-24 bg-gray-200 rounded" />
          <div className="h-5 w-full bg-gray-100 rounded" />
          <div className="h-5 w-3/4 bg-gray-100 rounded" />
        </div>
      </div>
    </div>
    </>
  );
};

export default RestaurantInfoSkeleton;
