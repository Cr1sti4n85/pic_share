import jwt from "jsonwebtoken";
import { promisify } from "util";
import AppError from "../utils/appError.js";
import Users from "../models/User.js";

//verifica token JW para rutas protegidas
export const verifyToken = async (req, res, next) => {
  let token = null;
  //uso de cookies
  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError("Debes iniciar sesión", 401, "failed"));
  }
  //se crea una promesa para verificar token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded);

  //Verificar si el usuario aun existe
  const currentUser = await Users.findByPk(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("El usuario no puede iniciar sesión.", 401, "failed")
    );
  }
  //Dar acceso a ruta protegida. Se pasa el request con el usuario al proximo middleware
  req.user = currentUser;
  res.locals.user = currentUser;

  next();
};

//para el login del sitio web
export const isLoggedIn = async (req, res, next) => {
  let token = null;
  if (req.cookies.jwt) {
    token = req.cookies.jwt;

    if (!token) {
      return next();
    }
    try {
      const decoded = await promisify(jwt.verify)(
        token,
        process.env.JWT_SECRET
      );
      //Verificar si el usuario aun existe
      const currentUser = await Users.findByPk(decoded.id);
      if (!currentUser) {
        return next();
      }
      req.user = currentUser;
      res.locals.user = currentUser;
      next();
    } catch (error) {
      next();
    }
  } else {
    next();
  }
};
