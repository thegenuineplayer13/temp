import { create } from "zustand";
import type { CurrentJob, JobStatus } from "../types/types.dashboard-employee";

interface EmployeeState {
   currentJob: CurrentJob | null;
   elapsedTime: number;
   isTimerRunning: boolean;

   setCurrentJob: (job: CurrentJob) => void;
   updateJobStatus: (status: JobStatus) => void;
   setElapsedTime: (time: number) => void;
   setIsTimerRunning: (running: boolean) => void;
   resetTimer: () => void;
}

export const useEmployeeStore = create<EmployeeState>((set) => ({
   currentJob: null,
   elapsedTime: 0,
   isTimerRunning: false,

   setCurrentJob: (job) => set({ currentJob: job }),

   updateJobStatus: (status) =>
      set((state) => ({
         currentJob: state.currentJob ? { ...state.currentJob, status } : null,
      })),

   setElapsedTime: (time) => set({ elapsedTime: time }),

   setIsTimerRunning: (running) => set({ isTimerRunning: running }),

   resetTimer: () => set({ elapsedTime: 0, isTimerRunning: false }),
}));
