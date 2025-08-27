import { motion, AnimatePresence } from "framer-motion";
import UnifiedRestaurantCard from "./RestaurantCard";
import { FaTrophy } from "react-icons/fa";

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
}

interface TopRestaurantsListProps {
  restaurants: Restaurant[];
  isLoading: boolean;
}

const TopRestaurantsList = ({ restaurants, isLoading }: TopRestaurantsListProps) => {

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-16 w-16 border-b-2 mx-auto"
            style={{ borderColor: "var(--selective-yellow)" }}
          ></div>
          <p
            className="mt-6 text-lg font-medium"
            style={{ color: "var(--dim-gray)" }}
          >
            Loading top restaurants...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Trophy Icon */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 mb-4">
          <FaTrophy className="text-4xl text-white" />
        </div>
        <h2 className="text-3xl font-bold mb-2" style={{ color: "var(--night)" }}>
          Top Restaurants Leaderboard
        </h2>
        <p className="text-lg" style={{ color: "var(--dim-gray)" }}>
          Discover the highest-rated dining experiences
        </p>
      </div>

      {/* Restaurants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {restaurants.map((restaurant, index) => (
            <motion.div
              key={restaurant.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <UnifiedRestaurantCard
                id={restaurant.id}
                name={restaurant.name}
                description={restaurant.description}
                rating={parseFloat(restaurant.avg_rating) || 0}
                location={restaurant.location}
                rank={index + 1}
                totalReviews={Math.floor((parseFloat(restaurant.avg_rating) || 0) * 10) + 5} // Mock review count
                avgSentiment={parseFloat(restaurant.avg_sentiment) || 0}
                variant="top"
                image="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {restaurants.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🍽️</div>
          <h3 className="text-xl font-medium text-gray-600 mb-2">No restaurants found</h3>
          <p className="text-gray-500">There are no restaurants available for the leaderboard yet.</p>
        </div>
      )}
    </div>
  );
};

export default TopRestaurantsList;
