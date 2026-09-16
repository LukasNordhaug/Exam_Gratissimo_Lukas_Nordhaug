import { Router } from "express";
import { newsletterSubscriberController } from "../controllers/newsletterSubscriberController.js";
import { authController } from "../controllers/authController.js";

const router = Router();

router.get(
  "/newsletter",
  newsletterSubscriberController.getAllNewsletterSubscribers,
);
router.get(
  "/newsletter/:id",
  newsletterSubscriberController.getNewsletterSubscriberById,
);
router.post(
  "/newsletter",
  authController.authorize,
  newsletterSubscriberController.createNewsletterSubscriber,
);
router.put(
  "/newsletter/:id",
  authController.authorize,
  newsletterSubscriberController.updateNewsletterSubscriber,
);
router.delete(
  "/newsletter/:id",
  authController.authorize,
  newsletterSubscriberController.deleteNewsletterSubscriber,
);

export const newsletterSubscriberRoutes = router;
