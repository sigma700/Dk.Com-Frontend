import {create} from "zustand";

export const useProductsStore = create((set) => ({
  isLoading: false,
  isSuccess: false,
  allProducts: [], // start with empty array

  showAllProducts: async () => {
    set({isLoading: true, isSuccess: false});

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/store/get-all-products`,
        {
          method: "GET",
          headers: {"Content-type": "application/json"},
          credentials: "include",
        },
      );

      const dataSet = await response.json();
      console.log("data", dataSet.data); // should be your products array

      set({
        isLoading: false,
        allProducts: dataSet.data, // ← key change
        isSuccess: true,
      });
    } catch (error) {
      console.error(error);
      set({isLoading: false, allProducts: [], isSuccess: false});
    }
  },
}));
