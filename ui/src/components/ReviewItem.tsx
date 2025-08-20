import { FaUser, FaClock } from "react-icons/fa";
import { Rating } from "react-simple-star-rating";

interface Review {
  id: string;
  restaurant_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  author?: string;
  user?: {
    name: string;
  };
}

interface ReviewItemProps {
  review: Review;
}

const ReviewItem = ({ review }: ReviewItemProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="card border border-gray-100 shadow-lg p-6 hover:shadow-xl transition-all duration-300">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
              <FaUser className="text-white text-lg" />
            </div>
            <div>
              <h4
                className="text-lg font-semibold"
                style={{ color: "var(--night)" }}
              >
                {review.author || review.user?.name || "Anonymous"}
              </h4>
              <div
                className="flex items-center space-x-2 text-sm"
                style={{ color: "var(--dim-gray)" }}
              >
                <FaClock className="text-xs" />
                <span>{formatDate(review.created_at)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Rating
              className="flex"
              readonly
              initialValue={review.rating}
              size={24}
              fillColor="var(--selective-yellow)"
              emptyColor="var(--dim-gray)"
              SVGstyle={{ display: "inline" }}
            />
            <span
              className="font-bold text-lg"
              style={{ color: "var(--selective-yellow)" }}
            >
              {review.rating}
            </span>
          </div>
        </div>

        {/* Review Content */}
        <div>
          <p
            className="text-base leading-relaxed font-light"
            style={{ color: "var(--dim-gray)" }}
          >
            {review.comment}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReviewItem;
