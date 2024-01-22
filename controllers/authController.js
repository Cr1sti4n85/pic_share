import bcrypt from "bcrypt";
import { createToken } from "../utils/createToken.js";
import Users from "../models/User.js";
import AppError from "../utils/appError.js";

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  //busca usuario por email
  try {
    let user = await Users.findOne({
      where: { email: email },
    });
    if (!user) {
      return next(
        new AppError("Usuario o password no son correctos", 400, "failed")
      );
    }

    //verificar la password
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return next(
        new AppError("Usuario o password no son correctos", 400, "failed")
      );
    }

    //generar token
    const token = createToken(user.id);
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
    res.cookie("jwt", token, cookieOptions);

    //se envia usuario con información filtrada
    user = { nombre: user.nombre, apellido: user.apellido, email: user.email };
    res.status(201).json({
      status: "success",
      msg: "Has iniciado sesión.",
    });
  } catch (error) {
    return next(
      new AppError("Error al intentar iniciar sesión. Intente más tarde")
    );
  }
};

//el logout redirecciona al inicio. Se usa secret erroneo para que el jwt no funcione
export const logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expire: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.redirect("/");
};
