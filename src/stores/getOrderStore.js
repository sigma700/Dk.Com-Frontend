// stores/useGetOrderStore.js
import {create} from "zustand";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export const useGetOrderStore = create((set, get) => ({
  isLoading: false,
  orders: [], // not used for single order, but kept for potential list
  order: null,
  error: null,
  isGotten: false, // indicates if an order has been fetched at least once

  // Fetch a single order by its ID
  fetchOrder: async (orderId) => {
    if (!orderId) {
      set({error: "No order ID provided", isLoading: false});
      return {success: false, error: "No order ID provided"};
    }

    set({isLoading: true, error: null});

    try {
      const response = await fetch(`${API_URL}/store/order/${orderId}`, {
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch order");
      }

      set({
        order: data.data,
        isLoading: false,
        isGotten: true,
        error: null,
      });

      return {success: true, order: data.data};
    } catch (error) {
      console.error("Fetch order error:", error);
      set({
        isLoading: false,
        error: error.message,
        order: null,
      });
      return {success: false, error: error.message};
    }
  },

  // Clear the current order (e.g., when navigating away)
  clearOrder: () => {
    set({order: null, isGotten: false, error: null});
  },

  // Reset the entire store
  reset: () => {
    set({
      isLoading: false,
      orders: [],
      order: null,
      error: null,
      isGotten: false,
    });
  },
}));
