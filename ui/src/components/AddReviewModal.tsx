import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rating } from "react-simple-star-rating";
import { FaStar, FaTimes } from "react-icons/fa";

interface AddReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
  isLoading?: boolean;
}

const AddReviewModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: AddReviewModalProps) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setRating(0);
      setComment("");
    }
  }, [isOpen]);

  // Disable background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;

      // Disable scroll on body
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";

      // Cleanup function to restore scroll
      return () => {
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating > 0 && comment.trim()) {
      onSubmit(rating, comment.trim());
      onClose();
    }
  };

  const handleRatingChange = (rate: number) => {
    setRating(rate);
  };

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 bg-black h-screen w-screen z-40"
            onClick={handleBackdropClick}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{
                scale: 0.95,
                translateY: 20,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                translateY: 0,
                opacity: 1,
              }}
              exit={{
                scale: 0.95,
                translateY: 20,
                opacity: 0,
              }}
              transition={{
                duration: 0.3,
                ease: "easeOut",
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3
                    className="text-2xl font-bold"
                    style={{ color: "var(--night)" }}
                  >
                    Write Your Review
                  </h3>
                  <button
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 hover:bg-gray-100 rounded-lg"
                    disabled={isLoading}
                  >
                    <FaTimes className="text-lg" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Star Rating */}
                  <motion.div
                    className="space-y-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                  >
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
                      />
                      <span
                        className="text-lg font-medium"
                        style={{ color: "var(--dim-gray)" }}
                      >
                        {rating > 0
                          ? `${rating.toFixed(1)} / 5`
                          : "Select rating"}
                      </span>
                    </div>
                  </motion.div>

                  {/* Comment */}
                  <motion.div
                    className="space-y-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                  >
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
                      maxLength={500}
                    />
                    <p className="text-sm" style={{ color: "var(--dim-gray)" }}>
                      {comment.length}/500 characters
                    </p>
                  </motion.div>

                  {/* Submit Buttons */}
                  <motion.div
                    className="flex gap-3 pt-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                  >
                    <button
                      type="submit"
                      disabled={rating === 0 || !comment.trim() || isLoading}
                      className="btn-primary flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transform transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <FaStar className="text-sm" />
                      )}
                      Submit Review
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={isLoading}
                      className="px-6 py-3 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 transform hover:scale-105 active:scale-95"
                    >
                      Cancel
                    </button>
                  </motion.div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddReviewModal;
