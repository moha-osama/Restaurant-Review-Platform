import { FaUser, FaClock, FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { Rating } from "react-simple-star-rating";
import { useVote } from "../hooks/useVote";
import { useState, useEffect } from "react";
// import { useAuth } from "../hooks/useAuth";

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
  votes?: ReviewVote[];
}

interface ReviewVote {
  id: string;
  review_id: string;
  user_id: string;
  value: number;
  created_at: string;
  updated_at: string;
}

interface ReviewItemProps {
  review: Review;
  isOwnReview?: boolean;
}

const ReviewItem = ({ review, isOwnReview }: ReviewItemProps) => {
  const { voteReview, getUserVote, isVoting } = useVote();
  const [userVote, setUserVote] = useState<number | null>(null);
  const [voteCount, setVoteCount] = useState<{ up: number; down: number }>(() => {
    if (review.votes) {
      const upVotes = review.votes.filter(vote => vote.value === 1).length;
      const downVotes = review.votes.filter(vote => vote.value === -1).length;
      return { up: upVotes, down: downVotes };
    }
    return { up: 0, down: 0 };
  });

  // isOwnReview is now passed as a prop from ReviewsList

  useEffect(() => {
    const fetchUserVote = async () => {
      try {
        const currentVote = await getUserVote(review.restaurant_id, review.id);
        setUserVote(currentVote);
      } catch (error) {
        console.error('Error fetching user vote:', error);
        setUserVote(null);
      }
    };

    if (review.restaurant_id && review.id) {
      fetchUserVote();
    }
  }, [review.id, review.restaurant_id, getUserVote]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
    <div className={`${isOwnReview ? 'bg-gradient-to-br from-green-50 to-emerald-50' : ''} card border border-gray-100 shadow-lg p-6 hover:shadow-xl transition-all duration-300`}>
        <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center">
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
                {isOwnReview && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                    Your Review
                  </span>
                )}
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
        <div>
          <p
            className="text-base leading-relaxed font-light"
            style={{ color: "var(--dim-gray)" }}
          >
            {review.comment}
          </p>
        </div>
  {!isOwnReview && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-4">
              <button
                onClick={async () => {
                  if (!isVoting) {
                    const newVoteValue = userVote === 1 ? 0 : 1;
                    await voteReview(review.restaurant_id, review.id, newVoteValue);
                    setUserVote(newVoteValue === 0 ? null : newVoteValue);
                    setVoteCount(prev => ({
                      up: prev.up + (newVoteValue === 1 ? 1 : (userVote === 1 ? -1 : 0)),
                      down: prev.down + (newVoteValue === 1 ? 0 : (userVote === -1 ? -1 : 0))
                    }));
                  }
                }}
                disabled={isVoting}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  userVote === 1
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
                } ${isVoting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <FaThumbsUp className={`text-sm ${userVote === 1 ? 'text-green-600' : 'text-gray-500'}`} />
                <span className="font-medium">{voteCount.up}</span>
              </button>
              <button
                onClick={async () => {
                  if (!isVoting) {
                    const newVoteValue = userVote === -1 ? 0 : -1;
                    await voteReview(review.restaurant_id, review.id, newVoteValue);
                    setUserVote(newVoteValue === 0 ? null : newVoteValue);
                    setVoteCount(prev => ({
                      up: prev.up + (newVoteValue === -1 ? 0 : (userVote === 1 ? -1 : 0)),
                      down: prev.down + (newVoteValue === -1 ? 1 : (userVote === -1 ? -1 : 0))
                    }));
                  }
                }}
                disabled={isVoting}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  userVote === -1
                    ? 'bg-red-100 text-red-700 border border-red-300'
                    : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
                } ${isVoting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <FaThumbsDown className={`text-sm ${userVote === -1 ? 'text-red-600' : 'text-gray-500'}`} />
                <span className="font-medium">{voteCount.down}</span>
              </button>
            </div>
            <div className="text-sm font-medium text-gray-600">
              Score: {voteCount.up - voteCount.down}
            </div>
          </div>
        )}
  {isOwnReview && (voteCount.up > 0 || voteCount.down > 0) && (
          <div className="flex items-center justify-end pt-4 border-t border-gray-200">
            <div className="text-sm font-medium text-gray-600">
              Score: {voteCount.up - voteCount.down}
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default ReviewItem;
