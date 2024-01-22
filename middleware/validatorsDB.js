import { Op } from "sequelize";
import Users from "../models/User.js";
import AppError from "../utils/appError.js";
export const emailExist = async (email) => {
  //verificar si correo existe
  const existeEmail = await Users.findOne({ where: { email } });
  if (existeEmail) {
    throw new Error(`Este correo ya está registrado.`);
  }
};

//el usuario puede usar el mismo correo cuando actualiza sus datos
export const allowSameEmail = async (req, res, next) => {
  const { id } = req.user;
  const { email } = req.body;
  const existeEmail = await Users.findOne({
    where: {
      email,
      id: {
        [Op.ne]: id,
      },
    },
  });
  if (existeEmail) {
    return next(
      new AppError(
        `Este correo está registrado con una cuenta de otro usuario.`
      )
    );
  }
  next();
};

//verifica que las contraseñas ingresadas sean las mismas
export const passwordsMatch = (value, { req }) => {
  if (value !== req.body.password) {
    throw new Error("Las contraseñas no coinciden.");
  }
  return true;
};
