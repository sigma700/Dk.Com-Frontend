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
          const data = await response.json();
          console.log("Data from API", data);
          if (response.ok) {
            await get().fetchCart();
            set({isLoading: false, isSent: true});
          } else {
            set({isLoading: false, isSent: false});
          }
        } catch (error) {
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
            },
          );
          const data = await response.json();
          set({
            addedProduct: data.data?.items || [],
            isLoading: false,
          });
        } catch (error) {
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
