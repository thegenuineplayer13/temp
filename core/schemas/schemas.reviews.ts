import { z } from "zod";

// Customer type enum
export const customerTypeSchema = z.enum(["client", "walk-in"]);

// Review read status
export const readStatusSchema = z.enum(["read", "unread"]);

// Review sentiment
export const sentimentSchema = z.enum(["positive", "neutral", "negative"]);

// Individual review
export const reviewSchema = z.object({
	id: z.string(),
	customerName: z.string(),
	customerType: customerTypeSchema,
	customerId: z.string().optional(),
	rating: z.number().min(0).max(5),
	comment: z.string(),
	service: z.string(),
	serviceId: z.string(),
	employee: z.string(),
	employeeId: z.string(),
	date: z.string(),
	sentiment: sentimentSchema,
	isRead: z.boolean(),
	responded: z.boolean(),
	responseText: z.string().optional(),
	responseDate: z.string().optional(),
	flagged: z.boolean().optional(),
});

// Stats data for header
export const reviewStatsSchema = z.object({
	totalReviews: z.number(),
	averageRating: z.number().min(0).max(5),
	unreadCount: z.number(),
	positiveCount: z.number(),
	neutralCount: z.number(),
	negativeCount: z.number(),
	responseRate: z.number().min(0).max(100),
	thisMonthCount: z.number(),
	lastMonthCount: z.number(),
	monthlyTrend: z.enum(["up", "down", "stable"]),
	monthlyPercentageChange: z.number(),
});

// Rating distribution
export const ratingDistributionSchema = z.object({
	rating: z.number(),
	count: z.number(),
	percentage: z.number(),
});
