import { Router } from "express";
import { auth, requireRole } from "../middleware/auth.js";
import {
  addRestaurant,
  listRestaurants,
  getRestaurantDetails,
  updateRestaurant,
  deleteRestaurant,
  getUserRestaurants,
} from "../controllers/restaurants.controller.js";

const restaurantRouter = Router();

restaurantRouter.post("/", auth, requireRole("owner"), addRestaurant);
restaurantRouter.get("/", listRestaurants);
restaurantRouter.get("/my-restaurants", auth, requireRole("owner"), getUserRestaurants);
restaurantRouter.put("/:id", auth, requireRole("owner"), updateRestaurant);
restaurantRouter.delete("/:id", auth, requireRole("owner"), deleteRestaurant);
restaurantRouter.get("/:id", getRestaurantDetails);

export default restaurantRouter;
