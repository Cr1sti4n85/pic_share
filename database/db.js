import { Sequelize } from "sequelize";
import { config } from "dotenv";
config();

export const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.HOST,
    dialect: "postgres",
    define: {
      freezeTableName: true,
    },
  }
);
