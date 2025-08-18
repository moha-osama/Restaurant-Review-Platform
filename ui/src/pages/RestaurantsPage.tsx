import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import RestaurantCard from "../components/RestaurantCard";
import Map from "../components/Map";
import { FaSearch, FaFilter } from "react-icons/fa";

// Mock data - replace with actual API call
const mockRestaurants = [
  {
    id: "1",
    name: "The Golden Fork",
    description:
      "A cozy Italian restaurant serving authentic pasta and wood-fired pizzas in a warm, family-friendly atmosphere.",
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
    location: "Downtown District",
    coordinates: { lat: 40.7128, lng: -74.006 },
  },
  {
    id: "2",
    name: "Sakura Sushi Bar",
    description:
      "Fresh sushi and Japanese cuisine prepared by master chefs using traditional techniques and premium ingredients.",
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
    location: "Riverside Quarter",
    coordinates: { lat: 40.7589, lng: -73.9851 },
  },
  {
    id: "3",
    name: "Le Petit Bistro",
    description:
      "French bistro offering classic dishes like coq au vin and beef bourguignon in an elegant, romantic setting.",
    rating: 4.3,
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
    location: "Historic District",
    coordinates: { lat: 40.7505, lng: -73.9934 },
  },
  {
    id: "4",
    name: "Taco Fiesta",
    description:
      "Authentic Mexican street food with vibrant flavors, fresh ingredients, and a lively atmosphere.",
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
    location: "Arts District",
    coordinates: { lat: 40.7484, lng: -73.9857 },
  },
  {
    id: "5",
    name: "The Garden Cafe",
    description:
      "Farm-to-table dining featuring seasonal ingredients, organic produce, and sustainable practices.",
    rating: 4.4,
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
    location: "Green Valley",
    coordinates: { lat: 40.7614, lng: -73.9776 },
  },
  {
    id: "6",
    name: "Ocean Blue Seafood",
    description:
      "Fresh seafood restaurant with ocean views, specializing in grilled fish and shellfish dishes.",
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
    location: "Harbor Front",
    coordinates: { lat: 40.7021, lng: -74.0173 },
  },
];

const RestaurantsPage = () => {
  const [selectedRestaurant, setSelectedRestaurant] = useState<
    (typeof mockRestaurants)[0] | null
  >(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Mock API call using TanStack Query
  const { data: restaurants, isLoading } = useQuery({
    queryKey: ["restaurants"],
    queryFn: () => Promise.resolve(mockRestaurants),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const filteredRestaurants =
    restaurants?.filter(
      (restaurant) =>
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        restaurant.location.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const handleRestaurantClick = (restaurant: (typeof mockRestaurants)[0]) => {
    setSelectedRestaurant(restaurant);
  };

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
            Discovering amazing restaurants...
          </p>
        </div>
      </div>
    );
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Panel - Restaurant List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2
              className="text-3xl font-bold tracking-tight"
              style={{ color: "var(--night)" }}
            >
              {filteredRestaurants.length} Restaurants Found
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <div key={restaurant.id}>
                <RestaurantCard
                  {...restaurant}
                  onClick={() => handleRestaurantClick(restaurant)}
                />
              </div>
            ))}
          </div>

          {filteredRestaurants.length === 0 && (
            <div className="text-center py-16">
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
            </div>
          )}
        </div>

        {/* Right Panel - Map */}
        <div className="lg:col-span-1">
          <Map selectedRestaurant={selectedRestaurant || undefined} />
        </div>
      </div>
    </div>
  );
};

export default RestaurantsPage;
