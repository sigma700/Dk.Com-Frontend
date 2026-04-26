import {create} from "zustand";

export const useAddressStore = create((set) => ({
  addresses: [],
  isLoading: false,
  error: null,

  fetchAddresses: async () => {
    set({isLoading: true, error: null});
    try {
      const res = await fetch("http://localhost:4000/api/addresses", {
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      set({addresses: data.data, isLoading: false});
    } catch (err) {
      set({error: err.message, isLoading: false});
    }
  },

  clearAddresses: () => set({addresses: [], error: null}),
}));
