import { create } from "zustand";
import type { DateRange } from "@/lib/types";

interface UIState {
  sidebarOpen: boolean;
  dateRange: DateRange;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setDateRange: (range: DateRange) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  dateRange: "30d",
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setDateRange: (range) => set({ dateRange: range }),
}));
