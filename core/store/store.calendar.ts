import { create } from "zustand";
import type { ViewMode, CalendarAppointment } from "@/features/core/types/types.calendar";

interface CalendarState {
   viewMode: ViewMode;
   currentDate: Date;
   selectedAppointment: CalendarAppointment | null;
   detailOpen: boolean;
   shiftStart: number;
   shiftEnd: number;
   setViewMode: (mode: ViewMode) => void;
   setCurrentDate: (date: Date) => void;
   setSelectedAppointment: (appointment: CalendarAppointment | null) => void;
   setDetailOpen: (open: boolean) => void;
   setShiftHours: (start: number, end: number) => void;
   previousPeriod: () => void;
   nextPeriod: () => void;
   goToToday: () => void;
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
   viewMode: "day",
   currentDate: new Date(),
   selectedAppointment: null,
   detailOpen: false,
   shiftStart: 19,
   shiftEnd: 24,

   setViewMode: (mode) => set({ viewMode: mode }),
   setCurrentDate: (date) => set({ currentDate: date }),
   setSelectedAppointment: (appointment) => set({ selectedAppointment: appointment }),
   setDetailOpen: (open) => set({ detailOpen: open }),
   setShiftHours: (start, end) => set({ shiftStart: start, shiftEnd: end }),

   previousPeriod: () => {
      const { currentDate, viewMode } = get();
      if (viewMode === "now") return; // No navigation for "now" view

      const newDate = new Date(currentDate);

      switch (viewMode) {
         case "day":
            newDate.setDate(newDate.getDate() - 1);
            break;
         case "week":
            newDate.setDate(newDate.getDate() - 7);
            break;
         case "month":
            newDate.setMonth(newDate.getMonth() - 1);
            break;
      }

      set({ currentDate: newDate });
   },

   nextPeriod: () => {
      const { currentDate, viewMode } = get();
      if (viewMode === "now") return; // No navigation for "now" view

      const newDate = new Date(currentDate);

      switch (viewMode) {
         case "day":
            newDate.setDate(newDate.getDate() + 1);
            break;
         case "week":
            newDate.setDate(newDate.getDate() + 7);
            break;
         case "month":
            newDate.setMonth(newDate.getMonth() + 1);
            break;
      }

      set({ currentDate: newDate });
   },

   goToToday: () => set({ currentDate: new Date() }),
}));
