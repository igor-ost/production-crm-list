import { Orders } from "@/components/orders/orders-table";
import { create } from "zustand";

export interface MaterialConsumptions {
  id:string;
  material_id:string;
  material_type: string;
  qty:string;
  order: Orders;
  createdAt:string;
  updatedAt:string;
}

type MaterialConsumptionsState = {
  materialConsumptions: MaterialConsumptions[];
  setMaterialConsumptions: (materialConsumptions: MaterialConsumptions[]) => void;
};

export const materialConsumptionsStore = create<MaterialConsumptionsState>((set) => ({
  materialConsumptions: [],
  setMaterialConsumptions: (materialConsumptions) => set({ materialConsumptions }),

}));
