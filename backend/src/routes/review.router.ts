import { Router } from "express";
import { auth, requireRole } from "../middleware/auth.js";
import {
  addReview,
  listReviews,
  deleteReview,
} from "../controllers/review.controller.js";

const reviewRouter = Router();

reviewRouter.post(
  "/:id/reviews",
  auth,
  requireRole("user", "admin", "owner"),
  addReview
);

reviewRouter.get(
  "/:id/reviews",
  auth,
  requireRole("user", "admin", "owner"),
  listReviews
);

reviewRouter.delete(
  "/:id/reviews/:reviewId",
  auth,
  requireRole("user", "admin", "owner"),
  deleteReview
);

export default reviewRouter;
