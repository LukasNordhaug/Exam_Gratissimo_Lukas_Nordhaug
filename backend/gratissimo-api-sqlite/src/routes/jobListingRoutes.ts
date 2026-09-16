import { Router } from "express";
import { jobListingController } from "../controllers/jobListingController.js";
import { authController } from "../controllers/authController.js";

const router = Router();

router.get("/job-listings", jobListingController.getAllJobListings);
router.get("/job-listings/:id", jobListingController.getJobListingById);
router.post(
  "/job-listings",
  authController.authorize,
  jobListingController.createJobListing,
);
router.put(
  "/job-listings/:id",
  authController.authorize,
  jobListingController.updateJobListing,
);
router.delete(
  "/job-listings/:id",
  authController.authorize,
  jobListingController.deleteJobListing,
);

export const jobListingRoutes = router;
