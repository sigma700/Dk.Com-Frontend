// stores/authStore.js
import {create} from "zustand";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000/";

const useAuthStore = create((set, get) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,

  // ── Register ──────────────────────────────────────────────
  register: async (userData) => {
    set({isLoading: true, error: null});
    try {
      const response = await fetch(`${API_BASE}/api/create-account`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        credentials: "include",
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
      set({isLoading: false, error: err.message, isAuthenticated: false});
      return {success: false, error: err.message};
    }
  },

  // ── Login (matches your backend /api/login) ───────────────
  login: async ({email, password, rememberMe = false}) => {
    set({isLoading: true, error: null});
    try {
      const response = await fetch(`${API_BASE}/api/login`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        credentials: "include",
        body: JSON.stringify({email, password, rememberMe}),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (data.data.token) {
        localStorage.setItem("authToken", data.data.token);
      }

      set({
        user: data.data,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return {success: true, user: data.data, message: data.message};
    } catch (err) {
      set({
        isLoading: false,
        error: err.message,
        isAuthenticated: false,
        user: null,
      });
      return {success: false, error: err.message};
    }
  },

  // ── Email Verification ────────────────────────────────────
  verifyEmail: async (token) => {
    set({isLoading: true, error: null});
    try {
      const response = await fetch(`${API_BASE}/api/verify`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        credentials: "include",
        body: JSON.stringify({token}),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Verification failed");
      }
      const currentUser = get().user;
      if (currentUser) {
        set({
          user: {...currentUser, isVerified: true},
          isLoading: false,
          error: null,
        });
      } else {
        set({isLoading: false, error: null});
      }
      return {success: true, message: data.message};
    } catch (err) {
      set({isLoading: false, error: err.message});
      return {success: false, error: err.message};
    }
  },

  // ── Check Authentication ──────────────────────────────────
  checkAuth: async () => {
    set({isLoading: true, error: null});
    try {
      const token = localStorage.getItem("token");

      const headers = {"Content-Type": "application/json"};

      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch(`${API_BASE}/api/checkAuth`, {
        method: "GET",
        credentials: "include",
        headers,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Not authenticated");
      }
      set({
        user: data.data,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return {success: true, user: data.data};
    } catch (err) {
      set({
        isLoading: false,
        error: err.message,
        isAuthenticated: false,
        user: null,
      });
      return {success: false, error: err.message};
    }
  },

  fetchUser: async () => {
    set({isLoading: true, error: null});
    try {
      const token = localStorage.getItem("authToken");
      const headers = {"Content-Type": "application/json"};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch(`${API_BASE}/api/me`, {
        method: "GET",
        credentials: "include",
        headers,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch user");

      set({
        user: data.data,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return {success: true, user: data.data};
    } catch (err) {
      set({
        isLoading: false,
        error: err.message,
        isAuthenticated: false,
        user: null,
      });
      return {success: false, error: err.message};
    }
  },
  // ── Resend Verification Code ──────────────────────────────
  resendVerificationCode: async (email) => {
    set({isLoading: true, error: null});
    try {
      const response = await fetch(`${API_BASE}/users/resend-verification`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        credentials: "include",
        body: JSON.stringify({email}),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to resend code");
      }
      set({isLoading: false});
      return {success: true, message: data.message};
    } catch (err) {
      set({isLoading: false, error: err.message});
      return {success: false, error: err.message};
    }
  },

  // ── Logout ────────────────────────────────────────────────
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

  // ── Clear Error ───────────────────────────────────────────
  clearError: () => set({error: null}),
}));

export default useAuthStore;
