import {create} from "zustand";

const API_BASE =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:4000/api";

const useAuthStore = create((set, get) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,

  register: async (userData) => {
    set({isLoading: true, error: null});
    try {
      const response = await fetch(`${API_BASE}/api/create-account`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        credentials: "include", // Important for receiving cookies
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      set({
        user: data.data,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return {success: true, data: data.data};
    } catch (err) {
      set({
        isLoading: false,
        error: err.message,
        isAuthenticated: false,
      });
      return {success: false, error: err.message};
    }
  },

  logout: async () => {
    try {
      await fetch(`${API_BASE}/users/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      set({user: null, isAuthenticated: false, error: null});
    }
  },

  clearError: () => set({error: null}),
}));

export default useAuthStore;
