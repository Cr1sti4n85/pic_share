import { Router } from "express";
import { check } from "express-validator";
import { validateFields } from "../middleware/validateFields.js";
import { login, logout } from "../controllers/authController.js";

const router = Router();
//uso de middleware de express-validator
router.post(
  "/login",
  [
    check(
      "email",
      "El correo es obligatorio y debe tener formato correcto"
    ).isEmail(),
    check("password", "El password es obligatorio").not().isEmpty(),
    validateFields,
  ],
  login
);

router.get("/logout", logout);

export default router;
