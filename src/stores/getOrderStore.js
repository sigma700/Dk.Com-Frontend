import {create} from "zustand";

export const useGetOrderStore = create((set, get) => ({
  order: null,
  orders: [], // could be used for multiple orders, keep for consistency
  isLoading: false,
  error: null,
  isGotten: false,

  fetchOrder: async (orderId) => {
    set({isLoading: true, error: null, isGotten: false});
    try {
      const response = await fetch(
        `http://localhost:4000/store/order/${orderId}`,
        {
          method: "GET",
          credentials: "include", // include cookies for auth
          headers: {"Content-Type": "application/json"},
        },
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch order");
      }
      set({order: data.data, isLoading: false, isGotten: true, error: null});
    } catch (err) {
      set({error: err.message, isLoading: false, isGotten: false, order: null});
    }
  },

  getOrders: async () => {
    // optional, implement if needed
  },
}));
