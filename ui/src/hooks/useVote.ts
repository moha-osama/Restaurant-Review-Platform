import { useState } from 'react';
import { useAuth } from './useAuth';

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

interface VoteResponse {
  vote: {
    id: string;
    review_id: string;
    user_id: string;
    value: number;
    created_at: string;
    updated_at: string;
  };
}

export const useVote = () => {
  const [isVoting, setIsVoting] = useState(false);
  const { user } = useAuth();

  const voteReview = async (
    restaurantId: string,
    reviewId: string,
    value: 1 | -1 | 0
  ): Promise<VoteResponse | null> => {
    if (!user) {
      throw new Error('User must be logged in to vote');
    }
    setIsVoting(true);
    try {
      const response = await fetch(
        `${BASE_API_URL}restaurants/${restaurantId}/reviews/${reviewId}/vote`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ value }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to vote on review');
      }

      const data: VoteResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error voting on review:', error);
      throw error;
    } finally {
      setIsVoting(false);
    }
  };

  const getUserVote = async (
    restaurantId: string,
    reviewId: string
  ): Promise<number | null> => {
    if (!user) {
      return null;
    }

    try {
      const response = await fetch(
        `${BASE_API_URL}restaurants/${restaurantId}/reviews/${reviewId}/vote`,
        {
            credentials: 'include',
        }
      );

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      // Check if data.vote exists and has a value property
      return data.vote && typeof data.vote.value === 'number' ? data.vote.value : null;
    } catch (error) {
      console.error('Error getting user vote:', error);
      return null;
    }
  };

  return {
    voteReview,
    getUserVote,
    isVoting,
  };
};
