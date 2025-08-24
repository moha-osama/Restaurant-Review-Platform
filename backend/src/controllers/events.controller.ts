// POST   /api/events                     -> log an event (click, view, etc.)
// GET    /api/events                     -> list all events (admin only, maybe with filters)
// GET    /api/users/:id/events           -> get all events for a user

import { type Request, type Response } from "express";
import prisma from "../lib/client.js";

export async function logEvent(req: Request, res: Response) {
  try {
    const {
      eventName,
      userId,
      timeStamp,
      eventProperties,
      experimentId,
      variantId,
      deviceType,
      platform,
    } = req.body;

    const event = await prisma.events.create({
      data: {
        event_name: eventName,
        user_id: userId,
        timestamp: timeStamp,
        event_properties: eventProperties,
        experiment_id: experimentId,
        variant_id: variantId,
        device_type: deviceType,
        platform: platform,
      },
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: "Failed to log event" });
  }
}

export async function listEvents(req: Request, res: Response) {
  try {
    const events = await prisma.events.findMany();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve events" });
  }
}

export async function getUserEvents(req: Request, res: Response) {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const events = await prisma.events.findMany({
      where: { user_id: userId },
    });

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve user events" });
  }
}
