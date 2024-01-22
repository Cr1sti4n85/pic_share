import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/db.js";

export default class Comment extends Model {}

Comment.init(
  {
    contenido: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    timestamps: false,
    modelName: "comment",
  }
);
