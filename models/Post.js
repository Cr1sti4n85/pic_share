import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/db.js";

export default class Post extends Model {}

Post.init(
  {
    titulo: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        max: {
          args: 20,
          msg: "El nombre de la publicación excede longitud máxima",
        },
      },
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        max: {
          args: 200,
          msg: "La descripción excede longitud máxima de 200 caracteres",
        },
      },
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date(),
    },
    imagen_url: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    modelName: "post",
  }
);
