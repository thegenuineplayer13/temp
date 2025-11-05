import type z from "zod";
import type {
   trendSchema,
   alertSchema,
   chartDataPointSchema,
   reviewSchema,
   serviceSchema,
   staffMemberSchema,
   performerSchema,
   revenueDataSchema,
   jobsDataSchema,
   staffDataSchema,
   reviewsDataSchema,
   alertsDataSchema,
} from "../schemas/schemas.dashboard-owner";

export type Trend = z.infer<typeof trendSchema>;
export type Alert = z.infer<typeof alertSchema>;
export type ChartDataPoint = z.infer<typeof chartDataPointSchema>;
export type Review = z.infer<typeof reviewSchema>;
export type Service = z.infer<typeof serviceSchema>;
export type StaffMember = z.infer<typeof staffMemberSchema>;
export type Performer = z.infer<typeof performerSchema>;
export type RevenueData = z.infer<typeof revenueDataSchema>;
export type JobsData = z.infer<typeof jobsDataSchema>;
export type StaffData = z.infer<typeof staffDataSchema>;
export type ReviewsData = z.infer<typeof reviewsDataSchema>;
export type AlertsData = z.infer<typeof alertsDataSchema>;
