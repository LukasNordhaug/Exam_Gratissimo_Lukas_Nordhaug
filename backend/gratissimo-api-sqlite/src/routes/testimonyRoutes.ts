import { Router } from "express";
import { testimonyController } from "../controllers/testimonyController.js";
const router = Router();

router.get("/testimony", testimonyController.getAllTestimonies);

export const testimonyRoutes = router;
