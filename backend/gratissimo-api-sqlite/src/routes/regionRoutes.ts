import { Router } from "express";
import { regionController } from "../controllers/regionController.js";

const router = Router();

router.get("/regions", regionController.getAllRegions);
router.get("/regions/:id", regionController.getRegionById);

export const regionRoutes = router;
