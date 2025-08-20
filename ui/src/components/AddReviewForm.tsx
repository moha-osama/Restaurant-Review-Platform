import { useState } from "react";
import { motion } from "framer-motion";
import { Rating } from "react-simple-star-rating";
import { FaStar } from "react-icons/fa";

interface AddReviewFormProps {
  onSubmit: (rating: number, comment: string) => void;
  isLoading?: boolean;
}

const AddReviewForm = ({ onSubmit, isLoading = false }: AddReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating > 0 && comment.trim()) {
      onSubmit(rating, comment.trim());
      setRating(0);
      setComment("");
    }
  };

  const handleRatingChange = (rate: number) => {
    setRating(rate);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="card border border-gray-100 shadow-xl p-6"
    >
      <h3 className="text-2xl font-bold mb-6" style={{ color: "var(--night)" }}>
        Write Your Review
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Star Rating */}
        <div className="space-y-3">
          <label
            className="text-lg font-semibold block"
            style={{ color: "var(--night)" }}
          >
            Rating *
          </label>
          <div className="flex items-center space-x-4">
            <Rating
              onClick={handleRatingChange}
              initialValue={rating}
              size={40}
              allowFraction={true}
              fillColor="var(--selective-yellow)"
              emptyColor="var(--dim-gray)"
              SVGstyle={{ display: "inline" }}
              SVGstrokeColor="var(--selective-yellow)"
              // SVGstrokeWidth={1}
            />
            <span
              className="text-lg font-medium"
              style={{ color: "var(--dim-gray)" }}
            >
              {rating > 0 ? `${rating.toFixed(1)} / 5` : "Select rating"}
            </span>
          </div>
        </div>

        {/* Comment */}
        <div className="space-y-3">
          <label
            htmlFor="comment"
            className="text-lg font-semibold block"
            style={{ color: "var(--night)" }}
          >
            Your Review *
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your dining experience... What did you like? What could be improved?"
            className="input-field w-full h-32 resize-none p-4 rounded-2xl border-2 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition-all duration-200"
            style={{ color: "var(--night)" }}
            required
          />
          <p className="text-sm" style={{ color: "var(--dim-gray)" }}>
            {comment.length}/500 characters
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="submit"
            disabled={rating === 0 || !comment.trim() || isLoading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <div
                  className="animate-spin rounded-full h-4 w-4 border-b-2"
                  style={{ borderColor: "white" }}
                />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <FaStar />
                <span>Submit Review</span>
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default AddReviewForm;
