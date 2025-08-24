// POST   /api/experiments                -> create experiment
// GET    /api/experiments                -> list all experiments
// GET    /api/experiments/:id            -> get experiment by ID
// PUT    /api/experiments/:id            -> update experiment
// DELETE /api/experiments/:id            -> delete experiment

import { Router } from "express";
import {
  createExperiment,
  listExperiments,
  getExperimentById,
  updateExperiment,
  deleteExperiment,
} from "../controllers/experiments.controller.js";

const experimentsRouter = Router();

experimentsRouter.post("/", createExperiment);
experimentsRouter.get("/", listExperiments);
experimentsRouter.get("/:id", getExperimentById);
experimentsRouter.put("/:id", updateExperiment);
experimentsRouter.delete("/:id", deleteExperiment);

export default experimentsRouter;
