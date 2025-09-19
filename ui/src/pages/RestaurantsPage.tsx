import { useState } from "react";
import HomePageSkeleton from "../components/HomePageSkeleton";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import UnifiedRestaurantCard from "../components/RestaurantCard";
// import Map from "../components/Map"; // Disabled map for now
import { FaSearch, FaFilter } from "react-icons/fa";

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL as string;

// Define the restaurant type based on API response
interface Restaurant {
  id: string;
  owner_id: string;
  name: string;
  location: string;
  description: string | null;
  avg_rating: string;
  avg_sentiment: string;
  created_at: string;
  avgRating: number | null;
  avgSentiment: number | null;
  // Add coordinates for map functionality
  coordinates?: { lat: number; lng: number };
}

const RestaurantsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: restaurants = [], isLoading } = useQuery({
    queryKey: ["restaurants"],
    queryFn: async () => {
      const response = await fetch(`${BASE_API_URL}/restaurants`,{
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      // Add mock coordinates for map functionality since API doesn't provide them
      return data.map((restaurant: Restaurant) => ({
        ...restaurant,
        coordinates: {
          lat: 40.7128 + Math.random() * 0.1, // Random coordinates around NYC
          lng: -74.006 + Math.random() * 0.1,
        },
      }));
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const filteredRestaurants = restaurants.filter(
    (restaurant: Restaurant) =>
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (restaurant.description &&
        restaurant.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      restaurant.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <HomePageSkeleton />;
  }
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-12 pr-4 py-3 rounded-2xl border-2 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition-all duration-200"
            />
          </div>
          <button className="btn-secondary flex items-center space-x-2 px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <FaFilter />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <motion.div
        className="grid gap-8 grid-cols-1"
        layout
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        {/* Restaurant List */}
        <motion.div
          className="space-y-6"
          layout
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <motion.div
            className="flex items-center justify-between"
            layout
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <h2
              className="text-3xl font-bold tracking-tight"
              style={{ color: "var(--night)" }}
            >
              {filteredRestaurants.length} Restaurants
            </h2>
          </motion.div>

          <motion.div
            className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            layout
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {filteredRestaurants.map((restaurant: Restaurant) => (
              <motion.div
                key={restaurant.id}
                layout
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <UnifiedRestaurantCard
                  {...restaurant}
                  rating={parseFloat(restaurant.avg_rating) || 0}
                  image="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop"
                  variant="default"
                />
              </motion.div>
            ))}
          </motion.div>

          {filteredRestaurants.length === 0 && (
            <motion.div
              className="text-center py-16"
              layout
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <div
                className="text-8xl mb-6"
                style={{ color: "var(--dim-gray)" }}
              >
                🔍
              </div>
              <p
                className="text-xl font-medium mb-2"
                style={{ color: "var(--dim-gray)" }}
              >
                No restaurants found matching your search.
              </p>
              <p
                className="text-base font-light"
                style={{ color: "var(--dim-gray)" }}
              >
                Try adjusting your search terms or filters.
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Map Panel - Disabled for now */}
        {/* <AnimatePresence mode="wait">
          {selectedRestaurant && (
            <motion.div
              ref={mapRef}
              className="lg:col-span-1 relative"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              layout
            >
              <div className="sticky top-4 h-[calc(100vh-2rem)] max-h-[800px]">
                <motion.button
                  onClick={handleCloseMap}
                  className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg border border-gray-200 hover:bg-white transition-all duration-200 hover:scale-110"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{ color: "var(--dim-gray)" }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </motion.button>

                <Map
                  selectedRestaurant={{
                    name: selectedRestaurant.name,
                    location: selectedRestaurant.location,
                    coordinates: selectedRestaurant.coordinates || {
                      lat: 40.7128,
                      lng: -74.006,
                    },
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence> */}
      </motion.div>
    </div>
  );
};

export default RestaurantsPage;
