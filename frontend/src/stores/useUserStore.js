import { create } from "zustand";
import { toast } from "react-hot-toast";
import axios from "axios";

export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  signup: async ({ name, email, password, confirmPassword }) => {
    set({ loading: true });

    if (password !== confirmPassword) {
      set({ loading: false });
      return toast.error("Passwords do not match");
    }

    try {
      const res = await axios.post("/api/auth/signup", {
        name,
        email,
        password,
      });
      set({ user: res.data, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.message || "An error occurred");
    }
  },
  login: async (email, password) => {
    set({ loading: true });

    try {
      const res = await axios.post("/api/auth/login", { email, password });

      set({ user: res.data, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.message || "An error occurred");
    }
  },

  logout: async () => {
    try {
      await axios.post("/api/auth/logout");
      set({ user: null });
      toast.info("You have been logged out.");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred during logout"
      );
    }
  },

  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const response = await axios.get("/api/auth/profile");
      set({ user: response.data, checkingAuth: false });
    } catch (error) {
      console.log(error.message);
      set({ checkingAuth: false, user: null });
    }
  },

  refreshToken: async () => {
    if (get().checkingAuth) return;

    set({ checkingAuth: true });
    try {
      const response = await axios.post("/api/auth/refresh-token");
      set({ checkingAuth: false });
      return response.data;
    } catch (error) {
      console.error("Refresh token failed:", error.message);
      set({ user: null, checkingAuth: false });
      toast.error("Session expired. Please log in again.");
      throw error;
    }
  },
}));

let refreshPromise = null;
let retryCount = 0;

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      retryCount < 3
    ) {
      originalRequest._retry = true;
      retryCount += 1;

      try {
        if (!refreshPromise) {
          refreshPromise = useUserStore.getState().refreshToken();
        }

        await refreshPromise;
        refreshPromise = null;
        retryCount = 0;

        return axios(originalRequest);
      } catch (refreshError) {
        retryCount = 0;
        useUserStore.getState().logout();
        toast.error("Session expired. Please log in again.");
        return Promise.reject(refreshError);
      }
    }

    retryCount = 0;
    return Promise.reject(error);
  }
);
