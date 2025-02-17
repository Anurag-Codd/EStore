import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("/api/orders");
        setOrders(res.data);
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "An error occurred while fetching orders"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {orders.length === 0 ? (
        <p className="text-center text-gray-400">You have no orders.</p>
      ) : (
        orders.map((order) => (
          <motion.div
            key={order._id}
            className="p-10 rounded-md relative flex bg-black/40 shadow-md h-44"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex-shrink-0 relative w-24 h-24">
              {order.products.slice(0, 3).map((product, index) => (
                <div
                  key={index}
                  className={`absolute w-16 h-16 rounded-md border-2 border-white overflow-hidden transform rotate-${
                    index * 5
                  } z-${index * 10}`}
                  style={{
                    left: `${index * 1.25}rem`,
                    top: `${index * 1.25}rem`,
                  }}
                >
                  <img
                    src={product.product.image}
                    alt={product.product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 right-0 bg-gray-500 rounded-full text-xs p-1">
                    {product.quantity > 1 ? `${product.quantity}x` : `1x`}
                  </div>
                </div>
              ))}
              {order.products.length > 3 && (
                <div
                  className="absolute w-16 h-16 rounded-md flex items-center justify-center bg-gray-300 border-2 border-white text-gray-500 text-lg z-30 transform rotate-15"
                  style={{ left: "3.75rem", top: "3.75rem" }}
                >
                  +{order.products.length - 3}
                </div>
              )}
            </div>
            <div className="ml-32">
              <h4 className="text-xs font-semibold absolute top-0 left-0 mt-2 ml-2">
                ID: {order._id}
              </h4>
              <p className="text-gray-500">
                Order Date: {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <ul className="mt-2 space-y-1">
                {order.products.map((product, index) => (
                  <li key={index} className="text-gray-400">
                    {product.product.name} - Quantity: {product.quantity}x{' '}
                    {product.product.price}
                  </li>
                ))}
              </ul>
              <p className="text-gray-200 absolute bottom-0 right-0 mb-4 mr-4 bg-green-800 rounded-md p-2">
                Total Amount: ${order.totalAmount}
              </p>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
};

export default OrderList;
