import { validationResult } from "express-validator";
import AppError from "../utils/appError.js";

//validador de express-validator
export const validateFields = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new AppError(errors.errors[0].msg, 400, "failed"));
  }

  next();
};
