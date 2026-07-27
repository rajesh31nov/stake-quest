import { create } from "zustand";
import { UserDashboardStats } from "@/types/analytics";

interface AnalyticsStoreState {
  stats: UserDashboardStats | null;
  setStats: (stats: UserDashboardStats) => void;
}

export const useAnalyticsStore = create<AnalyticsStoreState>((set) => ({
  stats: null,
  setStats: (stats) => set({ stats }),
}));
