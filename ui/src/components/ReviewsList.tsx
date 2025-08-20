import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ReviewItem from "./ReviewItem";
import Loading from "./Loading";

interface Review {
  id: string;
  restaurant_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  author: string;
}

interface ReviewsListProps {
  reviews: Review[];
  isLoading?: boolean;
  onEditReview?: (reviewId: string) => void;
  onDeleteReview?: (reviewId: string) => void;
  showTotalReviews?: boolean;
  isAuthed?: boolean;
}

// Dummy reviews for unauthenticated users
const dummyReviews: Review[] = [
  {
    id: "dummy-1",
    restaurant_id: "dummy",
    user_id: "dummy",
    rating: 5,
    comment:
      "Amazing food and great service! The atmosphere was perfect for a romantic dinner. Highly recommend the signature dishes.",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    author: "Sarah M.",
  },
  {
    id: "dummy-2",
    restaurant_id: "dummy",
    user_id: "dummy",
    rating: 4,
    comment:
      "Good food and friendly staff. The portions were generous and the prices were reasonable. Will definitely come back!",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    author: "John D.",
  },
  {
    id: "dummy-3",
    restaurant_id: "dummy",
    user_id: "dummy",
    rating: 5,
    comment:
      "Exceptional dining experience! The chef's special was outstanding and the wine pairing was perfect. A must-visit restaurant.",
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    author: "Emily R.",
  },
];

const ReviewsList = ({
  reviews,
  isLoading = false,
  showTotalReviews = true,
  onEditReview,
  onDeleteReview,
  isAuthed = true,
}: ReviewsListProps) => {
  const navigate = useNavigate();

  if (isLoading) {
    return <Loading />;
  }

  // If user is not authenticated, show dummy reviews with blur
  if (!isAuthed) {
    return (
      <div className="space-y-6">
        {/* Blurred Reviews List */}
        <div className="space-y-4 relative">
          {dummyReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="filter blur-sm pointer-events-none"
            >
              <ReviewItem review={review} />
            </motion.div>
          ))}

          {/* Login Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-white/5 backdrop-blur-sm rounded-lg">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center p-8 max-w-md"
            >
              <div className="text-6xl mb-4">🔒</div>
              <h3
                className="text-2xl font-bold mb-3"
                style={{ color: "var(--night)" }}
              >
                Login to View Reviews
              </h3>
              <p className="text-lg mb-6" style={{ color: "var(--dim-gray)" }}>
                Sign in to read authentic reviews from our community and share
                your own experience!
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/auth")}
                className="px-8 py-3 rounded-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200"
                style={{ backgroundColor: "var(--selective-yellow)" }}
              >
                Sign In Now
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center py-16"
      >
        <div className="text-8xl mb-6" style={{ color: "var(--dim-gray)" }}>
          📝
        </div>
        <h3
          className="text-2xl font-bold mb-2"
          style={{ color: "var(--night)" }}
        >
          No Reviews Yet
        </h3>
        <p className="text-lg font-light" style={{ color: "var(--dim-gray)" }}>
          Be the first to share your experience with this restaurant!
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Reviews Summary */}
      {showTotalReviews && (
        <div className="card border border-gray-100 shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div
                  className="text-3xl font-bold"
                  style={{ color: "var(--selective-yellow)" }}
                >
                  {reviews.length}
                </div>

                <div
                  className="text-sm font-medium"
                  style={{ color: "var(--dim-gray)" }}
                >
                  Total Reviews
                </div>
              </div>
            </div>

            <div className="text-right">
              <div
                className="text-sm font-medium"
                style={{ color: "var(--dim-gray)" }}
              >
                Latest Review
              </div>
              <div
                className="text-base font-semibold"
                style={{ color: "var(--night)" }}
              >
                {new Date(reviews[0]?.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <ReviewItem review={review} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsList;
