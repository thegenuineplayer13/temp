import { z } from "zod";
import {
	notificationCategorySchema,
	priorityLevelSchema,
	alertTypeSchema,
	requestTypeSchema,
	alertStatusSchema,
	requestStatusSchema,
	baseNotificationSchema,
	alertSchema,
	requestSchema,
	notificationSchema,
	notificationStatsSchema,
	staffAvailabilityTierSchema,
	assignmentModeSchema,
	conflictStatusSchema,
	appointmentConflictSchema,
	replacementStaffSchema,
	dayAssignmentSchema,
	conflictDaySchema,
	workOfferSchema,
	staffLeavePreferencesSchema,
} from "@/features/core/schemas/schemas.notifications";

// ============================================================================
// Enums
// ============================================================================

export type NotificationCategory = z.infer<typeof notificationCategorySchema>;
export type PriorityLevel = z.infer<typeof priorityLevelSchema>;
export type AlertType = z.infer<typeof alertTypeSchema>;
export type RequestType = z.infer<typeof requestTypeSchema>;
export type AlertStatus = z.infer<typeof alertStatusSchema>;
export type RequestStatus = z.infer<typeof requestStatusSchema>;
export type StaffAvailabilityTier = z.infer<typeof staffAvailabilityTierSchema>;
export type AssignmentMode = z.infer<typeof assignmentModeSchema>;
export type ConflictStatus = z.infer<typeof conflictStatusSchema>;

// ============================================================================
// Notification Types
// ============================================================================

export type BaseNotification = z.infer<typeof baseNotificationSchema>;
export type Alert = z.infer<typeof alertSchema>;
export type Request = z.infer<typeof requestSchema>;
export type Notification = z.infer<typeof notificationSchema>;

// ============================================================================
// Stats
// ============================================================================

export type NotificationStats = z.infer<typeof notificationStatsSchema>;

// ============================================================================
// Conflict Resolution Types
// ============================================================================

export type AppointmentConflict = z.infer<typeof appointmentConflictSchema>;
export type ReplacementStaff = z.infer<typeof replacementStaffSchema>;
export type DayAssignment = z.infer<typeof dayAssignmentSchema>;
export type ConflictDay = z.infer<typeof conflictDaySchema>;
export type WorkOffer = z.infer<typeof workOfferSchema>;
export type StaffLeavePreferences = z.infer<typeof staffLeavePreferencesSchema>;

// ============================================================================
// Filter Types
// ============================================================================

export type NotificationFilter = {
	category: NotificationCategory | "all";
	priority: PriorityLevel | "all";
	status: "all" | "active" | "completed";
	type: AlertType | RequestType | "all";
};
