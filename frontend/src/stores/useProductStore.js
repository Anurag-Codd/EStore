import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "axios";

export const useProductStore = create((set) => ({
  products: [],
  loading: false,

  setProducts: (products) => set({ products }),

  createProduct: async (productData) => {
    set({ loading: true });
    try {
      const res = await axios.post("/api/products", {
        ...productData,
        category: productData.category.toLowerCase()
      });
      set((state) => ({
        products: [...state.products, res.data],
        loading: false,
      }));
      toast.success("Product created successfully");
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error(error.response?.data?.error || "Failed to create product");
      set({ loading: false });
    }
  },
  

  fetchAllProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/api/products");
      set({ products: response.data, loading: false });
    } catch (error) {
      console.error("Error fetching all products:", error);
      toast.error(error.response?.data?.error || "Failed to fetch products");
      set({ products: [], loading: false });
    }
  },

  fetchProductsByCategory: async (category) => {
    set({ loading: true });
    try {
      const response = await axios.get(`/api/products/category/${category}`);
      console.log("category response:", response);
      set({ products: response.data, loading: false });
    } catch (error) {
      console.error("Error fetching products by category:", error);
      toast.error(error.response?.data?.error || "Failed to fetch products");
      set({ products: [], loading: false });
    }
  },

  deleteProduct: async (productId) => {
    set({ loading: true });
    try {
      await axios.delete(`/api/products/${productId}`);
      set((state) => ({
        products: state.products.filter((product) => product._id !== productId),
        loading: false,
      }));
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error(error.response?.data?.error || "Failed to delete product");
      set({ loading: false });
    }
  },

  toggleFeaturedProduct: async (productId) => {
    set({ loading: true });
    try {
      const response = await axios.patch(`/api/products/${productId}`);
      set((state) => ({
        products: state.products.map((product) =>
          product._id === productId ? { ...product, isFeatured: response.data.isFeatured } : product
        ),
        loading: false,
      }));
      toast.success("Product updated successfully");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error(error.response?.data?.error || "Failed to update product");
      set({ loading: false });
    }
  },

  fetchFeaturedProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/api/products/featured");
      set({ products: response.data, loading: false });
    } catch (error) {
      console.error("Error fetching featured products:", error);
      toast.error(error.response?.data?.error || "Failed to fetch featured products");
      set({ products: [], loading: false });
    }
  },
}));
