import { Router } from "express";
import { userController } from "../controllers/userController.js";
import { authController } from "../controllers/authController.js";

const router = Router();

router.get("/users", authController.authorize, userController.getUserByAuth);
router.post("/users", userController.createUser);
router.patch("/users", authController.authorize, userController.updateUser);
router.delete("/users", authController.authorize, userController.deleteUser);

export const userRoutes = router;
