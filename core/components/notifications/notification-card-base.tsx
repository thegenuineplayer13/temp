import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Bell, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Notification } from "@/features/core/types/types.notifications";
import {
	getPriorityColor,
	formatRelativeTime,
	getAlertTypeIcon,
	getRequestTypeIcon,
	getAlertTypeLabel,
	getRequestTypeLabel,
} from "./notification-utils";

interface NotificationCardBaseProps {
	notification: Notification;
	onClick?: () => void;
	children?: React.ReactNode;
	isSelected?: boolean;
}

export function NotificationCardBase({
	notification,
	onClick,
	children,
	isSelected,
}: NotificationCardBaseProps) {
	const priorityColors = getPriorityColor(notification.priority);
	const isAlert = notification.category === "alert";
	const isCritical = notification.priority === "urgent" || notification.priority === "high";

	// Get the appropriate icon for the type
	const TypeIcon = isAlert
		? getAlertTypeIcon(notification.type)
		: getRequestTypeIcon(notification.type);

	// Get the type label
	const typeLabel = isAlert
		? getAlertTypeLabel(notification.type)
		: getRequestTypeLabel(notification.type);

	// Category icon (top right)
	const CategoryIcon = isAlert ? AlertTriangle : ClipboardList;

	return (
		<Card
			className={cn(
				"relative overflow-hidden transition-all cursor-pointer",
				"hover:shadow-md",
				isSelected && "ring-2 ring-primary",
				isCritical && notification.category === "alert" && priorityColors.bg,
			)}
			onClick={onClick}
		>
			{/* Category indicator - top right */}
			<div className="absolute top-3 right-3">
				<CategoryIcon
					className={cn(
						"h-4 w-4",
						isAlert ? "text-orange-500" : "text-blue-500",
					)}
				/>
			</div>

			<div className="p-4">
				{/* Header: Type Icon + Title + Time */}
				<div className="flex items-start gap-3 mb-2">
					<div
						className={cn(
							"rounded-full p-2 flex-shrink-0",
							priorityColors.bg,
						)}
					>
						<TypeIcon className={cn("h-4 w-4", priorityColors.text)} />
					</div>

					<div className="flex-1 min-w-0">
						<div className="flex items-start justify-between gap-2 mb-1">
							<h3 className="font-semibold text-sm leading-tight">
								{notification.title}
							</h3>
						</div>

						<div className="flex items-center gap-2 mb-2">
							<Badge variant="secondary" className="text-xs">
								{typeLabel}
							</Badge>
							<Badge className={cn("text-xs", priorityColors.badge)}>
								{notification.priority.toUpperCase()}
							</Badge>
							<span className="text-xs text-muted-foreground">
								{formatRelativeTime(notification.createdAt)}
							</span>
						</div>

						<p className="text-sm text-muted-foreground leading-relaxed">
							{notification.description}
						</p>
					</div>
				</div>

				{/* Custom content from children */}
				{children}
			</div>
		</Card>
	);
}
