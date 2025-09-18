
const DashboardSkeleton = () => {
  return (
    <div className="space-y-8">
      {/* Real header and description, not skeleton */}
      <div className="text-center">
        <h1
          className="text-5xl font-bold mb-4 tracking-tight"
          style={{ color: "var(--night)" }}
        >
          Your Dashboard
        </h1>
        <p className="text-xl font-light" style={{ color: "var(--dim-gray)" }}>
          Manage your profile and review your dining experiences
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
        {/* Profile Section Skeleton */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-100 shadow-xl rounded-lg p-8 flex flex-col items-center space-y-4">
            <div className="h-24 w-24 bg-gray-200 rounded-full mb-4" />
            <div className="h-6 w-32 bg-gray-200 rounded" />
            <div className="h-4 w-24 bg-gray-100 rounded" />
            <div className="h-4 w-20 bg-gray-100 rounded" />
            <div className="h-10 w-32 bg-gray-200 rounded mt-4" />
          </div>
        </div>
        {/* Content Section Skeleton */}
        <div className="lg:col-span-2 space-y-8">
          {/* Owner Restaurants Skeleton */}
          <div className="h-12 w-1/2 bg-gray-200 rounded mb-4" />
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            {Array.from({ length: 2 }).map((_, idx) => (
              <div key={idx} className="bg-white border border-gray-100 shadow rounded-lg p-6 space-y-4">
                <div className="h-6 w-1/2 bg-gray-200 rounded" />
                <div className="h-4 w-1/3 bg-gray-100 rounded" />
                <div className="h-4 w-1/4 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
          {/* Reviews Skeleton */}
          <div className="h-8 w-1/3 bg-gray-200 rounded mb-4" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="bg-white border border-gray-100 shadow rounded-lg p-6 space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 bg-gray-200 rounded-full" />
                  <div className="h-6 w-32 bg-gray-200 rounded" />
                  <div className="h-4 w-20 bg-gray-100 rounded" />
                </div>
                <div className="h-4 w-full bg-gray-100 rounded" />
                <div className="h-4 w-3/4 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
