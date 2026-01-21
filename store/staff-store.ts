import { Staff } from "@/components/staff/staff-table";
import { create } from "zustand";

type StaffState = {
  staff: Staff[];
  setStaff: (staff: Staff[]) => void;
};

export const staffsStore = create<StaffState>((set) => ({
  staff: [],
  setStaff: (staff) => set({ staff }),

}));
