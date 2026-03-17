import {create} from "zustand";

export const useProductsStore = create((set) => ({
  isLoading: false,
  isSucess: false,

  showAllProdcts: async () => {
    set({isLoading: true});
    try {
    } catch (error) {}
  },
}));
