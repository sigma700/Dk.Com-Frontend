import {create} from "zustand";

export const useProductsStore = create((set) => ({
  isLoading: false,
  isSuccess: false,
  allProducts: null,

  showAllProducts: async () => {
    set({isLoading: true});

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/store/get-all-products`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
          },
          credentials: "include",
        },
      );

      const data = await response.json();
      console.log("data", data);

      set({
        isLoading: false,
        allProducts: data,
        isSuccess: true,
      });
    } catch (error) {
      console.error(error);
      set({isLoading: false});
    }
  },
}));
