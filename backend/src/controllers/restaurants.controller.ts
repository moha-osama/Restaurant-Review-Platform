import { type Request, type Response } from "express";
import prisma from "../lib/client.js";
import validator from "validator";
import {
  getValue,
  setValue,
  deleteData,
  deletePattern,
  setValueWithTTL,
} from "../lib/redis-client.js";
import { trackEvent } from "../services/eventTracker.js";

export async function addRestaurant(req: Request, res: Response) {
  try {
    const { name, location } = req.body;

    if (!validator.isLength(name, { min: 3, max: 100 })) {
      return res
        .status(400)
        .json({ error: "Name must be between 3 and 100 characters" });
    }

    if (!validator.isLength(location, { min: 3, max: 100 })) {
      return res
        .status(400)
        .json({ error: "Location must be between 3 and 100 characters" });
    }

    const restaurant = await prisma.restaurant.create({
      data: {
        name,
        location,
        owner_id: req.user?.id,
      },
    });
    await deletePattern("top-restaurants-*");
    res.status(201).json(restaurant);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to add restaurant";
    res.status(400).json({ error: errorMessage });
  }
}

export async function listRestaurants(req: Request, res: Response) {
  try {
    const restaurants = await prisma.restaurant.findMany({
      include: {
        reviews: true,
      },
    });

    const result = restaurants.map((r) => {
      const avgRating =
        r.reviews.length > 0
          ? r.reviews.reduce((sum, rev) => sum + Number(rev.rating), 0) /
            r.reviews.length
          : null;
      // Placeholder for sentiment analysis
      const avgSentiment =
        r.reviews.length > 0
          ? r.reviews.reduce(
              (sum, rev) => sum + Number(rev.sentiment || 0),
              0
            ) / r.reviews.length
          : null;
      return {
        ...r,
        avgRating,
        avgSentiment,
        reviews: undefined,
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to list restaurants" });
  }
}

// Get restaurant details + reviews + leaderboard rank
export async function getRestaurantDetails(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const clientIp = req.ipAddress;
    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
      include: { reviews: true },
    });

    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    // Calculate leaderboard rank by avg rating
    const all = await prisma.restaurant.findMany({
      include: { reviews: true },
    });
    const avgRatings = all.map((r) => ({
      id: r.id,
      avg:
        r.reviews.length > 0
          ? r.reviews.reduce((sum, rev) => sum + Number(rev.rating), 0) /
            r.reviews.length
          : 0,
    }));
    avgRatings.sort((a, b) => b.avg - a.avg);
    const rank = avgRatings.findIndex((r) => r.id === restaurant.id) + 1;

    trackEvent({
      event_name: "restaurant_viewed", 
      user_id: req.user?req.user?.id:'Guest', 
      session_id: req.session_id,
      event_properties: {
        restaurant_id: id, 
        client_ip: clientIp
      }
    })

    res.json({ ...restaurant, leaderboardRank: rank });
  } catch (error) {
    res.status(500).json({ error: "Failed to get restaurant details" });
  }
}

// Update restaurant (owner/admin)
export async function updateRestaurant(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const { name, location } = req.body;

    if (!validator.isLength(name, { min: 3, max: 100 })) {
      return res
        .status(400)
        .json({ error: "Name must be between 3 and 100 characters" });
    }

    if (!validator.isLength(location, { min: 3, max: 100 })) {
      return res
        .status(400)
        .json({ error: "Location must be between 3 and 100 characters" });
    }

    const restaurant = await prisma.restaurant.update({
      where: { id },
      data: { name, location },
    });

    await deletePattern("top-restaurants-*");
    await deleteData(`restaurant-${id}`);

    res.status(200).json(restaurant);
  } catch (error) {
    res.status(400).json({ error: "Failed to update restaurant" });
  }
}

// Delete restaurant (owner/admin)
export async function deleteRestaurant(req: Request, res: Response) {
  try {
    const id = req.params.id;
    await prisma.restaurant.delete({ where: { id } });
    await deletePattern("top-restaurants-*");
    await deleteData(`restaurant-${id}`);
    res.json({ message: "Restaurant deleted" });
  } catch (error) {
    res.status(400).json({ error: "Failed to delete restaurant" });
  }
}

// Get restaurants owned by the current user
export async function getUserRestaurants(req: Request, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const restaurants = await prisma.restaurant.findMany({
      where: { owner_id: userId },
      include: {
        reviews: true,
      },
    });

    const result = restaurants.map((r) => {
      const avgRating =
        r.reviews.length > 0
          ? r.reviews.reduce((sum, rev) => sum + Number(rev.rating), 0) /
            r.reviews.length
          : null;
      const avgSentiment =
        r.reviews.length > 0
          ? r.reviews.reduce(
              (sum, rev) => sum + Number(rev.sentiment || 0),
              0
            ) / r.reviews.length
          : null;
      return {
        ...r,
        avgRating,
        avgSentiment,
        reviews: undefined,
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user restaurants" });
  }
}

export async function getTopRestaurants(req: Request, res: Response) {
  try {
    const count = req.params.count ? parseInt(req.params.count) : 1;
    const cacheKey = `top-restaurants-${count}`;
    const cachedData = await getValue(cacheKey);
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      return res.status(200).json({ cachedData: true, parsedData });
    } else {
      const topRestaurants = await prisma.restaurant.findMany({
        orderBy: {
          avg_rating: "desc",
        },
        take: count,
      });
      // await setValue(cacheKey, JSON.stringify(topRestaurants));
      await setValueWithTTL(cacheKey, JSON.stringify(topRestaurants), 300);

      res.status(200).json({ cachedData: false, parsedData: topRestaurants });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch top restaurants" });
  }
}

export async function getGlobalRestaurants(req: Request, res: Response) {
  const {radius, lat, lon} = req.body
  const count = req.params.count ? parseInt(req.params.count) : 10;

  if (!radius || !lat || !lon) {
    return res.status(400).json({ error: "radius, lat, and lon are required in the request body" });
  }
    
  const query = `
    [out:json];
    (
      node["amenity"="restaurant"](around:${radius},${lat},${lon});
      way["amenity"="restaurant"](around:${radius},${lat},${lon});
      relation["amenity"="restaurant"](around:${radius},${lat},${lon});
    );
    out center ${count};
  `; 

    const url = "https://overpass-api.de/api/interpreter";

    const response = await fetch(url, {
    method: "POST",
    body: query,
  });

  if (!response.ok) {
    throw new Error("Overpass API request failed: " + response.statusText);
  }

  const data = await response.json();

  const restaurants = data.elements.map((el: any) => {
    let lat = el.lat || (el.center && el.center.lat);
    let lon = el.lon || (el.center && el.center.lon);

    let name = el.tags?.['name:en'] || el.tags?.name || "Unnamed";
    return {
      id: el.id,
      name,
      cuisine: el.tags?.cuisine || "Unknown",
      lat,
      lon
    };
  });
    res.status(200).json(restaurants);
}