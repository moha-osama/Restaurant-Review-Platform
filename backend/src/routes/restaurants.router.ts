import { Router } from "express";
import { auth, requireRole } from "../middleware/auth.js";
import {
  addRestaurant,
  listRestaurants,
  getRestaurantDetails,
  updateRestaurant,
  deleteRestaurant,
} from "../controllers/restaurants.controller.js";

const restaurantRouter = Router();

restaurantRouter.post("/", auth, requireRole("owner"), addRestaurant);
restaurantRouter.get("/", listRestaurants);
restaurantRouter.get("/:id", getRestaurantDetails);
restaurantRouter.put("/:id", auth, requireRole("owner"), updateRestaurant);
restaurantRouter.delete("/:id", auth, requireRole("owner"), deleteRestaurant);

export default restaurantRouter;
