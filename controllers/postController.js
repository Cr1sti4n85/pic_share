import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import Users from "../models/User.js";
import AppError from "../utils/appError.js";
import { uploadImage, deleteImg } from "../utils/uploadImage.js";
import __dirname from "../utils/dirName.js";
import { getPagination, getPagingData } from "../utils/pagination.js";

export const createPost = async (req, res, next) => {
  const { id } = req.user;
  const { titulo, descripcion } = req.body;

  //Se valida que venga archivo como requisito obligatorio
  if (!req.files?.archivo) {
    return next(new AppError("No hay archivos en la petición", 400, "failed"));
  }

  try {
    //se guarda el nombre del archivo en la BD
    const nombreArchivo = await uploadImage(req.files, id);
    const newPost = await Post.create({
      titulo,
      descripcion,
      user_id: id,
      imagen_url: nombreArchivo,
    });

    res.status(200).json({
      newPost,
      msg: "Publicación creada exitosamente",
    });
  } catch (error) {
    if (error.status === "failed") {
      return next(new AppError(error.msg, 400, error.status));
    }
    next(new AppError("No se puede procesar la solicitud"));
  }
};

export const getPosts = async (req, res, next) => {
  const { page, size } = req.query;
  //se crea pagiancion para ver pocas publicaciones
  const { limit, offset } = getPagination(page, size);
  const posts = [];
  try {
    //se obitnen publicaciones en orden descendiente, se incuyen los usuarios
    const foundPosts = await Post.findAndCountAll({
      offset,
      limit,
      order: [["fecha_creacion", "DESC"]],
      include: [
        {
          model: Users,
          attributes: ["nombre", "apellido"],
        },
      ],
    });

    const response = getPagingData(foundPosts, page, limit);

    response.posts.forEach((element) => {
      posts.push(element.toJSON());
    });

    //se crea array con mas informacion del user id y del rol para usar en front end
    const postAndComments = await Promise.all(
      posts.map(async (post) => {
        post.comments = await Comment.count({
          where: { post_id: post.id },
        });
        post.userId = req.user.id;
        post.rol = req.user.rol;
        return post;
      })
    );

    response.posts = postAndComments;

    res.status(200).json({
      status: "success",
      response,
    });
  } catch (error) {
    console.log(error);
    next(new AppError("No se pudo realizar la solicitud"));
  }
};

export const getMyPosts = async (req, res, next) => {
  const { id } = req.user;
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);
  const posts = [];
  try {
    //se usa paginacion
    const foundPosts = await Post.findAll({
      offset,
      limit,
      where: {
        user_id: id,
      },
    });

    const response = getPagingData(foundPosts, page, limit);

    response.posts.forEach((element) => {
      posts.push(element.toJSON());
    });

    //se hace lo mismo que con getPosts
    const postAndComments = await Promise.all(
      posts.map(async (post) => {
        post.comments = await Comment.count({
          where: { post_id: post.id },
        });
        post.userId = req.user.id;
        post.rol = req.user.rol;
        return post;
      })
    );

    response.posts = postAndComments;

    res.status(200).json({
      status: "success",
      response,
    });
  } catch (error) {
    console.log(error);
    next(new AppError("No se pudo realizar la solicitud"));
  }
};

export const updatePost = async (req, res, next) => {
  const { id, rol } = req.user;
  const { postId } = req.params;
  const { titulo, descripcion } = req.body;

  if (!req.files?.archivo) {
    return next(new AppError("No hay archivos en la petición", 400, "failed"));
  }
  try {
    //se actualiza en base a la id de la publicacion
    const post = await Post.findByPk(postId);

    if (!post) {
      return next(new AppError("No existe este post", 404, "failed"));
    }

    if (id !== post.user_id && rol !== "admin") {
      return next(
        new AppError(
          "No cuentas con los permisos para editar esta publicación",
          403,
          "failed"
        )
      );
    }

    const nombreArchivo = await uploadImage(
      req.files,
      post.user_id,
      post.imagen_url
    );
    await post.update({ titulo, descripcion, imagen_url: nombreArchivo });
    res.sendStatus(204);
  } catch (error) {
    next(
      new AppError(error || "No se pudo realizar la solicitud", 400, "failed")
    );
  }
};

export const deletePost = async (req, res, next) => {
  const { id, rol } = req.user;
  const { postId } = req.params;

  try {
    const post = await Post.findByPk(postId);

    if (!post) {
      return next(new AppError("No existe esta publicación", 404, "failed"));
    }

    if (id !== post.user_id && rol !== "admin") {
      return next(
        new AppError(
          "No cuentas con los permisos para eliminar esta publicación",
          403,
          "failed"
        )
      );
    }

    if (post.imagen_url) {
      deleteImg(post.iser_id, post.imagen_url);
    }
    //borrado fisico de la publicacion
    await post.destroy();
    res.status(200).json({
      status: "success",
      msg: "Publicación borrada exitosamente",
    });
  } catch (error) {
    next(new AppError("Hubo un problema al borrar la publicación"));
  }
};
