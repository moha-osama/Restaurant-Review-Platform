// POST   /api/events                     -> log an event (click, view, etc.)
// GET    /api/events                     -> list all events (admin only, maybe with filters)
// GET    /api/users/:id                  -> get all events for a user

import {
  listEvents,
  logEvent,
  getUserEvents,
} from "../controllers/events.controller.js";
import { Router } from "express";

const eventsRouter = Router();

eventsRouter.post("/", logEvent);
eventsRouter.get("/", listEvents);
eventsRouter.get("/users/:id", getUserEvents);

export default eventsRouter;
