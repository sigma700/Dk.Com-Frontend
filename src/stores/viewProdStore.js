// stores/viewProdStore.js
import {create} from "zustand";

export const useViewProd = create((set) => ({
  isLoading: false,
  orderItem: null,
  viewProd: async (productId) => {
    set({isLoading: true, orderItem: null});
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/store/get-product/${productId}`,
        {
          method: "GET",
          credentials: "include",
          headers: {"Content-type": "application/json"},
        },
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const dataFromBackend = await response.json();
      set({
        isLoading: false,
        orderItem: dataFromBackend.data,
      });
    } catch (error) {
      console.error("Failed to fetch product:", error);
      set({isLoading: false, orderItem: null});
    }
  },
}));
