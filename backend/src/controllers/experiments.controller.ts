// POST   /api/experiments                -> create experiment
// GET    /api/experiments                -> list all experiments
// GET    /api/experiments/:id            -> get experiment by ID
// PUT    /api/experiments/:id            -> update experiment
// DELETE /api/experiments/:id            -> delete experiment

import { type Request, type Response } from "express";
import prisma from "../lib/client.js";

export async function createExperiment(req: Request, res: Response) {
  try {
    const { name, description, start_date, end_date } = req.body;
    const experiment = await prisma.experiment.create({
      data: { name, description, start_date, end_date },
    });
    res.status(201).json(experiment);
  } catch (error) {
    res.status(500).json({ error: "Failed to create experiment" });
  }
}

export async function listExperiments(req: Request, res: Response) {
  try {
    const experiments = await prisma.experiment.findMany();
    res.json(experiments);
  } catch (error) {
    res.status(500).json({ error: "Failed to list experiments" });
  }
}

export async function getExperimentById(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const experiment = await prisma.experiment.findUnique({
      where: { id },
    });

    if (!experiment) {
      return res.status(404).json({ error: "Experiment not found" });
    }

    res.json(experiment);
  } catch (error) {
    res.status(500).json({ error: "Failed to get experiment" });
  }
}

export async function updateExperiment(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const { name, description, start_date, end_date } = req.body;

    const experiment = await prisma.experiment.update({
      where: { id },
      data: { name, description, start_date, end_date },
    });

    res.json(experiment);
  } catch (error) {
    res.status(500).json({ error: "Failed to update experiment" });
  }
}

export async function deleteExperiment(req: Request, res: Response) {
  try {
    const id = req.params.id;
    await prisma.experiment.delete({ where: { id } });
    res.json({ message: "Experiment deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete experiment" });
  }
}
