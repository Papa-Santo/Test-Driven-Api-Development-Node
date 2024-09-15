import { Sequelize } from "@sequelize/core";
import { PostgresDialect } from "@sequelize/postgres";
import { lineitem, orderheader, product } from "../models";

export default new Sequelize({
  dialect: PostgresDialect,
  database: "CartNode",
  user: "postgres",
  password: process.env.PASSWORD,
  host: "localhost",
  port: 5432,
  models: [product, orderheader, lineitem],
  define: {
    timestamps: false,
    freezeTableName: true,
  },

  //   ssl: true,
  //   clientMinMessages: "notice",
});
