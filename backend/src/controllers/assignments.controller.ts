// POST   /api/experiments/:id/assign     -> assign a user to a variant (randomized or rule-based)
// GET    /api/users/:id/assignments      -> get all assignments for a user
// GET    /api/experiments/:id/assignments-> get assignments for an experiment

import { type Request, type Response } from "express";
import prisma from "../lib/client.js";
import { randomInt } from "crypto";

export async function assignUserToVariant(req: Request, res: Response) {
  try {
    const { userId, variantId } = req.body;
    const experimentId = req.params.id;

    if (!userId || !experimentId) {
      return res
        .status(400)
        .json({ error: "User ID and Experiment ID are required" });
    }

    // get all variants of this experiment
    const variants = await prisma.variant.findMany({
      where: { experiment_id: experimentId },
    });

    const randomVariant = variants[randomInt(0, variants.length)];

    if (randomVariant) {
      const assignment = await prisma.assignment.create({
        data: {
          user_id: userId,
          experiment_id: experimentId,
          variant_id: variantId,
        },
      });
      res.status(201).json(assignment);
    } else {
      throw new Error("No variants found for this experiment");
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to assign user to variant" });
  }
}

export async function getUsersExperimentAssignments(
  req: Request,
  res: Response
) {
  try {
    const userId = req.params.id;
    const experimentId = req.params.experimentId;

    if (!userId || !experimentId) {
      return res
        .status(400)
        .json({ error: "User ID and Experiment ID are required" });
    }

    const assignments = await prisma.assignment.findMany({
      where: { user_id: userId, experiment_id: experimentId },
    });

    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve user assignments" });
  }
}

export async function getAllExperimentAssignments(req: Request, res: Response) {
  const experimentId = req.params.id;

  try {
    if (experimentId) {
      const assignments = await prisma.assignment.findMany({
        where: { experiment_id: experimentId },
      });
      res.status(200).json(assignments);
    } else {
      res.status(400).json({ error: "Experiment ID is required" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to retrieve experiment assignments" });
  }
}
