import { create } from "zustand";
import { toast } from "react-hot-toast";
import axios from "axios";

export const useCartStore = create((set, get) => ({
  cart: [],
  coupon: null,
  total: 0,
  subtotal: 0,
  isCouponApplied: false,

  getMyCoupon: async () => {
    try {
      const response = await axios.get("/api/coupons");
      set({ coupon: response.data });
    } catch (error) {
      console.error("Error fetching coupon:", error);
    }
  },

  applyCoupon: async (code) => {
    try {
      const response = await axios.post("/api/coupons/validate", { code });
      set({ coupon: response.data, isCouponApplied: true });
      get().calculateTotals();
      toast.success("Coupon applied successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to apply coupon");
    }
  },

  removeCoupon: () => {
    set({ coupon: null, isCouponApplied: false });
    get().calculateTotals();
    toast.success("Coupon removed");
  },

  getCartItems: async () => {
    try {
      const response = await axios.get("/api/cart");
      set({ cart: response.data });
      get().calculateTotals();
    } catch (error) {
      set({ cart: [] });
      toast.error(error.response?.data?.message || "An error occurred");
    }
  },

  clearCart: () => {
    set({ cart: [], coupon: null, total: 0, subtotal: 0 });
  },

  addToCart: async (product) => {
    try {
      await axios.post("/api/cart", { productId: product._id });
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
      await axios.delete(`/api/cart`, { data: { productId } });
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

      await axios.put(`/api/cart/${productId}`, { quantity });
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
    const { cart, coupon } = get();
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const total = coupon
      ? subtotal * (1 - coupon.discountPercentage / 100)
      : subtotal;
    set({ subtotal, total });
  },
}));
