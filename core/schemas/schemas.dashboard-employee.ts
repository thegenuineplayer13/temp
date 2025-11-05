import { z } from "zod";

export const jobStatusSchema = z.enum(["pending", "in-progress", "completed"]);

export const currentJobSchema = z.object({
   clientName: z.string(),
   serviceType: z.string(),
   estimatedDuration: z.number(),
   status: jobStatusSchema,
   scheduledTime: z.string(),
});

export const appointmentSchema = z.object({
   id: z.string(),
   time: z.string(),
   clientName: z.string(),
   serviceType: z.string(),
   estimatedDuration: z.number(),
   location: z.string().optional(),
   specialNotes: z.string().optional(),
   isUrgent: z.boolean().optional(),
});

export const clientHistorySchema = z.object({
   clientName: z.string(),
   clientPhone: z.string().optional(),
   clientEmail: z.string().optional(),
   totalVisits: z.number(),
   lastVisit: z.object({
      date: z.string(),
      service: z.string(),
   }),
   preferences: z.array(z.string()),
   specialNotes: z.array(z.string()),
   pastIssues: z.array(z.string()),
   averageRating: z.number().min(0).max(5),
});

export const todayStatsSchema = z.object({
   jobsCompleted: z.number(),
   jobsRemaining: z.number(),
   averageRating: z.number().min(0).max(5),
   totalRevenue: z.number(),
   hoursWorked: z.number(),
});

export const employeeDashboardDataSchema = z.object({
   currentJob: currentJobSchema,
   upcomingAppointments: z.array(appointmentSchema),
   clientHistory: clientHistorySchema,
   todayStats: todayStatsSchema,
});

export const noteTypeSchema = z.enum(["job", "client", "completion", "issue", "upsell"]);

export const noteFormSchema = z.object({
   type: noteTypeSchema,
   content: z.string().min(1, "Note content is required"),
});

export const photoUploadSchema = z.object({
   beforePhoto: z.string().optional(),
   afterPhoto: z.string().optional(),
});
