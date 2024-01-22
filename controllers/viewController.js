import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import Users from "../models/User.js";
import AppError from "../utils/appError.js";
import __dirname from "../utils/dirName.js";
import { getPagination } from "../utils/pagination.js";

//renderizaciones de plantillas con handlebars
export const getLogin = (req, res, next) => {
  if (!req.user) {
    return res.status(200).render("login", {
      title: "Bienvenido a Share Pic",
    });
  }
  res.status(200).redirect("/posts");
};

export const getSignupForm = (req, res, next) => {
  res.status(200).render("signup", {
    title: "Crea tu cuenta",
  });
};

//esta tamplate se renderiza al principio
export const getOverview = async (req, res, next) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);
  const arrayPosts = [];
  try {
    const posts = await Post.findAll({
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

    posts.forEach((element) => {
      arrayPosts.push(element.toJSON());
    });

    const postAndComments = await Promise.all(
      arrayPosts.map(async (post) => {
        post.comments = await Comment.count({
          where: { post_id: post.id },
        });
        post.userId = req.user.id;
        return post;
      })
    );

    res.status(200).render("posts", {
      title: "Share Pic",
      posts: postAndComments,
    });
  } catch (error) {
    next(new AppError("Hubo un problema al obtener la página"));
  }
};

//permite ver las publiaciones del usuario
export const getMyPosts = async (req, res, next) => {
  const { id } = req.user;
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);
  const arrayPosts = [];

  try {
    const posts = await Post.findAll({
      offset,
      limit,
      where: {
        user_id: id,
      },
      include: [
        {
          model: Users,
          attributes: ["nombre", "apellido"],
        },
      ],
    });

    posts.forEach((element) => {
      arrayPosts.push(element.toJSON());
    });

    const postAndComments = await Promise.all(
      arrayPosts.map(async (post) => {
        post.comments = await Comment.count({
          where: { post_id: post.id },
        });
        post.userId = req.user.id;

        return post;
      })
    );

    res.status(200).render("posts", {
      title: "Share Pic",
      posts: postAndComments,
      heading: "Mis publicaciones",
    });
  } catch (error) {
    next(new AppError("No se pudo realizar la solicitud"));
  }
};

//Renderiza la información del usuario para poder actualizarla
export const getProfile = async (req, res, next) => {
  console.log("hola");
  res.status(200).render("profile", {
    title: "Perfil del usuario",
  });
};
