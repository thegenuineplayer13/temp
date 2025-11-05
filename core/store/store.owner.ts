import { create } from "zustand";
import { persist } from "zustand/middleware";

interface DashboardState {
   dismissedAlerts: string[];
   dismissAlert: (alertId: string) => void;
   clearDismissedAlerts: () => void;
}

export const useOwnerStore = create<DashboardState>()(
   persist(
      (set) => ({
         dismissedAlerts: [],
         dismissAlert: (alertId: string) =>
            set((state) => ({
               dismissedAlerts: [...state.dismissedAlerts, alertId],
            })),
         clearDismissedAlerts: () => set({ dismissedAlerts: [] }),
      }),
      {
         name: "dashboard-storage",
      }
   )
);
