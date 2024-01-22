import { Router } from "express";
import { check } from "express-validator";
import {
  createUser,
  updatePassword,
  updateUser,
} from "../controllers/userController.js";
import { validateFields } from "../middleware/validateFields.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { getMe } from "../middleware/getMyAccount.js";
import {
  allowSameEmail,
  emailExist,
  passwordsMatch,
} from "../middleware/validatorsDB.js";

const router = Router();

router.post(
  "/signup",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("apellido", "El apellido es obligatorio").not().isEmpty(),
    check(
      "email",
      "El correo es obligatorio y debe tener formato correcto"
    ).isEmail(),
    check(
      "password",
      "El password es obligatorio y debe tener al menos 8 caracteres"
    )
      .notEmpty()
      .isLength({ min: 8 }),
    check("passwordConfirm").custom(passwordsMatch),
    check("email").custom(emailExist),
    validateFields,
  ],
  createUser
);

router.put(
  "/my-profile",
  [
    verifyToken,
    getMe,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("apellido", "El apellido es obligatorio").not().isEmpty(),
    check(
      "email",
      "El correo es obligatorio y debe tener formato correcto"
    ).isEmail(),
    allowSameEmail,
    validateFields,
  ],
  updateUser
);

router.put(
  "/password",
  [
    verifyToken,
    getMe,
    check(
      "password",
      "El password es obligatorio y debe tener al menos 8 caracteres"
    )
      .notEmpty()
      .isLength({ min: 8 }),
    check("passwordConfirm").custom(passwordsMatch),
    validateFields,
  ],
  updatePassword
);

export default router;
