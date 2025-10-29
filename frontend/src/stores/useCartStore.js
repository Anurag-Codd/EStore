import { create } from "zustand";
import { toast } from "react-hot-toast";
import axiosInstance from "../utils/axiosInstance";

export const useCartStore = create((set, get) => ({
  cart: [],
  total: 0,

  getCartItems: async () => {
    try {
      const response = await axiosInstance.get("/api/cart");
      set({ cart: response.data });
      get().calculateTotals();
    } catch (error) {
      set({ cart: [] });
      toast.error(error.response?.data?.message || "An error occurred");
    }
  },

  clearCart: () => {
    set({ cart: [], total: 0 });
  },

  addToCart: async (product) => {
    try {
      await axiosInstance.post("/api/cart", { productId: product._id });
      toast.success("Product added to cart");

      set((state) => {
        const existingItem = state.cart.find(
          (item) => item._id === product._id
        );
        const updatedCart = existingItem
          ? state.cart.map((item) =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          : [...state.cart, { ...product, quantity: 1 }];
        return { cart: updatedCart };
      });
      get().calculateTotals();
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  },

  removeFromCart: async (productId) => {
    try {
      await axiosInstance.delete(`/api/cart`, { data: { productId } });
      set((state) => ({
        cart: state.cart.filter((item) => item._id !== productId),
      }));
      get().calculateTotals();
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  },

  updateQuantity: async (productId, quantity) => {
    try {
      if (quantity === 0) {
        get().removeFromCart(productId);
        return;
      }

      await axiosInstance.put(`/api/cart/${productId}`, { quantity });
      set((state) => ({
        cart: state.cart.map((item) =>
          item._id === productId ? { ...item, quantity } : item
        ),
      }));
      get().calculateTotals();
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  },

  calculateTotals: () => {
    const { cart } = get();
    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    set({ total });
  },
}));
