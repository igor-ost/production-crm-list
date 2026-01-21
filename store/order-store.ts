import { Orders } from "@/components/orders/orders-table";
import { create } from "zustand";

type OrderState = {
  orders: Orders[];
  setOrders: (orders: Orders[]) => void;
};

export const ordersStore = create<OrderState>((set) => ({
  orders: [],
  setOrders: (orders) => set({ orders }),

}));
