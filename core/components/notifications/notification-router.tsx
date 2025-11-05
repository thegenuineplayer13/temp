import type { Notification, Alert, Request } from "@/features/core/types/types.notifications";
import { InventoryAlertRender } from "./renders/inventory-alert-render";
import { StaffAlertRender } from "./renders/staff-alert-render";
import { GeneralAlertRender } from "./renders/general-alert-render";
import { RequestRender } from "./renders/request-render";

interface NotificationRouterProps {
	notification: Notification;
	onClick?: () => void;
	isSelected?: boolean;
	onAcknowledge?: (id: string) => void;
	onResolve?: (id: string) => void;
	onApprove?: (id: string) => void;
	onReject?: (id: string) => void;
}

/**
 * Router component that renders the appropriate notification component
 * based on the notification category and type
 */
export function NotificationRouter({
	notification,
	onClick,
	isSelected,
	onAcknowledge,
	onResolve,
	onApprove,
	onReject,
}: NotificationRouterProps) {
	// Handle requests
	if (notification.category === "request") {
		return (
			<RequestRender
				request={notification as Request}
				onClick={onClick}
				isSelected={isSelected}
				onApprove={onApprove}
				onReject={onReject}
			/>
		);
	}

	// Handle alerts by type
	const alert = notification as Alert;

	// Inventory alerts
	if (
		alert.type === "inventory-low" ||
		alert.type === "inventory-out" ||
		alert.type === "inventory-expiring"
	) {
		return (
			<InventoryAlertRender
				alert={alert}
				onClick={onClick}
				isSelected={isSelected}
				onAcknowledge={onAcknowledge}
				onResolve={onResolve}
			/>
		);
	}

	// Staff alerts
	if (
		alert.type === "staff-no-show" ||
		alert.type === "staff-late" ||
		alert.type === "staff-early-departure"
	) {
		return (
			<StaffAlertRender
				alert={alert}
				onClick={onClick}
				isSelected={isSelected}
				onAcknowledge={onAcknowledge}
				onResolve={onResolve}
			/>
		);
	}

	// All other alerts (operations, system, etc.)
	return (
		<GeneralAlertRender
			alert={alert}
			onClick={onClick}
			isSelected={isSelected}
			onAcknowledge={onAcknowledge}
			onResolve={onResolve}
		/>
	);
}
