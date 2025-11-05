import { z } from "zod";

export const appointmentStatusSchema = z.enum(["confirmed", "running-late", "in-progress", "completed", "cancelled", "no-show"]);

export const timeOffTypeSchema = z.enum(["day-off", "vacation", "sick", "holiday", "unpaid"]);

export const calendarEmployeeSchema = z.object({
   id: z.string(),
   name: z.string(),
   role: z.string(),
   color: z.string(),
   avatar: z.string().optional(),
});

export const calendarAppointmentSchema = z.object({
   id: z.string(),
   employeeId: z.string(),
   clientName: z.string(),
   service: z.string(),
   startTime: z.string(),
   endTime: z.string(),
   duration: z.number(),
   status: appointmentStatusSchema,
   isUrgent: z.boolean().optional(),
   notes: z.string().optional(),
});

export const timeOffEntrySchema = z.object({
   id: z.string(),
   employeeId: z.string(),
   type: timeOffTypeSchema,
   startDate: z.string(),
   endDate: z.string(),
   reason: z.string().optional(),
   approved: z.boolean(),
});

export const workingHoursSchema = z.object({
   employeeId: z.string(),
   dayOfWeek: z.number().min(0).max(6),
   startTime: z.string(),
   endTime: z.string(),
   isWorkingDay: z.boolean(),
});

export const viewModeSchema = z.enum(["day", "week", "month"]);
