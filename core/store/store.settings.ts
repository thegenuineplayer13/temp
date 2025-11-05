import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Profile } from "@/features/core/types/types.settings";

interface SettingsState {
   profile: Profile;
   activeSection: string;
   updateProfile: (updates: Partial<Profile>) => void;
   setActiveSection: (section: string) => void;
   resetProfile: (profile: Profile) => void;
}

export const useSettingsStore = create<SettingsState>()(
   persist(
      (set) => ({
         profile: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            bio: "",
            businessName: "",
            businessType: "salon",
            address: "",
            workingHours: { start: "09:00", end: "17:00" },
            businessDescription: "",
            notifications: {
               email: true,
               sms: true,
               push: true,
               marketing: false,
            },
            appearance: {
               theme: "system",
               language: "en",
            },
            security: {
               twoFactor: false,
            },
         },
         activeSection: "profile",

         updateProfile: (updates) =>
            set((state) => ({
               profile: { ...state.profile, ...updates },
            })),

         setActiveSection: (section) => set({ activeSection: section }),

         resetProfile: (profile) => set({ profile }),
      }),
      {
         name: "settings-storage",
      }
   )
);
