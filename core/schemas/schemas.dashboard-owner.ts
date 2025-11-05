import { z } from "zod";

export const trendSchema = z.enum(["up", "down", "stable"]);

export const alertSchema = z.object({
   id: z.string(),
   message: z.string(),
   type: z.string(),
   resolved: z.boolean(),
});

export const chartDataPointSchema = z.object({
   day: z.string(),
   revenue: z.number(),
});

export const reviewSchema = z.object({
   id: z.string(),
   customerName: z.string(),
   rating: z.number().min(0).max(5),
   comment: z.string(),
   service: z.string(),
   employee: z.string(),
   sentiment: z.string(),
   responded: z.boolean(),
   date: z.string(),
   responseText: z.string().optional(),
});

export const serviceSchema = z.object({
   id: z.string(),
   name: z.string(),
   revenue: z.number(),
   percentage: z.number(),
   bookings: z.number(),
   avgPrice: z.number(),
   growth: z.number(),
   popularWith: z.string(),
});

export const staffMemberSchema = z.object({
   id: z.string(),
   name: z.string(),
   avatar: z.string(),
   role: z.string(),
   status: z.string(),
   specialization: z.string(),
   todayJobs: z.number(),
   todayRevenue: z.number(),
   weekRevenue: z.number().optional(),
   efficiency: z.number(),
   rating: z.number().min(0).max(5),
   totalReviews: z.number().optional(),
   checkInTime: z.string().optional(),
   customerSatisfaction: z.number().optional(),
});

export const performerSchema = z.object({
   name: z.string(),
   avatar: z.string(),
   metric: z.string(),
   value: z.string(),
});

export const revenueDataSchema = z.object({
   today: z.number(),
   yesterday: z.number(),
   thisWeek: z.number(),
   weekAverage: z.number(),
   trend: trendSchema,
   percentageChange: z.number(),
   weeklyTrend: trendSchema,
   weeklyPercentageChange: z.number(),
   chartData: z.array(chartDataPointSchema),
   serviceBreakdown: z.array(
      z.object({
         service: z.string(),
         revenue: z.number(),
         percentage: z.number(),
         color: z.string(),
      })
   ),
});

export const jobsDataSchema = z.object({
   completedToday: z.number(),
   scheduledToday: z.number(),
   scheduledTomorrow: z.number(),
   completionRate: z.number(),
   averageJobValue: z.number(),
});

export const staffDataSchema = z.object({
   presentToday: z.number(),
   totalStaff: z.number(),
   attendanceRate: z.number(),
   topPerformers: z.array(performerSchema),
   staff: z.array(staffMemberSchema),
});

export const reviewsDataSchema = z.object({
   averageRating: z.number().min(0).max(5),
   totalReviews: z.number(),
   recentReviews: z.array(reviewSchema),
});

export const alertsDataSchema = z.object({
   alerts: z.array(alertSchema),
});
