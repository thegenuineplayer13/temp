import type z from "zod";
import type {
   jobStatusSchema,
   currentJobSchema,
   appointmentSchema,
   clientHistorySchema,
   todayStatsSchema,
   employeeDashboardDataSchema,
   noteTypeSchema,
   noteFormSchema,
   photoUploadSchema,
} from "../schemas/schemas.dashboard-employee";

export type JobStatus = z.infer<typeof jobStatusSchema>;
export type CurrentJob = z.infer<typeof currentJobSchema>;
export type Appointment = z.infer<typeof appointmentSchema>;
export type ClientHistory = z.infer<typeof clientHistorySchema>;
export type TodayStats = z.infer<typeof todayStatsSchema>;
export type EmployeeDashboardData = z.infer<typeof employeeDashboardDataSchema>;
export type NoteType = z.infer<typeof noteTypeSchema>;
export type NoteForm = z.infer<typeof noteFormSchema>;
export type PhotoUpload = z.infer<typeof photoUploadSchema>;
