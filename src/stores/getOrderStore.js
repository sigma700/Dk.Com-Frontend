import {create} from "zustand";

export const useGetOrderStore = create((set) => {
  isLoading: false;
  orders: [];
  isGotten: false;
});
