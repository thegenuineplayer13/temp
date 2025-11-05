import { create } from "zustand";
import type {
	NotificationCategory,
	PriorityLevel,
	AlertType,
	RequestType,
	Notification,
} from "@/features/core/types/types.notifications";

interface NotificationsState {
	// Filters
	categoryFilter: NotificationCategory | "all";
	priorityFilter: PriorityLevel | "all";
	statusFilter: "all" | "active" | "completed";
	typeFilter: AlertType | RequestType | "all";
	searchQuery: string;

	// Selected notification for detail view
	selectedNotificationId: string | null;
	detailOpen: boolean;

	// Modal states
	approvalModalOpen: boolean;
	notificationToApprove: Notification | null;

	// Actions - Filters
	setCategoryFilter: (category: NotificationCategory | "all") => void;
	setPriorityFilter: (priority: PriorityLevel | "all") => void;
	setStatusFilter: (status: "all" | "active" | "completed") => void;
	setTypeFilter: (type: AlertType | RequestType | "all") => void;
	setSearchQuery: (query: string) => void;
	clearFilters: () => void;

	// Actions - Detail View
	setSelectedNotification: (id: string | null) => void;
	openDetail: (id: string) => void;
	closeDetail: () => void;

	// Actions - Approval Modal
	openApprovalModal: (notification: Notification) => void;
	closeApprovalModal: () => void;
}

export const useNotificationsStore = create<NotificationsState>((set) => ({
	// Initial state - Filters
	categoryFilter: "all",
	priorityFilter: "all",
	statusFilter: "active",
	typeFilter: "all",
	searchQuery: "",

	// Initial state - Detail View
	selectedNotificationId: null,
	detailOpen: false,

	// Initial state - Modals
	approvalModalOpen: false,
	notificationToApprove: null,

	// Actions - Filters
	setCategoryFilter: (category) => set({ categoryFilter: category }),
	setPriorityFilter: (priority) => set({ priorityFilter: priority }),
	setStatusFilter: (status) => set({ statusFilter: status }),
	setTypeFilter: (type) => set({ typeFilter: type }),
	setSearchQuery: (query) => set({ searchQuery: query }),
	clearFilters: () =>
		set({
			categoryFilter: "all",
			priorityFilter: "all",
			statusFilter: "all",
			typeFilter: "all",
			searchQuery: "",
		}),

	// Actions - Detail View
	setSelectedNotification: (id) => set({ selectedNotificationId: id }),
	openDetail: (id) => set({ selectedNotificationId: id, detailOpen: true }),
	closeDetail: () => set({ selectedNotificationId: null, detailOpen: false }),

	// Actions - Approval Modal
	openApprovalModal: (notification) =>
		set({ approvalModalOpen: true, notificationToApprove: notification }),
	closeApprovalModal: () =>
		set({ approvalModalOpen: false, notificationToApprove: null }),
}));
