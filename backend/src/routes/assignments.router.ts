// POST   /api/experiments/:id/assign     -> assign a user to a variant (randomized or rule-based)
// GET    /api/users/:id/assignments      -> get all assignments for a user
// GET    /api/experiments/:id/assignments-> get assignments for an experiment

import { Router } from "express";
import {
  assignUserToVariant,
  getAllExperimentAssignments,
  getUsersExperimentAssignments,
} from "../controllers/assignments.controller.js";

const assignmentsRouter = Router();

assignmentsRouter.post("/:id", assignUserToVariant);
assignmentsRouter.get("/users/:id", getUsersExperimentAssignments);
assignmentsRouter.get("/experiments/:id", getAllExperimentAssignments);

export default assignmentsRouter;
