import Users from "../models/User.js";
import AppError from "../utils/appError.js";
import { encrypt } from "../utils/encrypt.js";

export const createUser = async (req, res, next) => {
  const { nombre, apellido, email } = req.body;

  const password = encrypt(req.body.password);

  const newUser = await Users.create({ nombre, apellido, email, password });
  res.status(201).json({
    status: "success",
    msg: "Usuario creado exitosamente",
    newUser,
  });
  try {
  } catch (error) {
    return next(
      new AppError(
        "Se generó un problema al crear al usuario. Intente más tarde"
      )
    );
  }
};

export const updateUser = async (req, res, next) => {
  const { id } = req.params;
  const { nombre, apellido, email } = req.body;

  try {
    //se actualiza usuario en base a su id
    await Users.update(
      {
        nombre,
        apellido,
        email,
      },
      {
        where: {
          id,
        },
      }
    );

    res.status(200).json({
      status: "success",
      msg: "Usuario actualizado exitosamente",
    });
  } catch (error) {
    return next(
      new AppError(
        "Se generó un problema al actualizar al usuario. Intente más tarde"
      )
    );
  }
};

export const updatePassword = async (req, res, next) => {
  const { id } = req.params;

  //Se cifra contraseña
  const password = encrypt(req.body.password);

  try {
    await Users.update(
      {
        password,
      },
      {
        where: {
          id,
        },
      }
    );

    res.status(200).json({
      status: "success",
      msg: "La contraseña se ha actualizado.",
    });
  } catch (error) {
    return next(
      new AppError(
        "Se generó un problema al actualizar la contraseña. Intente más tarde"
      )
    );
  }
};

//se deberia hacer borrado logico
//export const deleteUser = async (req, res, next) => {};
