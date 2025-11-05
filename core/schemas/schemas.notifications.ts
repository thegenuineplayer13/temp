import { z } from "zod";

// ============================================================================
// Enums
// ============================================================================

export const notificationCategorySchema = z.enum(["alert", "request"]);

export const priorityLevelSchema = z.enum(["urgent", "high", "medium", "low"]);

// Alert Types
export const alertTypeSchema = z.enum([
	// Inventory alerts
	"inventory-low",
	"inventory-out",
	"inventory-expiring",
	// Staff alerts
	"staff-no-show",
	"staff-late",
	"staff-early-departure",
	// Operations alerts
	"appointment-conflict",
	"equipment-malfunction",
	"maintenance-due",
	// System alerts
	"payment-failed",
	"license-expiring",
	"system-update",
]);

// Request Types
export const requestTypeSchema = z.enum([
	// Time off requests
	"day-off",
	"vacation",
	"sick-leave",
	"personal-day",
	"bereavement",
	// Schedule requests
	"shift-swap",
	"schedule-change",
	// Other requests
	"equipment-request",
	"training-request",
]);

export const alertStatusSchema = z.enum(["unread", "acknowledged", "resolved"]);

export const requestStatusSchema = z.enum(["pending", "approved", "rejected"]);

// ============================================================================
// Base Notification Schema
// ============================================================================

export const baseNotificationSchema = z.object({
	id: z.string(),
	category: notificationCategorySchema,
	priority: priorityLevelSchema,
	title: z.string(),
	description: z.string(),
	createdAt: z.string(),
	createdBy: z
		.object({
			id: z.string(),
			name: z.string(),
			role: z.string().optional(),
		})
		.optional(),
	metadata: z.record(z.unknown()).optional(),
});

// ============================================================================
// Alert Schema
// ============================================================================

export const alertSchema = baseNotificationSchema.extend({
	category: z.literal("alert"),
	type: alertTypeSchema,
	status: alertStatusSchema,
	acknowledgedAt: z.string().optional(),
	resolvedAt: z.string().optional(),
	resolvedBy: z
		.object({
			id: z.string(),
			name: z.string(),
		})
		.optional(),
	affectedEntities: z
		.array(
			z.object({
				id: z.string(),
				type: z.string(),
				name: z.string(),
			}),
		)
		.optional(),
	actionRequired: z.boolean().default(false),
	actionUrl: z.string().optional(),
});

// ============================================================================
// Request Schema
// ============================================================================

export const requestSchema = baseNotificationSchema.extend({
	category: z.literal("request"),
	type: requestTypeSchema,
	status: requestStatusSchema,
	requestedDates: z.array(z.string()).optional(),
	startDate: z.string().optional(),
	endDate: z.string().optional(),
	duration: z.number().optional(), // in hours or days
	reason: z.string().optional(),
	reviewedAt: z.string().optional(),
	reviewedBy: z
		.object({
			id: z.string(),
			name: z.string(),
		})
		.optional(),
	reviewNotes: z.string().optional(),
	affectedAppointments: z.number().optional(),
	replacement: z
		.object({
			id: z.string(),
			name: z.string(),
		})
		.optional(),
});

// ============================================================================
// Union Type for All Notifications
// ============================================================================

export const notificationSchema = z.discriminatedUnion("category", [alertSchema, requestSchema]);

// ============================================================================
// Stats Schema
// ============================================================================

export const notificationStatsSchema = z.object({
	total: z.number(),
	unreadAlerts: z.number(),
	pendingRequests: z.number(),
	urgentCount: z.number(),
	highCount: z.number(),
	mediumCount: z.number(),
	lowCount: z.number(),
	todayCount: z.number(),
	thisWeekCount: z.number(),
});
