import {create} from "zustand";

export const useProductsStore = create((set) => ({
  isLoading: false,
  isSucess: false,

  showAllProdcts: async () => {
    set({isLoading: true});
    try {
      const response = await fetch(
        `${process.env.BACKEND_URL_VITE}/api/getProducts`,
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
        isSucess: true,
      });
    } catch (error) {}
  },
}));
