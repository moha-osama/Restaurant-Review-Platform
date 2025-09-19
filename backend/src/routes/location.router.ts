import { Router } from "express";
import { encodeLocation } from "../controllers/location.controller.js";

const locationRouter = Router();

locationRouter.get("/encode", encodeLocation);

export default locationRouter;