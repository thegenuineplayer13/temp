import type z from "zod";
import type {
   appointmentStatusSchema,
   timeOffTypeSchema,
   calendarEmployeeSchema,
   calendarAppointmentSchema,
   timeOffEntrySchema,
   workingHoursSchema,
   viewModeSchema,
} from "../schemas/schemas.calendar";

export type AppointmentStatus = z.infer<typeof appointmentStatusSchema>;
export type TimeOffType = z.infer<typeof timeOffTypeSchema>;
export type CalendarEmployee = z.infer<typeof calendarEmployeeSchema>;
export type CalendarAppointment = z.infer<typeof calendarAppointmentSchema>;
export type TimeOffEntry = z.infer<typeof timeOffEntrySchema>;
export type WorkingHours = z.infer<typeof workingHoursSchema>;
export type ViewMode = z.infer<typeof viewModeSchema>;
