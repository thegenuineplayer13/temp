import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	AlertTriangle,
	CheckCircle2,
	Clock,
	Check,
	X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Notification, Alert, Request } from "@/features/core/types/types.notifications";
import { getPriorityColor, formatDateTime } from "./notification-utils";
import { InventoryAlertDetail } from "./details/inventory-alert-detail";
import { StaffAlertDetail } from "./details/staff-alert-detail";
import { OperationsAlertDetail } from "./details/operations-alert-detail";
import { SystemAlertDetail } from "./details/system-alert-detail";
import { RequestDetail } from "./details/request-detail";

interface NotificationsDetailProps {
	notification: Notification | null;
	onAcknowledge?: (id: string) => void;
	onResolve?: (id: string) => void;
	onApprove?: (id: string) => void;
	onReject?: (id: string) => void;
}

export function NotificationsDetail({
	notification,
	onAcknowledge,
	onResolve,
	onApprove,
	onReject,
}: NotificationsDetailProps) {
	if (!notification) {
		return (
			<div className="h-full flex items-center justify-center text-center p-8">
				<div className="space-y-2">
					<AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto" />
					<h3 className="font-semibold text-lg">No Notification Selected</h3>
					<p className="text-sm text-muted-foreground">
						Select a notification from the list to view details
					</p>
				</div>
			</div>
		);
	}

	const isAlert = notification.category === "alert";
	const priorityColors = getPriorityColor(notification.priority);

	const isCompleted = isAlert
		? notification.status === "resolved"
		: notification.status === "approved" || notification.status === "rejected";

	return (
		<ScrollArea className="h-full">
			<div className="p-6 space-y-6">
				{/* Header */}
				<div className="space-y-4">
					<div className="flex items-start justify-between gap-4">
						<div className="space-y-2 flex-1">
							<div className="flex items-center gap-2 flex-wrap">
								{/* Category badge */}
								<Badge
									variant="outline"
									className={cn(
										isAlert
											? "border-orange-500/50 text-orange-600 dark:text-orange-500"
											: "border-blue-500/50 text-blue-600 dark:text-blue-500",
									)}
								>
									{isAlert ? "Alert" : "Request"}
								</Badge>

								{/* Priority/Status badge */}
								<Badge
									variant={isCompleted ? "secondary" : "default"}
									className={cn(!isCompleted && priorityColors.badge)}
								>
									{isCompleted
										? isAlert
											? "Resolved"
											: notification.status === "approved"
												? "Approved"
												: "Rejected"
										: notification.priority.toUpperCase()}
								</Badge>

								{/* Type badge */}
								<Badge variant="outline" className="capitalize">
									{notification.type.replace(/-/g, " ")}
								</Badge>
							</div>
							<h1 className="text-2xl font-bold">{notification.title}</h1>
							<p className="text-muted-foreground">{notification.description}</p>
						</div>

						{/* Action buttons */}
						{isAlert && !isCompleted && (
							<div className="flex flex-col gap-2">
								{notification.status === "unread" && onAcknowledge && (
									<Button
										size="sm"
										variant="outline"
										onClick={() => onAcknowledge(notification.id)}
									>
										Acknowledge
									</Button>
								)}
								{notification.status === "acknowledged" && onResolve && (
									<Button size="sm" onClick={() => onResolve(notification.id)}>
										<CheckCircle2 className="h-4 w-4 mr-2" />
										Mark Resolved
									</Button>
								)}
							</div>
						)}

						{!isAlert && notification.status === "pending" && (
							<div className="flex flex-col gap-2">
								{onApprove && (
									<Button size="sm" onClick={() => onApprove(notification.id)}>
										<Check className="h-4 w-4 mr-2" />
										Approve
									</Button>
								)}
								{onReject && (
									<Button
										size="sm"
										variant="outline"
										onClick={() => onReject(notification.id)}
									>
										<X className="h-4 w-4 mr-2" />
										Reject
									</Button>
								)}
							</div>
						)}
					</div>

					{/* Timestamp info */}
					<div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
						<div className="flex items-center gap-1">
							<Clock className="h-4 w-4" />
							{formatDateTime(notification.createdAt)}
						</div>

						{notification.createdBy && (
							<>
								<Separator orientation="vertical" className="h-4" />
								<div>
									Requested by <span className="font-medium">{notification.createdBy.name}</span>
									{notification.createdBy.role && (
										<span className="text-xs ml-1">({notification.createdBy.role})</span>
									)}
								</div>
							</>
						)}

						{isCompleted && (
							<>
								<Separator orientation="vertical" className="h-4" />
								<div className="flex items-center gap-1">
									<CheckCircle2 className="h-4 w-4" />
									{isAlert
										? `Resolved by ${notification.resolvedBy?.name || "System"}`
										: `${notification.status === "approved" ? "Approved" : "Rejected"} by ${notification.reviewedBy?.name || "Manager"}`}
									{isAlert && notification.resolvedAt && (
										<span className="ml-1">on {formatDateTime(notification.resolvedAt)}</span>
									)}
									{!isAlert && notification.reviewedAt && (
										<span className="ml-1">on {formatDateTime(notification.reviewedAt)}</span>
									)}
								</div>
							</>
						)}
					</div>
				</div>

				<Separator />

				{/* Type-specific content */}
				{renderTypeSpecificDetail(notification, { onApprove, onReject })}
			</div>
		</ScrollArea>
	);
}

// Route to type-specific detail components
function renderTypeSpecificDetail(
	notification: Notification,
	actions: { onApprove?: (id: string) => void; onReject?: (id: string) => void },
) {
	if (notification.category === "request") {
		return <RequestDetail request={notification as Request} {...actions} />;
	}

	const alert = notification as Alert;

	// Inventory alerts
	if (
		alert.type === "inventory-low" ||
		alert.type === "inventory-out" ||
		alert.type === "inventory-expiring"
	) {
		return <InventoryAlertDetail alert={alert} />;
	}

	// Staff alerts
	if (
		alert.type === "staff-no-show" ||
		alert.type === "staff-late" ||
		alert.type === "staff-early-departure"
	) {
		return <StaffAlertDetail alert={alert} />;
	}

	// Operations alerts
	if (
		alert.type === "appointment-conflict" ||
		alert.type === "equipment-malfunction" ||
		alert.type === "maintenance-due"
	) {
		return <OperationsAlertDetail alert={alert} />;
	}

	// System alerts
	if (
		alert.type === "payment-failed" ||
		alert.type === "license-expiring" ||
		alert.type === "system-update"
	) {
		return <SystemAlertDetail alert={alert} />;
	}

	return null;
}
