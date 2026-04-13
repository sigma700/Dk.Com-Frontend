import {create} from "zustand";

export const useAddToCartStore = create((set) => ({
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

      //set new vavriables now
      set({
        isLoading: false,
        isSent: true,
        addedProduct: data.data.items,
      });
    } catch (error) {}
  },
}));
