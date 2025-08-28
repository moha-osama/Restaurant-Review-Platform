import type { Request, Response } from "express";
import prisma from "../lib/client.js";

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

    const review = await prisma.review.create({
      data: {
        user_id: req.user.id as string,
        restaurant_id: restaurantId as string,
        comment,
        rating: numericRating,
        sentiment:
          sentimentData.label > 0
            ? sentimentData.score
            : sentimentData.score * -1,
        created_at: new Date(),
      },
    });

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
