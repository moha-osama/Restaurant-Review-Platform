// POST   /api/experiments/:id/variants   -> create variant for experiment
// GET    /api/experiments/:id/variants   -> list variants of experiment
// GET    /api/variants/:id               -> get variant by ID
// PUT    /api/variants/:id               -> update variant
// DELETE /api/variants/:id               -> delete variant

import { Router } from "express";
import {
  getVariant,
  updateVariant,
  deleteVariant,
  listVariants,
  createVariant,
} from "../controllers/variants.controller.js";

const variantsRouter = Router();

variantsRouter.post("/", createVariant);
variantsRouter.get("/", listVariants);
variantsRouter.get("/:id", getVariant);
variantsRouter.put("/:id", updateVariant);
variantsRouter.delete("/:id", deleteVariant);

export default variantsRouter;
