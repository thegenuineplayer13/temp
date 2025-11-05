import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	notificationSchema,
	notificationStatsSchema,
} from "@/features/core/schemas/schemas.notifications";
import type { Notification, NotificationStats } from "@/features/core/types/types.notifications";
import { mockNotifications, mockNotificationStats } from "@/mock/mock-notifications";

// ============================================================================
// Query Keys
// ============================================================================

export const NOTIFICATION_QUERY_KEYS = {
	all: ["notifications"] as const,
	stats: ["notifications", "stats"] as const,
	detail: (id: string) => ["notifications", "detail", id] as const,
};

// ============================================================================
// Queries
// ============================================================================

/**
 * Fetch all notifications (alerts and requests)
 */
export function useNotifications() {
	return useQuery<Notification[]>({
		queryKey: NOTIFICATION_QUERY_KEYS.all,
		queryFn: async () => {
			// Simulate API delay
			await new Promise((resolve) => setTimeout(resolve, 300));

			// Validate each notification against the schema
			const validated = mockNotifications.map((notification) =>
				notificationSchema.parse(notification),
			);

			return validated;
		},
	});
}

/**
 * Fetch notification statistics
 */
export function useNotificationStats() {
	return useQuery<NotificationStats>({
		queryKey: NOTIFICATION_QUERY_KEYS.stats,
		queryFn: async () => {
			// Simulate API delay
			await new Promise((resolve) => setTimeout(resolve, 200));

			// Validate stats against schema
			const validated = notificationStatsSchema.parse(mockNotificationStats);

			return validated;
		},
	});
}

/**
 * Fetch a single notification by ID
 */
export function useNotification(id: string | null) {
	return useQuery<Notification | null>({
		queryKey: NOTIFICATION_QUERY_KEYS.detail(id || ""),
		queryFn: async () => {
			if (!id) return null;

			// Simulate API delay
			await new Promise((resolve) => setTimeout(resolve, 150));

			const notification = mockNotifications.find((n) => n.id === id);
			if (!notification) return null;

			return notificationSchema.parse(notification);
		},
		enabled: !!id,
	});
}

// ============================================================================
// Mutations
// ============================================================================

/**
 * Acknowledge an alert
 */
export function useAcknowledgeAlert() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (alertId: string) => {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 500));

			console.log("Acknowledged alert:", alertId);
			return { success: true, alertId };
		},
		onSuccess: () => {
			// Invalidate queries to refetch data
			queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.all });
			queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.stats });
		},
	});
}

/**
 * Resolve an alert
 */
export function useResolveAlert() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (alertId: string) => {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 500));

			console.log("Resolved alert:", alertId);
			return { success: true, alertId };
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.all });
			queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.stats });
		},
	});
}

/**
 * Approve a request
 */
export function useApproveRequest() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ requestId, notes }: { requestId: string; notes?: string }) => {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 500));

			console.log("Approved request:", requestId, notes);
			return { success: true, requestId };
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.all });
			queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.stats });
		},
	});
}

/**
 * Reject a request
 */
export function useRejectRequest() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ requestId, notes }: { requestId: string; notes?: string }) => {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 500));

			console.log("Rejected request:", requestId, notes);
			return { success: true, requestId };
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.all });
			queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.stats });
		},
	});
}
