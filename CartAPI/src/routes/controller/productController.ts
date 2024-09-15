import { Request, Response } from "express";
import { product } from "../../models";

class ProductController {
  async GetProducts(req: Request, res: Response) {
    try {
      const products = await product.findAll();
      return res.status(200).json(products);
    } catch (e) {
      return res.status(404).json({
        route: "/v1/order",
      });
    }
  }
}

export default new ProductController();
