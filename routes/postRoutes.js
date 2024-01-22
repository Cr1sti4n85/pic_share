import { Router } from "express";
import { check } from "express-validator";
import { validateFields } from "../middleware/validateFields.js";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  createPost,
  updatePost,
  deletePost,
  getPosts,
  getMyPosts,
} from "../controllers/postController.js";
import commentRouter from "./commentRoutes.js";

const router = Router();

router.use("/:postId/comments", commentRouter);

router.get("/", verifyToken, getPosts);
router.get("/my-posts", verifyToken, getMyPosts);

router.post(
  "/",
  [
    verifyToken,
    check("titulo", "El titulo es obligatorio").not().isEmpty(),
    check("descripcion", "La descripción es obligatoria").not().isEmpty(),
    validateFields,
  ],
  createPost
);

router.put(
  "/:postId",
  [
    verifyToken,
    check("titulo", "El titulo es obligatorio").not().isEmpty(),
    check("descripcion", "La descripción es obligatoria").not().isEmpty(),
    validateFields,
  ],
  updatePost
);

router.delete("/:postId", verifyToken, deletePost);

export default router;
