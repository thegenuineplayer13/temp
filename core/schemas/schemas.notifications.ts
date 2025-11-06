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

// Conflict Resolution
export const staffAvailabilityTierSchema = z.enum([
	"available",
	"needs-approval",
	"unavailable",
]);

export const assignmentModeSchema = z.enum(["single", "split", "individual"]);

export const conflictStatusSchema = z.enum(["pending", "reassigned", "needs-cancellation", "offered"]);

// ============================================================================
// Conflict Resolution Schemas
// ============================================================================

export const appointmentConflictSchema = z.object({
	id: z.string(),
	date: z.string(),
	startTime: z.string(),
	endTime: z.string(),
	clientName: z.string(),
	clientPhone: z.string().optional(),
	services: z.array(
		z.object({
			id: z.string(),
			name: z.string(),
			specializationId: z.string(),
			duration: z.number(),
		}),
	),
	status: conflictStatusSchema,
	replacementStaffId: z.string().optional(),
	replacementStaffName: z.string().optional(),
	notes: z.string().optional(),
});

export const replacementStaffSchema = z.object({
	id: z.string(),
	name: z.string(),
	avatar: z.string().optional(),
	specializationIds: z.array(z.string()),
	availability: staffAvailabilityTierSchema,
	leaveType: z.enum(["vacation", "personal-day", "day-off", "sick-leave"]).optional(),
	willingToWork: z.boolean().optional(),
	existingAppointments: z.number(),
	hoursScheduled: z.number(),
	canTakeFullDay: z.boolean(),
	canTakeServiceIds: z.array(z.string()),
	unavailableReason: z.string().optional(),
});

export const dayAssignmentSchema = z.object({
	fullDay: z
		.object({
			staffId: z.string(),
			staffName: z.string(),
			appointmentIds: z.array(z.string()),
		})
		.optional(),
	bySpecialization: z
		.array(
			z.object({
				specializationId: z.string(),
				staffId: z.string(),
				staffName: z.string(),
				appointmentIds: z.array(z.string()),
			}),
		)
		.optional(),
	individual: z
		.array(
			z.object({
				appointmentId: z.string(),
				staffId: z.string(),
				staffName: z.string(),
			}),
		)
		.optional(),
});

export const conflictDaySchema = z.object({
	date: z.string(),
	appointments: z.array(appointmentConflictSchema),
	totalAppointments: z.number(),
	requiredSpecializationIds: z.array(z.string()),
	assignmentMode: assignmentModeSchema,
	assignments: dayAssignmentSchema,
	isResolved: z.boolean(),
});

export const workOfferSchema = z.object({
	id: z.string(),
	type: z.literal("time-off-coverage"),
	fromRequestId: z.string(),
	targetStaffId: z.string(),
	targetStaffName: z.string(),
	offeredBy: z.object({
		id: z.string(),
		name: z.string(),
	}),
	coverageDetails: z.object({
		date: z.string(),
		appointments: z.array(appointmentConflictSchema),
		totalHours: z.number(),
		estimatedRevenue: z.number().optional(),
	}),
	compensation: z
		.object({
			overtimePay: z.boolean(),
			bonusAmount: z.number().optional(),
			timeOffCredit: z.number().optional(),
		})
		.optional(),
	status: z.enum(["pending", "accepted", "declined"]),
	respondedAt: z.string().optional(),
	expiresAt: z.string(),
	createdAt: z.string(),
});

export const staffLeavePreferencesSchema = z.object({
	employeeId: z.string(),
	willingToWorkDuringLeave: z.boolean(),
	preferredCompensation: z.enum(["overtime", "time-credit", "bonus"]),
	minimumNoticeHours: z.number(),
	maxHoursPerLeaveDay: z.number().optional(),
	blackoutDates: z.array(z.string()).optional(),
});

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
	conflicts: z
		.object({
			total: z.number(),
			resolved: z.number(),
			days: z.array(conflictDaySchema),
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
