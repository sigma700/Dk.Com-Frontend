import {create} from "zustand";

export const useOrdersStore = create((set, get) => ({
  orders: [],
  isLoading: false,
  error: null,
  pagination: {page: 1, limit: 10, total: 0, pages: 0},

  fetchAllOrders: async (page = 1, limit = 10, status = null) => {
    set({isLoading: true, error: null});
    try {
      const params = new URLSearchParams({page, limit});
      if (status) params.append("status", status);

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/store/orders?${params}`,
        {
          credentials: "include",
        },
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch orders");
      }

      const data = await res.json();
      set({
        orders: data.data,
        pagination: data.pagination,
        isLoading: false,
      });
    } catch (err) {
      set({error: err.message, isLoading: false});
    }
  },

  fetchOrdersByStatus: async (status) => {
    const {pagination} = get();
    return get().fetchAllOrders(pagination.page, pagination.limit, status);
  },

  fetchNextPage: async () => {
    const {pagination} = get();
    if (pagination.page >= pagination.pages) return;
    return get().fetchAllOrders(pagination.page + 1, pagination.limit);
  },

  fetchPrevPage: async () => {
    const {pagination} = get();
    if (pagination.page <= 1) return;
    return get().fetchAllOrders(pagination.page - 1, pagination.limit);
  },

  clearOrders: () =>
    set({
      orders: [],
      pagination: {page: 1, limit: 10, total: 0, pages: 0},
      error: null,
    }),
}));
