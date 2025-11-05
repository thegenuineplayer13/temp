import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { Notification } from "@/features/core/types/types.notifications";
import {
	getAlertTypeIcon,
	getRequestTypeIcon,
	getPriorityColor,
	formatRelativeTime,
	getUrgencyIndicatorIcon,
	shouldShowUrgencyIndicator,
} from "./notification-utils";

interface NotificationsListProps {
	notifications: Notification[];
	selectedNotificationId: string | null;
	onSelectNotification: (notificationId: string) => void;
}

export function NotificationsList({
	notifications,
	selectedNotificationId,
	onSelectNotification,
}: NotificationsListProps) {
	return (
		<ScrollArea className="h-full">
			<div className="p-2 space-y-1">
				{notifications.map((notification) => {
					const isAlert = notification.category === "alert";
					const Icon = isAlert
						? getAlertTypeIcon(notification.type as any)
						: getRequestTypeIcon(notification.type as any);
					const isSelected = selectedNotificationId === notification.id;
					const priorityColors = getPriorityColor(notification.priority);

					// Determine if completed
					const isCompleted = isAlert
						? notification.status === "resolved"
						: notification.status === "approved" || notification.status === "rejected";

					// Get urgency indicator
					const showUrgencyIndicator = !isCompleted && shouldShowUrgencyIndicator(notification.priority);
					const UrgencyIcon = getUrgencyIndicatorIcon(notification.category);

					return (
						<button
							key={notification.id}
							onClick={() => onSelectNotification(notification.id)}
							className={cn(
								"w-full text-left p-4 rounded-lg border transition-all hover:bg-accent/50",
								isSelected
									? "bg-accent border-primary shadow-sm"
									: "bg-card border-border",
								isCompleted && "opacity-60",
							)}
						>
							<div className="flex items-start gap-3">
								{/* Icon with neutral background */}
								<div className="rounded-full p-2 flex-shrink-0 bg-muted">
									<Icon className="h-4 w-4 text-foreground" />
								</div>

								<div className="flex-1 min-w-0">
									{/* Title and timestamp with urgency indicator */}
									<div className="flex items-start justify-between gap-2 mb-1">
										<h3
											className={cn(
												"font-semibold text-sm line-clamp-1",
												isCompleted && "line-through",
											)}
										>
											{notification.title}
										</h3>
										<div className="flex items-center gap-2 flex-shrink-0">
											<span className="text-xs text-muted-foreground">
												{formatRelativeTime(notification.createdAt)}
											</span>
											{/* Subtle urgency indicator for urgent/high priority */}
											{showUrgencyIndicator && (
												<UrgencyIcon
													className={cn("h-4 w-4", priorityColors.text)}
													aria-label={`${notification.priority} priority`}
												/>
											)}
										</div>
									</div>

									{/* Description preview */}
									<p className="text-xs text-muted-foreground line-clamp-2 mb-2">
										{notification.description}
									</p>

									{/* Status info */}
									<div className="flex items-center gap-2 flex-wrap">
										{/* Show status for completed notifications */}
										{isCompleted && (
											<>
												<Badge variant="secondary" className="text-xs">
													{isAlert
														? "Resolved"
														: notification.status === "approved"
															? "Approved"
															: "Rejected"}
												</Badge>
												<span className="text-xs text-muted-foreground">
													{isAlert
														? `by ${notification.resolvedBy?.name || "System"}`
														: `by ${notification.reviewedBy?.name || "Manager"}`}
												</span>
											</>
										)}
									</div>
								</div>
							</div>
						</button>
					);
				})}
			</div>
		</ScrollArea>
	);
}
