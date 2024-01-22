import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/db.js";
import Post from "./Post.js";
import Comment from "./Comment.js";

export default class Users extends Model {}

Users.init(
  {
    nombre: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        isAlpha: {
          args: true,
          msg: "El nombre solo puede contener letras",
        },
        len: {
          args: [3, 30],
          msg: "Nombre debe contener entre 3 y 30 caracteres",
        },
      },
    },
    apellido: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        isAlpha: {
          args: true,
          msg: "El apellido solo puede contener letras",
        },
        len: {
          args: [3, 30],
          msg: "El apellido debe contener entre 2 y 30 caracteres",
        },
      },
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: {
        args: true,
      },
      validate: {
        isEmail: {
          args: true,
          msg: "El email no tiene formato correcto",
        },
      },
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    rol: {
      type: DataTypes.ENUM,
      values: ["admin", "user"],
      defaultValue: "user",
    },
    img_perfil: {
      type: DataTypes.STRING(50),
      defaultValue: "perfil-default.png",
    },
  },
  {
    sequelize,
    timestamps: false,
    modelName: "users",
  }
);

//relaciones entre las tablas.

//uno a muchos entre ususarios y publicaciones
Users.hasMany(Post, {
  foreignKey: "user_id",
});

Post.belongsTo(Users, {
  foreignKey: "user_id",
});

//uno a muchos entre publicaciones y comentarios
Post.hasMany(Comment, {
  onDelete: "CASCADE",
  foreignKey: "post_id",
});

Comment.belongsTo(Post, {
  foreignKey: "post_id",
});

//uno a muchos entre Usuarios y comentarios
Users.hasMany(Comment, {
  foreignKey: "user_id",
});

Comment.belongsTo(Users, {
  foreignKey: "user_id",
});
