import express from "express";
import orderController from "../controller/orderController";

const orderRoutes = express.Router();

orderRoutes.post("", orderController.PostOrder);

orderRoutes.delete("", orderController.DeleteOrder);

orderRoutes.get("", orderController.GetOrders);

orderRoutes.get("/byid", orderController.GetOrderById);

orderRoutes.post("/item", orderController.PostOrderItem);

orderRoutes.delete("/lineitem", orderController.DeleteOrderItem);

orderRoutes.post("/checkout", orderController.CheckoutOrder);

export default orderRoutes;
