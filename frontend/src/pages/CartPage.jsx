import { useState } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import { motion } from "framer-motion";
import { ShoppingCart, ClipboardList } from "lucide-react";
import CartItem from "../components/CartItem";
import PeopleAlsoBought from "../components/PeopleAlsoBought";
import OrderSummary from "../components/OrderSummary";
// import GiftCouponCard from "../components/GiftCouponCard";
import OrderList from "../components/OrderList";

const CartPage = () => {
  const { cart } = useCartStore();
  const [activeTab, setActiveTab] = useState('cart');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="py-8 md:py-16">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <div className="flex justify-center space-x-8 mb-6">
          <button
            className={`px-4 py-2 font-semibold transition-colors ${activeTab === 'cart' ? 'text-emerald-500 border-b-2 border-emerald-500' : 'text-gray-500'}`}
            onClick={() => handleTabChange('cart')}
          >
            <ShoppingCart className="inline mr-2" /> Cart
          </button>
          <button
            className={`px-4 py-2 font-semibold transition-colors ${activeTab === 'orders' ? 'text-emerald-500 border-b-2 border-emerald-500' : 'text-gray-500'}`}
            onClick={() => handleTabChange('orders')}
          >
            <ClipboardList className="inline mr-2" /> Orders
          </button>
        </div>

        {activeTab === 'cart' ? (
          <CartView cart={cart} />
        ) : (
          <OrderView />
        )}
      </div>
    </div>
  );
};
export default CartPage;

const CartView = ({ cart }) => (
  <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
    <motion.div
      className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {cart?.length === 0 ? (
        <EmptyCartUI />
      ) : (
        <div className="space-y-6">
          {cart?.map((item) => (
            <CartItem key={item._id} item={item} />
          ))}
        </div>
      )}
      {cart?.length > 0 && <PeopleAlsoBought />}
    </motion.div>

    {cart?.length > 0 && (
      <motion.div
        className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <OrderSummary />
      </motion.div>
    )}
  </div>
);

const OrderView = () => (
  <motion.div
    className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <OrderList /> {/* This component should list all customer orders */}
  </motion.div>
);

const EmptyCartUI = () => (
  <motion.div
    className="flex flex-col items-center justify-center space-y-4 py-16"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <ShoppingCart className="h-24 w-24 text-gray-300" />
    <h3 className="text-2xl font-semibold ">Your cart is empty</h3>
    <p className="text-gray-400">
      Looks like you {"haven't"} added anything to your cart yet.
    </p>
    <Link
      className="mt-4 rounded-md bg-emerald-500 px-6 py-2 text-white transition-colors hover:bg-emerald-600"
      to="/"
    >
      Start Shopping
    </Link>
  </motion.div>
);
