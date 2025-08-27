import type { Request, Response } from "express";
import prisma from "../lib/client.js";
import { trackEvent } from "../services/eventTracker.js";

const sentimentServiceUrl = process.env.SENTIMENT_SERVICE_URL;

export async function addReview(req: Request, res: Response) {
  try {
    const { id: restaurantId } = req.params;

    const { comment, rating } = req.body;
    const numericRating = Number(rating);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res
        .status(400)
        .json({ error: "Rating must be a number between 1 and 5" });
    }

    //Call NLP microservice to get sentiment score
    let sentimentData = { label: 0, score: 0 };
    try {
      const response = await fetch(`${sentimentServiceUrl}analyze`, {
        body: JSON.stringify({ text: comment }),
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (response.status !== 200) {
      }
    } catch (error) {}

    // calculate avg-rating for restaurant
    const restaurantReviews = await prisma.review.findMany({
      where: { restaurant_id: restaurantId as string },
    });

    const avgRating =
      restaurantReviews.reduce(
        (acc, review) => acc + Number(review.rating),
        0
      ) / restaurantReviews.length;
    //
    const updateRestaurant = await prisma.restaurant.update({
      where: { id: restaurantId as string },
      data: { avg_rating: avgRating },
    });


    const sentiment = sentimentData.label > 0 ? sentimentData.score : sentimentData.score * -1

    const review = await prisma.review.create({
      data: {
        user_id: req.user.id as string,
        restaurant_id: restaurantId as string,
        comment,
        rating: numericRating,
        sentiment: sentiment,
        created_at: new Date(),
      },
    });
    
    trackEvent({
      event_name: "review_created",
      user_id: req.user.id as string,
      event_properties: {
        restaurant_id: restaurantId, 
        review_id: review.id,
        sentiment: sentiment
      }
    })

    res.status(201).json({ review, updateRestaurant });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function listReviews(req: Request, res: Response) {
  try {
    const { id: restaurantId } = req.params;

    if (!restaurantId) {
      return res.status(400).json({ error: "Restaurant ID is required" });
    }

    const reviews = await prisma.review.findMany({
      where: { restaurant_id: restaurantId as string },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        votes: {
          select: {
            id: true,
            review_id: true,
            user_id: true,
            value: true,
            created_at: true,
            updated_at: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error listing reviews:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function listUserReviews(req: Request, res: Response) {
  try {
    const { id: userId } = req.params;

    const reviews = await prisma.review.findMany({
      where: { user_id: userId as string },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        votes: {
          select: {
            id: true,
            review_id: true,
            user_id: true,
            value: true,
            created_at: true,
            updated_at: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error listing user reviews:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function deleteReview(req: Request, res: Response) {
  try {
    const { reviewId: reviewId, restaurantId: restaurantId } = req.params;

    const review = await prisma.review.findUnique({
      where: { id: reviewId as string },
    });

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    await prisma.review.delete({
      where: { id: reviewId as string },
    });

    res.status(202).send("Deleted review successfully");
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}


export async function voteReview(req: Request, res: Response) {
  try {
    const { reviewId, restaurantId } = req.params;
    const { value } = req.body;

    const userId = req.user.id as string;

    if (![-1, 0, 1].includes(value)) {
      return res.status(400).json({ error: "Invalid vote value" });
    }

    if (!reviewId || !userId) {
      return res.status(400).json({ error: "Review ID and User ID are required" });
    }

    // Check if user is trying to vote on their own review
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      select: { user_id: true }
    });

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    if (review.user_id === userId) {
      return res.status(403).json({ error: "You cannot vote on your own review" });
    }

    if (value === 0) {
      // Remove the vote
      await prisma.reviewVote.deleteMany({
        where: { 
          review_id: reviewId,
          user_id: userId 
        },
      });
      res.status(200).json({ message: "Vote removed successfully" });
    } else {
      // Create or update the vote
      const vote = await prisma.reviewVote.upsert({
        where: { review_id_user_id: { review_id: reviewId, user_id: userId } },
        update: { value },
        create: { review_id: reviewId, user_id: userId, value },
      });
      res.status(200).json({ vote });
    }
  } catch (error) {
    console.error("Error voting review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getUserVote(req: Request, res: Response) {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id as string;

    if (!reviewId || !userId) {
      return res.status(400).json({ error: "Review ID and User ID are required" });
    }

    const vote = await prisma.reviewVote.findUnique({
      where: { review_id_user_id: { review_id: reviewId, user_id: userId } },
    });

    // Return consistent structure - if no vote exists, return null for the vote
    res.status(200).json({ vote: vote || null });
  } catch (error) {
    console.error("Error getting user vote:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}