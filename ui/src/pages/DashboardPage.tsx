import { useQuery } from "@tanstack/react-query";
import ProfileCard from "../components/ProfileCard";
import ReviewsList from "../components/ReviewsList";
import OwnerRestaurants from "../components/OwnerRestaurants";
import { useAuth } from "../hooks/useAuth";
import DashboardSkeleton from "./DashboardSkeleton";

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL as string;

interface ApiReview {
  id: string;
  restaurant_id: string;
  user_id: string;
  rating: string;
  sentiment: string;
  comment: string;
  created_at: string;
  user: {
    id: string;
    name: string;
  };
}

interface Restaurant {
  id: string;
  name: string;
  location: string;
  description: string | null;
  avg_rating: string;
  avg_sentiment: string;
  created_at: string;
  avgRating: number | null;
  avgSentiment: number | null;
}

const DashboardPage = () => {
  const { user, isLoading, logout } = useAuth();

  // Fetch restaurants to get restaurant names for reviews
  const { data: restaurants = [] } = useQuery({
    queryKey: ["restaurants"],
    queryFn: async () => {
      const response = await fetch(`${BASE_API_URL}restaurants`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Fetch reviews from the API
  const { data: apiReviews = [], isLoading: reviewsLoading } = useQuery({
    queryKey: ["user-reviews"],
    queryFn: async () => {
      const response = await fetch(
        `${BASE_API_URL}users/${user?.id}/reviews`,
        {
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data;
    },
    enabled: !!user?.id && restaurants.length > 0,
    staleTime: 5 * 60 * 1000, 
  });

  const reviews = apiReviews.map((apiReview: ApiReview) => {
    const restaurant = restaurants.find(
      (r: Restaurant) => r.id === apiReview.restaurant_id
    );
    return {
      id: apiReview.id,
      restaurantName: restaurant?.name || "Unknown Restaurant",
      rating: parseFloat(apiReview.rating) || 0,
      comment: apiReview.comment,
      date: apiReview.created_at,
      author: apiReview.user.name || "Anonymous",
      restaurantImage:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100&h=100&fit=crop",
    };
  });

  const handleEditReview = (reviewId: string) => {
    // TODO: Implement edit review functionality
    console.log("Edit review:", reviewId);
  };

  const handleDeleteReview = (reviewId: string) => {
    // TODO: Implement delete review functionality
    console.log("Delete review:", reviewId);
  };

  if (isLoading || reviewsLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Section */}
        <div className="lg:col-span-1">
          {user && <ProfileCard user={user} onLogout={logout} />}
        </div>

        {/* Content Section */}
        <div className="lg:col-span-2 space-y-8">
          {/* Owner Restaurants Section */}
          {user?.role === "owner" && <OwnerRestaurants user={user} />}

          {/* Reviews Section */}
          <ReviewsList
            reviews={reviews}
            onEditReview={handleEditReview}
            onDeleteReview={handleDeleteReview}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
