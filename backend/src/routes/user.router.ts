import { Router } from "express";
import {
  getAllUsers,
  signupUser,
  loginUser,
  logoutAllUser,
  logoutUser,
  getUserById,
  getCurrentUserProfile,
} from "../controllers/user.controller.js";
import { listUserReviews } from "../controllers/review.controller.js";
import { auth, requireRole } from "../middleware/auth.js";

const userRouter = Router();

userRouter.get("/", auth, requireRole("admin"), getAllUsers);
userRouter.get("/profile", auth, getCurrentUserProfile);
userRouter.get("/:id", auth, getUserById);
userRouter.post("/", signupUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", auth, logoutUser);
userRouter.post("/logoutAllUser", auth, logoutAllUser);
userRouter.get(
  "/:id/reviews",
  auth,
  requireRole("user", "admin", "owner"),
  listUserReviews
);

export default userRouter;
