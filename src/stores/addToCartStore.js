import {create} from "zustand";
import {persist} from "zustand/middleware";

export const useAddToCartStore = create(
  persist(
    (set, get) => ({
      isLoading: false,
      isSent: false,
      addedProduct: [],

      addToCart: async (productId, quant) => {
        set({isLoading: true, isSent: false});

        try {
          const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/store/cart/add`,
            {
              method: "POST",
              credentials: "include",
              headers: {"Content-type": "application/json"},
              body: JSON.stringify({productId, quantity: quant}),
            },
          );

          // Handle non‑OK responses (including 304, 400, 401, etc.)
          if (!response.ok) {
            console.error("Add to cart failed:", response.status);
            set({isLoading: false, isSent: false});
            return;
          }

          const data = await response.json();
          console.log("Data from API", data);

          set({
            isLoading: false,
            isSent: true,
            addedProduct: data.data?.items || [],
          });
        } catch (error) {
          console.error("Add to cart error:", error);
          set({isLoading: false, isSent: false});
        }
      },

      fetchCart: async () => {
        set({isLoading: true});
        try {
          const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/store/getCart`,
            {
              credentials: "include",
              // ✅ Force fresh data – prevents 304 responses
              cache: "no-cache",
            },
          );

          // If response is not OK, fallback to existing cart data
          if (!response.ok) {
            console.error("Fetch cart failed:", response.status);
            set({isLoading: false});
            return;
          }

          const data = await response.json();
          set({
            addedProduct: data.data?.items || [],
            isLoading: false,
          });
        } catch (error) {
          console.error("Fetch cart error:", error);
          set({isLoading: false});
        }
      },

      clearCart: () => set({addedProduct: []}),
    }),
    {
      name: "cart-storage",
    },
  ),
);
