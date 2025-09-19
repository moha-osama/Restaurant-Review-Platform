import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";
import RestaurantInfo from "../components/RestaurantInfo";
import RestaurantInfoSkeleton from "../components/RestaurantInfoSkeleton";
import ReviewsList from "../components/ReviewsList";
import AddReviewModal from "../components/AddReviewModal";
import Notification from "../components/Notification";

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL as string;

const RestaurantDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState({
    isVisible: false,
    message: "",
    type: "info" as "info" | "warning" | "error" | "success",
  });
  const { isLoggedIn: isAuthed, isLoading: authLoading } = useAuth();

  // Fetch restaurant details
  const { data: restaurant, isLoading: restaurantLoading } = useQuery({
    queryKey: ["restaurant", id],
    queryFn: async () => {
      const response = await fetch(`${BASE_API_URL}/restaurants/${id}`);
      if (!response.ok) {
        throw new Error("Restaurant not found");
      }
      return response.json();
    },
    enabled: !!id,
  });

  // Fetch reviews for the restaurant (only if authenticated)
  const { data: reviews = [], isLoading: reviewsLoading } = useQuery({
    queryKey: ["reviews", id],
    queryFn: async () => {
      const response = await fetch(`${BASE_API_URL}/restaurants/${id}/reviews`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }
      return response.json();
    },
    enabled: !!id && isAuthed && !authLoading,
  });

  // Add review mutation
  const addReviewMutation = useMutation({
    mutationFn: async (reviewData: { rating: number; comment: string }) => {
      const response = await fetch(`${BASE_API_URL}/restaurants/${id}/reviews`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
      });
      if (!response.ok) {
        throw new Error("Failed to add review");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", id] });
      queryClient.invalidateQueries({ queryKey: ["restaurant", id] });
      setIsModalOpen(false);
    },
  });

  const handleAddReview = (rating: number, comment: string) => {
    addReviewMutation.mutate({ rating, comment });
  };

  const handleAddReviewClick = () => {
    if (!isAuthed) {
      setNotification({
        isVisible: true,
        message: "Please login to add your review",
        type: "warning",
      });
      return;
    }
    setIsModalOpen(true);
  };

  const closeNotification = () => {
    setNotification((prev) => ({ ...prev, isVisible: false }));
  };

  if (restaurantLoading || authLoading) {
    return <RestaurantInfoSkeleton />;
  }

  if (!restaurant) {
    return (
      <div className="text-center py-16">
        <div className="text-8xl mb-6" style={{ color: "var(--dim-gray)" }}>
          🍽️
        </div>
        <p
          className="text-xl font-medium mb-2"
          style={{ color: "var(--dim-gray)" }}
        >
          Restaurant not found
        </p>
        <button onClick={() => navigate("/")} className="btn-primary mt-4">
          Back to Restaurants
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <motion.button
        onClick={() => navigate("/")}
        className="flex items-center space-x-2 text-lg font-medium transition-transform duration-200"
        style={{ color: "var(--dim-gray)", cursor: "pointer" }}
        whileHover={{ x: -5 }}
      >
        <FaArrowLeft />
        <span>Back to Restaurants</span>
      </motion.button>

      {/* Restaurant Information */}
      <RestaurantInfo restaurant={restaurant} />

      {/* Reviews Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2
            className="text-3xl font-bold tracking-tight"
            style={{ color: "var(--night)" }}
          >
            Reviews ({reviews.length})
          </h2>
          <button
            onClick={handleAddReviewClick}
            className="btn-primary"
            style={{ cursor: "pointer" }}
          >
            Add Review
          </button>
        </div>

        {/* Reviews List */}
        <ReviewsList
          isAuthed={isAuthed}
          showTotalReviews={false}
          reviews={isAuthed ? reviews : []}
          isLoading={reviewsLoading}
        />
      </div>

      {/* Add Review Modal */}
      <AddReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddReview}
        isLoading={addReviewMutation.isPending}
      />

      {/* Notification */}
      <Notification
        isVisible={notification.isVisible}
        onClose={closeNotification}
        message={notification.message}
        type={notification.type}
        duration={4000}
      />
    </div>
  );
};

export default RestaurantDetailPage;
