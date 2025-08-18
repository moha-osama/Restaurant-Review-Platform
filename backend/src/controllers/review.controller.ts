import type { Request, Response } from "express";
import prisma from "../lib/client.js";

// POST /restaurants/:id/reviews
// → Add a review.
// → Call NLP microservice → get sentiment score → save in DB.
// → Update leaderboard in Redis.

// GET /restaurants/:id/reviews → List reviews for a restaurant.

// DELETE /reviews/:id → Delete review (owner/admin).

export async function addReview(req: Request, res: Response) {
  try {
    const { id: restaurantId } = req.params;

    const { comment, rating } = req.body;
    // TODO: Call NLP microservice to get sentiment score
    const sentiment = 0; // Replace with actual sentiment score from NLP service

    const numericRating = Number(rating);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res
        .status(400)
        .json({ error: "Rating must be a number between 1 and 5" });
    }

    const review = await prisma.review.create({
      data: {
        user_id: req.user.id as string,
        restaurant_id: restaurantId as string,
        comment,
        rating: numericRating,
        sentiment: Number(sentiment),
        created_at: new Date(),
      },
    });
    res.status(201).json(review);
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function listReviews(req: Request, res: Response) {
  try {
    const { id: restaurantId } = req.params;

    const reviews = await prisma.review.findMany({
      where: { restaurant_id: restaurantId as string },
      include: {
        user: {
          select: {
            id: true,
            name: true,
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
