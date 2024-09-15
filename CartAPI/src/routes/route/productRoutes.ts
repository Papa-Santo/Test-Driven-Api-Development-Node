import express from "express";
import Middleware from "../../middleware";
import productController from "../controller/productController";

const productRoutes = express.Router();

productRoutes.get(
  "",
  //  TodoValidator.checkReadTodo(),
  //   Middleware.handleValidationError,
  productController.GetProducts
);

export default productRoutes;
