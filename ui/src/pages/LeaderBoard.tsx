import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import TopRestaurantsList from "../components/TopRestaurantsList";

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL as string;

const LeaderBoard = () => {
  const { data: responseData, isLoading } = useQuery({
    queryKey: ["top-restaurants"],
    queryFn: async () => {
      const response = await fetch(`${BASE_API_URL}/restaurants/top/3`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Extract restaurants from the response - handle both cached and non-cached formats
  const restaurants = responseData?.parsedData || responseData || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Top Restaurants List */}
          <TopRestaurantsList
            restaurants={restaurants}
            isLoading={isLoading}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default LeaderBoard;
