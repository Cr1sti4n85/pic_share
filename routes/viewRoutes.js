import { Router } from "express";
import { verifyToken, isLoggedIn } from "../middleware/verifyToken.js";
import {
  getLogin,
  getMyPosts,
  getOverview,
  getProfile,
  getSignupForm,
} from "../controllers/viewController.js";

const router = Router();

router.get("/", isLoggedIn, getLogin);

router.get("/signup", getSignupForm);

router.get("/posts", verifyToken, getOverview);

router.get("/posts/my-posts", verifyToken, getMyPosts);

router.get("/my-profile", verifyToken, getProfile);

export default router;
