import { FaSearch, FaFilter } from "react-icons/fa";

const SkeletonCard = () => (
  <div className="animate-pulse bg-white rounded-lg shadow p-4 flex flex-col space-y-4 border border-gray-100">
    <div className="h-40 bg-gray-200 rounded w-full" />
    <div className="h-6 bg-gray-200 rounded w-3/4" />
    <div className="h-4 bg-gray-200 rounded w-1/2" />
    <div className="h-4 bg-gray-200 rounded w-1/3" />
    <div className="flex space-x-2 mt-2">
      <div className="h-8 w-8 bg-gray-200 rounded-full" />
      <div className="h-8 w-8 bg-gray-200 rounded-full" />
    </div>
  </div>
);

const HomePageSkeleton = () => {
  return (
    <div>
      <div className="text-center">
        <h1
          className="text-5xl font-bold mb-4 tracking-tight"
          style={{ color: "var(--night)" }}
        >
          Discover Great Restaurants
        </h1>
        <p className="text-xl font-light" style={{ color: "var(--dim-gray)" }}>
          Find the perfect place to dine and share your experience
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="card border border-gray-100 shadow-xl my-9">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search restaurants, cuisines, or locations..."
              className="input-field pl-12 pr-4 py-3 rounded-2xl border-2 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition-all duration-200"
              disabled
            />
          </div>
          <button className="btn-secondary flex items-center space-x-2 px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300" disabled>
            <FaFilter />
            <span>Filters</span>
          </button>
        </div>
      </div>
          <div className="flex items-center justify-between">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-4" />
          </div>
      {/* Skeleton Cards */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 8 }).map((_, idx) => (
          <SkeletonCard key={idx} />
        ))}
      </div>
    </div>
  );
};

export default HomePageSkeleton;
