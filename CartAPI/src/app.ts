import express from "express";
import orderRoutes from "./routes/route/orderRoutes";
import productRoutes from "./routes/route/productRoutes";

const cors = require("cors");
const app = express();
app.use(cors());

app.use(express.json());

app.use("/api/order", orderRoutes);
app.use("/api/product", productRoutes);

export default app;
