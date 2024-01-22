import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import Users from "../models/User.js";
import AppError from "../utils/appError.js";
import { getPagination } from "../utils/pagination.js";

export const getComments = async (req, res, next) => {
  // const { page, size } = req.query;
  const { id, rol } = req.user;
  const { postId } = req.params;
  // const { limit, offset } = getPagination(page, size);

  try {
    //obtiene comentarios incluyendo informacion de los usuarios
    const comments = await Comment.findAll({
      // offset,
      // limit,
      where: { post_id: postId },
      include: {
        model: Users,
        attributes: ["nombre", "apellido", "img_perfil"],
      },
    });

    res.status(200).json({
      comments,
      commentsAmmount: comments.length,
      id,
      rol,
    });
  } catch (error) {
    next(new AppError("No se pudo realizar la solicitud"));
  }
};

export const createComment = async (req, res, next) => {
  const { id } = req.user;
  const { postId } = req.params;
  const { contenido } = req.body;

  try {
    //se obtiene el id del user y el id de la publicación para crear el comentario
    const post = await Post.findByPk(postId);
    const user = await Users.findByPk(id);
    if (!post) {
      return next(new AppError("No existe este post", 404, "failed"));
    }

    if (!user) {
      return next(new AppError("No existe el usuario", 404, "failed"));
    }

    const newComment = await Comment.create({
      contenido,
      post_id: postId,
      user_id: id,
    });
    res.status(200).json({
      status: "success",
      msg: "Se ha añadido tu comentario a la publicación",
      newComment,
    });
  } catch (error) {
    console.log(error);
    next(new AppError("Hubo un problema al publicar tu comentario"));
  }
};

export const updateComment = async (req, res, next) => {
  const { id, rol } = req.user;
  const { commentId } = req.params;
  const { contenido } = req.body;

  try {
    //se busca comentario por su id
    const comment = await Comment.findOne({
      where: { id: commentId },
    });

    //permite que un usuario solo modifique el comentario si es propietario o administrador
    if (id !== comment.user_id && rol !== "admin") {
      return next(
        new AppError("No puedes editar este comentario", 403, "failed")
      );
    }

    await comment.update({ contenido });
    res.status(200).json({
      status: "success",
      msg: "Comentario actualizado",
      comment,
    });
  } catch (error) {
    console.log(error);
    next(new AppError("Hubo un problema editar tu comentario"));
  }
};

export const deleteComment = async (req, res, next) => {
  const { id, rol } = req.user;
  const { commentId } = req.params;
  try {
    //borra comentario por id
    const comment = await Comment.findOne({
      where: { id: commentId },
    });
    if (id !== comment.user_id && rol !== "admin") {
      return next(
        new AppError("No puedes eliminar este comentario", 403, "failed")
      );
    }

    await comment.destroy();
    res.status(200).json({
      status: "success",
      msg: "Comentario eliminado exitosamente",
    });
  } catch (error) {
    console.log(error);
    next(new AppError("Hubo un problema intentar borrar tu comentario"));
  }
};
