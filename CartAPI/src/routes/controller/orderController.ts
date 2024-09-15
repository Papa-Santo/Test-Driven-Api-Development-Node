import { Request, Response } from "express";
import {
  I_Order,
  I_OrderItem,
  I_Product,
  lineitem,
  orderheader,
  product,
} from "../../models";

class OrderController {
  async GetOrders(req: Request, res: Response) {
    try {
      const orders = await orderheader.findAll({
        include: {
          association: "lineitems",
          include: ["product"],
        },
      });
      return res.status(200).json(orders);
    } catch (e) {
      return res.status(400).json({
        message: "Failed to retrieve orders",
        route: "/order",
      });
    }
  }

  async DeleteOrder(req: Request, res: Response) {
    try {
      const { id } = req.query;
      const deleteOrder = await orderheader.findByPk(id);

      if (!deleteOrder) {
        return res.status(400).json({
          message: "Line item not found",
          route: "/order",
        });
      }

      // We will allow this is dev
      // if (deleteOrder.status > 0) {
      //   return res
      //     .status(400)
      //     .json({ message: "Order has been placed", route: "/order" });
      // }

      const deleted = await deleteOrder.destroy();
      return res.json({ id: deleted, success: true });
    } catch (e) {
      return res.status(500).json({
        message: "Unknown server error",
        route: "/order/lineitem",
      });
    }
  }

  async PostOrder(req: Request, res: Response) {
    try {
      // Find the product
      const id: number = req.body.productid;
      const prod: I_Product | null = await product.findOne({ where: { id } });
      if (!prod)
        return res.status(404).json({
          message: "This product could not be found",
          route: "/api/order",
        });

      // Create Order
      const orderHead: I_Order = {
        total: prod!.price * req.body.quantity,
        customer: req.body.userid,
      };
      const order = await orderheader.create({ ...orderHead });

      // Create the line
      const line: I_OrderItem = {
        price: prod.price,
        quantity: req.body.quantity,
        productid: prod!.id,
        orderheaderid: order.id,
      };

      await lineitem.create(line);
      return res.status(201).json({
        id: order.id,
        message: "Successfully created",
      });
    } catch (e) {
      return res.status(400).json({
        message: "Failed to create order",
        route: "/api/order",
      });
    }
  }

  async GetOrderById(req: Request, res: Response) {
    try {
      const { id } = req.query;
      if (!id)
        return res.status(400).json({
          message: "Failed to pass an id",
          route: "/order",
        });
      const orders = await orderheader.findByPk(id, {
        include: {
          association: "lineitems",
          include: ["product"],
        },
      });
      if (!orders)
        return res.status(400).json({
          message: "Failed to retrieve order",
          route: "/order/byid",
        });

      return res.status(200).json(orders);
    } catch (e) {
      return res.status(400).json({
        message: "Failed to retrieve order",
        route: "/order/byid",
      });
    }
  }

  async PostOrderItem(req: Request, res: Response) {
    try {
      // We want to update quantities if more of the same product is added without adding a lineitem
      let addLineItem = true;
      const { orderheaderid, quantity, productid } = req.body;
      if (!quantity || !productid || !orderheaderid) {
        return res.status(400).json({
          message: "Failed to pass correct parameters",
          route: "/order/item",
        });
      }

      // Get order
      const order = await orderheader.findByPk(orderheaderid, {
        include: {
          association: "lineitems",
          include: ["product"],
        },
      });

      // Check order exists and still has shopping status
      if (!order || order.status > 0) {
        return res.status(400).json({
          message: order
            ? "This order has been placed"
            : "This order could not be found",
          route: "/order/item",
        });
      }

      // Ensure Product Exists
      const prod: I_Product | null = await product.findByPk(productid);
      if (!prod)
        return res.status(404).json({
          message: "This product could not be found",
          route: "/order/item",
        });

      // Make line item
      const itemForUpdate: I_OrderItem = {
        orderheaderid,
        quantity,
        price: prod.price,
        productid: prod.id,
      };

      let priceUpdate = 0;
      if (order.lineitems && order.lineitems?.length > 0) {
        // Check for lineitem product in items and fix for quantity
        for (let item of order.lineitems) {
          item.price = item.product!.price;
          if (item.productid === productid) {
            item.quantity += quantity;
            addLineItem = false;
            await item.update({ quantity: item.quantity });
            break;
          }
        }

        // Create typed line items
        const olines: I_OrderItem[] = order.lineitems!.map((prop) => {
          return {
            orderheaderid: prop.orderheaderid,
            quantity: prop.quantity,
            price: prop.price,
            productid: prop.productid,
          };
        });

        let lineUpdate: I_OrderItem | null = itemForUpdate;
        if (!addLineItem) lineUpdate = null;
        priceUpdate = updatePrice(olines, lineUpdate);
      }

      // Set the price
      await order.update({ total: priceUpdate });
      // The quantity was not updated add lineitem
      if (addLineItem) await lineitem.create(itemForUpdate);
      return res.status(201).json({
        message: "Successfully added to order",
        id: order.id,
        route: "/order/item",
      });
    } catch (e) {
      return res.status(400).json({
        message: "Failed to add line to order",
        route: "/order/item",
      });
    }
  }

  async DeleteOrderItem(req: Request, res: Response) {
    try {
      const { id } = req.query;
      const deleteLine = await lineitem.findByPk(id, {
        include: [orderheader],
      });

      if (!deleteLine) {
        return res
          .status(400)
          .json({ message: "Line item not found", route: "/order/lineitem" });
      }

      if (!deleteLine.orderheader || deleteLine.orderheader.status > 0) {
        return res.status(400).json({
          message: deleteLine.orderheader
            ? "This order has already been placed"
            : "Order not found",
          route: "/order/lineitem",
        });
      }

      const deleted = await deleteLine.destroy();
      return res.status(200).json({ id: deleted, success: true });
    } catch (e) {
      return res.status(500).json({
        message: "Unknown server error",
        route: "/order/lineitem",
      });
    }
  }

  async CheckoutOrder(req: Request, res: Response) {
    try {
      // Get order
      const order = await orderheader.findByPk(req.body.id, {
        include: {
          association: "lineitems",
          include: ["product"],
        },
      });

      if (!order) {
        return res.status(400).json({
          message: "This order could not be found",
          route: "/order/Checkout",
        });
      }

      if (!order.lineitems || order.lineitems.length === 0) {
        return res
          .status(400)
          .json({ message: "This order is empty", route: "/order/Checkout" });
      }

      if (order.status > 0) {
        return res.status(400).json({
          message: "This order has already been submitted",
          route: "/order/Checkout",
        });
      }

      const updatedOrder = await order.update({ status: 1 });
      return res.json({ id: updatedOrder.id });
    } catch (e) {
      return res.status(500).json({
        message: "Unknown server error",
        route: "/delete/Checkout",
      });
    }
  }
}

const updatePrice = (items: I_OrderItem[], itemToAdd: I_OrderItem | null) => {
  let price = 0;

  for (let item of items) {
    // Update the line item price with the current product price
    item.price = item.price;
    // Add up all the items for a total price
    price += item.price * item.quantity;
  }
  if (itemToAdd != null) {
    price += itemToAdd.price * itemToAdd.quantity;
  }
  return parseFloat(price.toFixed(2));
};
export default new OrderController();
