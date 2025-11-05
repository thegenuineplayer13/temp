import { useQuery } from "@/mock/mock-react-query";
import {
   calendarEmployeeSchema,
   calendarAppointmentSchema,
   timeOffEntrySchema,
   workingHoursSchema,
} from "@/features/core/schemas/schemas.calendar";
import type { CalendarEmployee, CalendarAppointment, TimeOffEntry, WorkingHours } from "@/features/core/types/types.calendar";
import {
   mockCalendarEmployees,
   mockCalendarAppointments,
   mockTimeOffEntries,
   mockWorkingHours,
} from "@/mock/calendar-viewer-mock";

export const QUERY_KEYS = {
   employees: ["calendar-employees"],
   appointments: ["calendar-appointments"],
   timeOff: ["calendar-time-off"],
   workingHours: ["calendar-working-hours"],
} satisfies Record<string, readonly string[]>;

export function useCalendarEmployees() {
   return useQuery<CalendarEmployee[]>({
      queryKey: QUERY_KEYS.employees,
      queryFn: () => {
         const validated = mockCalendarEmployees.map((emp) => calendarEmployeeSchema.parse(emp));
         return validated;
      },
   });
}

export function useCalendarAppointments() {
   return useQuery<CalendarAppointment[]>({
      queryKey: QUERY_KEYS.appointments,
      queryFn: () => {
         const validated = mockCalendarAppointments.map((apt) => calendarAppointmentSchema.parse(apt));
         return validated;
      },
   });
}

export function useTimeOffEntries() {
   return useQuery<TimeOffEntry[]>({
      queryKey: QUERY_KEYS.timeOff,
      queryFn: () => {
         const validated = mockTimeOffEntries.map((entry) => timeOffEntrySchema.parse(entry));
         return validated;
      },
   });
}

export function useWorkingHours() {
   return useQuery<WorkingHours[]>({
      queryKey: QUERY_KEYS.workingHours,
      queryFn: () => {
         const validated = mockWorkingHours.map((hours) => workingHoursSchema.parse(hours));
         return validated;
      },
   });
}
