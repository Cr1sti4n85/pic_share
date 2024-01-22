import { Router } from "express";
import { check } from "express-validator";
import { validateFields } from "../middleware/validateFields.js";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  createComment,
  deleteComment,
  getComments,
  updateComment,
} from "../controllers/commentController.js";

const router = Router({ mergeParams: true });

router.get("/", verifyToken, getComments);

router.post(
  "/",
  [
    verifyToken,
    check("contenido", "El contenido es obligatorio").not().isEmpty(),
    validateFields,
  ],
  createComment
);

router.put(
  "/:commentId",
  [
    verifyToken,
    check("contenido", "El contenido es obligatorio").not().isEmpty(),
    validateFields,
  ],
  updateComment
);

router.delete("/:commentId", verifyToken, deleteComment);

export default router;
