import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

export const getOrder = async (req, res) => {
  const user = req.user;
  try {
    const orderHistory = await Order.find({ user: user._id }).populate({
      path: 'products.product',
      model: Product,
    });
    res.status(200).json(orderHistory);
  } catch (error) {
    console.error("Error retrieving order history:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
