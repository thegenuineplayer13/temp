import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, DollarSign, Calendar, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Alert } from "@/features/core/types/types.notifications";
import { NotificationCardBase } from "../notification-card-base";

interface StaffAlertRenderProps {
	alert: Alert;
	onClick?: () => void;
	isSelected?: boolean;
	onAcknowledge?: (id: string) => void;
	onResolve?: (id: string) => void;
}

export function StaffAlertRender({
	alert,
	onClick,
	isSelected,
	onAcknowledge,
	onResolve,
}: StaffAlertRenderProps) {
	const metadata = alert.metadata as any;

	return (
		<NotificationCardBase notification={alert} onClick={onClick} isSelected={isSelected}>
			{/* Staff-specific details */}
			<div className="mt-3 pt-3 border-t space-y-2">
				{/* Employee info */}
				{alert.affectedEntities && alert.affectedEntities.length > 0 && (
					<div className="flex items-center justify-between text-sm">
						<span className="text-muted-foreground">Employee:</span>
						<span className="font-semibold">{alert.affectedEntities[0].name}</span>
					</div>
				)}

				{/* Scheduled time */}
				{metadata?.scheduledTime && (
					<div className="flex items-center justify-between text-sm">
						<span className="text-muted-foreground">Scheduled:</span>
						<span className="font-medium">{metadata.scheduledTime}</span>
					</div>
				)}

				{/* Actual check-in/departure */}
				{metadata?.actualCheckIn && (
					<div className="flex items-center justify-between text-sm">
						<span className="text-muted-foreground">Checked In:</span>
						<span className="font-medium text-orange-600 dark:text-orange-500">
							{metadata.actualCheckIn}
						</span>
					</div>
				)}

				{metadata?.actualDeparture && (
					<div className="flex items-center justify-between text-sm">
						<span className="text-muted-foreground">Departed:</span>
						<span className="font-medium text-orange-600 dark:text-orange-500">
							{metadata.actualDeparture}
						</span>
					</div>
				)}

				{/* Delay info */}
				{metadata?.delayMinutes && (
					<div className="flex items-center justify-between text-sm">
						<span className="text-muted-foreground">Delay:</span>
						<span className="font-semibold text-orange-600 dark:text-orange-500">
							{metadata.delayMinutes} minutes
						</span>
					</div>
				)}

				{/* Affected appointments */}
				{metadata?.affectedAppointments !== undefined && metadata.affectedAppointments > 0 && (
					<div className="mt-2 p-2 rounded-md bg-red-500/10 border border-red-500/20">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-500">
								<Calendar className="h-3 w-3" />
								<span className="font-semibold">Affected Appointments</span>
							</div>
							<Badge variant="destructive" className="text-xs">
								{metadata.affectedAppointments}
							</Badge>
						</div>
					</div>
				)}

				{/* Revenue at risk */}
				{metadata?.potentialRevenueLoss && (
					<div className="flex items-center justify-between text-sm">
						<span className="text-muted-foreground">Revenue at Risk:</span>
						<span className="font-semibold text-red-600 dark:text-red-500">
							${metadata.potentialRevenueLoss}
						</span>
					</div>
				)}

				{/* Possible replacements */}
				{metadata?.possibleReplacements && metadata.possibleReplacements.length > 0 && (
					<div className="mt-2">
						<div className="text-xs text-muted-foreground mb-1 font-medium">
							Available Replacements:
						</div>
						<div className="flex flex-wrap gap-1">
							{metadata.possibleReplacements.map((replacement: any, idx: number) => (
								<Badge key={idx} variant="outline" className="text-xs">
									<Users className="h-3 w-3 mr-1" />
									{replacement.name}
								</Badge>
							))}
						</div>
					</div>
				)}

				{/* Reason (for early departure) */}
				{metadata?.reason && (
					<div className="mt-2 p-2 rounded-md bg-muted/50 text-xs">
						<span className="font-medium">Reason: </span>
						<span className="text-muted-foreground">{metadata.reason}</span>
					</div>
				)}

				{/* Actions */}
				{alert.status !== "resolved" && (
					<div className="flex items-center gap-2 mt-3 pt-2">
						{alert.type === "staff-no-show" && (
							<Button size="sm" className="flex-1">
								<Users className="h-3.5 w-3.5 mr-1.5" />
								Find Replacement
							</Button>
						)}
						{alert.status === "unread" && onAcknowledge && (
							<Button
								size="sm"
								variant="outline"
								onClick={(e) => {
									e.stopPropagation();
									onAcknowledge(alert.id);
								}}
							>
								Acknowledge
							</Button>
						)}
						{alert.status === "acknowledged" && onResolve && (
							<Button
								size="sm"
								variant="outline"
								onClick={(e) => {
									e.stopPropagation();
									onResolve(alert.id);
								}}
							>
								Resolve
							</Button>
						)}
					</div>
				)}
			</div>
		</NotificationCardBase>
	);
}
