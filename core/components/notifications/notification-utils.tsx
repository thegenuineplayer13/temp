import {
	AlertTriangle,
	Package,
	PackageX,
	PackageOpen,
	UserX,
	Clock,
	LogOut,
	CalendarX,
	Wrench,
	Tool,
	CreditCard,
	FileText,
	RefreshCw,
	Calendar,
	Umbrella,
	Heart,
	Stethoscope,
	User,
	ArrowLeftRight,
	Settings,
	ShoppingCart,
	GraduationCap,
	Bell,
	ClipboardList,
	AlertCircle,
	FileCheck,
} from "lucide-react";
import type { AlertType, RequestType, PriorityLevel } from "@/features/core/types/types.notifications";

// ============================================================================
// Type Icons
// ============================================================================

export function getAlertTypeIcon(type: AlertType) {
	const iconMap: Record<AlertType, React.ElementType> = {
		// Inventory
		"inventory-low": Package,
		"inventory-out": PackageX,
		"inventory-expiring": PackageOpen,
		// Staff
		"staff-no-show": UserX,
		"staff-late": Clock,
		"staff-early-departure": LogOut,
		// Operations
		"appointment-conflict": CalendarX,
		"equipment-malfunction": Wrench,
		"maintenance-due": Tool,
		// System
		"payment-failed": CreditCard,
		"license-expiring": FileText,
		"system-update": RefreshCw,
	};

	return iconMap[type] || AlertTriangle;
}

export function getRequestTypeIcon(type: RequestType) {
	const iconMap: Record<RequestType, React.ElementType> = {
		// Time off
		"day-off": Calendar,
		vacation: Umbrella,
		"sick-leave": Stethoscope,
		"personal-day": User,
		bereavement: Heart,
		// Schedule
		"shift-swap": ArrowLeftRight,
		"schedule-change": Settings,
		// Other
		"equipment-request": ShoppingCart,
		"training-request": GraduationCap,
	};

	return iconMap[type] || ClipboardList;
}

// ============================================================================
// Urgency Indicators (for urgent and high priority notifications)
// ============================================================================

export function getUrgencyIndicatorIcon(category: "alert" | "request") {
	// Alerts get an exclamation mark (AlertCircle)
	// Requests get a check/approval icon (FileCheck)
	return category === "alert" ? AlertCircle : FileCheck;
}

export function shouldShowUrgencyIndicator(priority: PriorityLevel): boolean {
	return priority === "urgent" || priority === "high";
}

// ============================================================================
// Type Labels
// ============================================================================

export function getAlertTypeLabel(type: AlertType): string {
	const labelMap: Record<AlertType, string> = {
		"inventory-low": "Low Stock",
		"inventory-out": "Out of Stock",
		"inventory-expiring": "Expiring Soon",
		"staff-no-show": "No Show",
		"staff-late": "Late Arrival",
		"staff-early-departure": "Early Departure",
		"appointment-conflict": "Conflict",
		"equipment-malfunction": "Malfunction",
		"maintenance-due": "Maintenance",
		"payment-failed": "Payment Failed",
		"license-expiring": "License Expiring",
		"system-update": "Update Available",
	};

	return labelMap[type] || type;
}

export function getRequestTypeLabel(type: RequestType): string {
	const labelMap: Record<RequestType, string> = {
		"day-off": "Day Off",
		vacation: "Vacation",
		"sick-leave": "Sick Leave",
		"personal-day": "Personal Day",
		bereavement: "Bereavement",
		"shift-swap": "Shift Swap",
		"schedule-change": "Schedule Change",
		"equipment-request": "Equipment",
		"training-request": "Training",
	};

	return labelMap[type] || type;
}

// ============================================================================
// Priority Colors
// ============================================================================

export function getPriorityColor(priority: PriorityLevel): {
	badge: string;
	border: string;
	bg: string;
	text: string;
} {
	const colorMap: Record<
		PriorityLevel,
		{ badge: string; border: string; bg: string; text: string }
	> = {
		urgent: {
			badge: "bg-red-500 text-white",
			border: "border-red-500",
			bg: "bg-red-500/10",
			text: "text-red-600 dark:text-red-500",
		},
		high: {
			badge: "bg-orange-500 text-white",
			border: "border-orange-500",
			bg: "bg-orange-500/10",
			text: "text-orange-600 dark:text-orange-500",
		},
		medium: {
			badge: "bg-yellow-500 text-white",
			border: "border-yellow-500",
			bg: "bg-yellow-500/10",
			text: "text-yellow-600 dark:text-yellow-500",
		},
		low: {
			badge: "bg-blue-500 text-white",
			border: "border-blue-500",
			bg: "bg-blue-500/10",
			text: "text-blue-600 dark:text-blue-500",
		},
	};

	return colorMap[priority];
}

export function getPriorityLabel(priority: PriorityLevel): string {
	const labelMap: Record<PriorityLevel, string> = {
		urgent: "Urgent",
		high: "High Priority",
		medium: "Medium Priority",
		low: "Low Priority",
	};

	return labelMap[priority];
}

// ============================================================================
// Time Formatting
// ============================================================================

export function formatRelativeTime(dateString: string): string {
	const date = new Date(dateString);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffMins = Math.floor(diffMs / 60000);
	const diffHours = Math.floor(diffMs / 3600000);
	const diffDays = Math.floor(diffMs / 86400000);

	if (diffMins < 1) return "Just now";
	if (diffMins < 60) return `${diffMins}m ago`;
	if (diffHours < 24) return `${diffHours}h ago`;
	if (diffDays < 7) return `${diffDays}d ago`;

	return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function formatDate(dateString: string): string {
	const date = new Date(dateString);
	return date.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

export function formatDateTime(dateString: string): string {
	const date = new Date(dateString);
	return date.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
		hour: "numeric",
		minute: "2-digit",
	});
}
