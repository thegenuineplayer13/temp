import { useEffect } from "react";
import { useEmployeeStore } from "../store/store.employee";

export function useJobTimer() {
   const { elapsedTime, isTimerRunning, setElapsedTime } = useEmployeeStore();

   useEffect(() => {
      let interval: ReturnType<typeof setInterval>;

      if (isTimerRunning) {
         interval = setInterval(() => {
            setElapsedTime(elapsedTime + 1);
         }, 1000);
      }

      return () => {
         if (interval) clearInterval(interval);
      };
   }, [isTimerRunning, elapsedTime, setElapsedTime]);

   const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
   };

   return {
      elapsedTime,
      isTimerRunning,
      formattedTime: formatTime(elapsedTime),
   };
}
