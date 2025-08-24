// POST   /api/experiments/:id/variants   -> create variant for experiment
// GET    /api/experiments/:id/variants   -> list variants of experiment
// GET    /api/variants/:id               -> get variant by ID
// PUT    /api/variants/:id               -> update variant
// DELETE /api/variants/:id               -> delete variant

import { type Request, type Response } from "express";
import prisma from "../lib/client.js";

export async function createVariant(req: Request, res: Response) {
  try {
    const experimentId = req.params.id;
    const { name, description } = req.body;

    const variant = await prisma.variant.create({
      data: {
        name,
        description,
        experiment: { connect: { id: experimentId } },
      },
    });

    res.status(201).json(variant);
  } catch (error) {
    res.status(500).json({ error: "Failed to create variant" });
  }
}

export async function listVariants(req: Request, res: Response) {
  try {
    const experimentId = req.params.id;
    if (experimentId) {
      const variants = await prisma.variant.findMany({
        where: { experiment_id: experimentId },
      });
      res.status(200).json(variants);
    } else {
      throw new Error("Experiment ID is required");
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to list variants" });
  }
}

export async function getVariant(req: Request, res: Response) {
  try {
    const variantId = req.params.id;
    const variant = await prisma.variant.findUnique({
      where: { id: variantId },
    });
    if (variant) {
      res.status(200).json(variant);
    } else {
      res.status(404).json({ error: "Variant not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to get variant" });
  }
}

export async function updateVariant(req: Request, res: Response) {
  try {
    const variantId = req.params.id;
    const { name, description } = req.body;

    const variant = await prisma.variant.update({
      where: { id: variantId },
      data: { name, description },
    });

    res.status(200).json(variant);
  } catch (error) {
    res.status(500).json({ error: "Failed to update variant" });
  }
}

export async function deleteVariant(req: Request, res: Response) {
  try {
    const variantId = req.params.id;

    await prisma.variant.delete({
      where: { id: variantId },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete variant" });
  }
}
