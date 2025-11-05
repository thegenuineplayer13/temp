import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Calendar, Clock, AlertTriangle, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Request } from "@/features/core/types/types.notifications";
import { NotificationCardBase } from "../notification-card-base";
import { formatDate } from "../notification-utils";

interface RequestRenderProps {
	request: Request;
	onClick?: () => void;
	isSelected?: boolean;
	onApprove?: (id: string) => void;
	onReject?: (id: string) => void;
}

export function RequestRender({
	request,
	onClick,
	isSelected,
	onApprove,
	onReject,
}: RequestRenderProps) {
	const metadata = request.metadata as any;
	const isPending = request.status === "pending";
	const isTimeOffRequest = ["day-off", "vacation", "sick-leave", "personal-day", "bereavement"].includes(
		request.type,
	);

	return (
		<NotificationCardBase notification={request} onClick={onClick} isSelected={isSelected}>
			{/* Request-specific details */}
			<div className="mt-3 pt-3 border-t space-y-2">
				{/* Requester info */}
				{request.createdBy && (
					<div className="flex items-center justify-between text-sm">
						<span className="text-muted-foreground">Requested by:</span>
						<div className="text-right">
							<div className="font-semibold">{request.createdBy.name}</div>
							{request.createdBy.role && (
								<div className="text-xs text-muted-foreground">{request.createdBy.role}</div>
							)}
						</div>
					</div>
				)}

				{/* Date range for time off */}
				{isTimeOffRequest && request.startDate && (
					<div className="flex items-center justify-between text-sm">
						<span className="text-muted-foreground">Date{request.endDate && "s"}:</span>
						<span className="font-medium">
							{formatDate(request.startDate)}
							{request.endDate && request.startDate !== request.endDate && (
								<> - {formatDate(request.endDate)}</>
							)}
						</span>
					</div>
				)}

				{/* Duration */}
				{request.duration !== undefined && (
					<div className="flex items-center justify-between text-sm">
						<span className="text-muted-foreground">Duration:</span>
						<span className="font-medium">
							{request.duration} {request.duration === 1 ? "day" : "days"}
						</span>
					</div>
				)}

				{/* Reason */}
				{request.reason && (
					<div className="mt-2 p-2 rounded-md bg-muted/50 text-xs">
						<span className="font-medium">Reason: </span>
						<span className="text-muted-foreground">{request.reason}</span>
					</div>
				)}

				{/* Affected appointments */}
				{request.affectedAppointments !== undefined && request.affectedAppointments > 0 && (
					<div className="mt-2 p-2 rounded-md bg-orange-500/10 border border-orange-500/20">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-1.5 text-xs text-orange-600 dark:text-orange-500">
								<Calendar className="h-3 w-3" />
								<span className="font-semibold">Affected Appointments</span>
							</div>
							<Badge variant="secondary" className="text-xs bg-orange-500/20">
								{request.affectedAppointments}
							</Badge>
						</div>
					</div>
				)}

				{/* Shift swap details */}
				{request.type === "shift-swap" && metadata?.swapWith && (
					<div className="mt-2 space-y-1.5">
						<div className="flex items-center justify-between text-sm">
							<span className="text-muted-foreground">Swap with:</span>
							<span className="font-semibold">{metadata.swapWith.name}</span>
						</div>
						{metadata.originalShift && (
							<div className="text-xs">
								<span className="text-muted-foreground">Original: </span>
								<span>{metadata.originalShift}</span>
							</div>
						)}
						{metadata.swapShift && (
							<div className="text-xs">
								<span className="text-muted-foreground">Swap to: </span>
								<span>{metadata.swapShift}</span>
							</div>
						)}
						{metadata.bothApproved && (
							<Badge variant="outline" className="text-xs">
								<Check className="h-3 w-3 mr-1" />
								Both parties agreed
							</Badge>
						)}
					</div>
				)}

				{/* Schedule change details */}
				{request.type === "schedule-change" && (
					<div className="mt-2 space-y-1.5">
						{metadata?.currentSchedule && (
							<div className="text-xs">
								<span className="text-muted-foreground">Current: </span>
								<span>{metadata.currentSchedule}</span>
							</div>
						)}
						{metadata?.requestedSchedule && (
							<div className="text-xs">
								<span className="text-muted-foreground">Requested: </span>
								<span className="font-medium">{metadata.requestedSchedule}</span>
							</div>
						)}
						{metadata?.effectiveDate && (
							<div className="text-xs">
								<span className="text-muted-foreground">Effective: </span>
								<span>{formatDate(metadata.effectiveDate)}</span>
							</div>
						)}
					</div>
				)}

				{/* Equipment request details */}
				{request.type === "equipment-request" && (
					<div className="mt-2 space-y-1.5">
						{metadata?.equipmentType && (
							<div className="flex items-center justify-between text-sm">
								<span className="text-muted-foreground">Type:</span>
								<span className="font-medium">{metadata.equipmentType}</span>
							</div>
						)}
						{metadata?.estimatedCost && (
							<div className="flex items-center justify-between text-sm">
								<span className="text-muted-foreground">Est. Cost:</span>
								<span className="font-semibold">${metadata.estimatedCost}</span>
							</div>
						)}
					</div>
				)}

				{/* Training request details */}
				{request.type === "training-request" && (
					<div className="mt-2 space-y-1.5">
						{metadata?.courseName && (
							<div className="text-xs">
								<span className="text-muted-foreground">Course: </span>
								<span className="font-medium">{metadata.courseName}</span>
							</div>
						)}
						{metadata?.provider && (
							<div className="text-xs">
								<span className="text-muted-foreground">Provider: </span>
								<span>{metadata.provider}</span>
							</div>
						)}
						{metadata?.cost && (
							<div className="flex items-center justify-between text-sm mt-1">
								<span className="text-muted-foreground">Cost:</span>
								<span className="font-semibold">${metadata.cost}</span>
							</div>
						)}
					</div>
				)}

				{/* Replacement info */}
				{request.replacement && (
					<div className="mt-2 p-2 rounded-md bg-green-500/10 border border-green-500/20">
						<div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-500">
							<Users className="h-3 w-3" />
							<span className="font-semibold">Replacement:</span>
							<span>{request.replacement.name}</span>
						</div>
					</div>
				)}

				{/* Review notes (if approved/rejected) */}
				{request.reviewNotes && (
					<div
						className={cn(
							"mt-2 p-2 rounded-md text-xs",
							request.status === "approved" && "bg-green-500/10 border border-green-500/20",
							request.status === "rejected" && "bg-red-500/10 border border-red-500/20",
						)}
					>
						<span className="font-medium">
							{request.status === "approved" ? "Approved" : "Rejected"} by{" "}
							{request.reviewedBy?.name}:
						</span>
						<div className="mt-1 text-muted-foreground">{request.reviewNotes}</div>
					</div>
				)}

				{/* Actions for pending requests */}
				{isPending && (
					<div className="flex items-center gap-2 mt-3 pt-2">
						{onApprove && (
							<Button
								size="sm"
								className="flex-1"
								onClick={(e) => {
									e.stopPropagation();
									onApprove(request.id);
								}}
							>
								<Check className="h-3.5 w-3.5 mr-1.5" />
								Approve
							</Button>
						)}
						{onReject && (
							<Button
								size="sm"
								variant="outline"
								className="flex-1"
								onClick={(e) => {
									e.stopPropagation();
									onReject(request.id);
								}}
							>
								<X className="h-3.5 w-3.5 mr-1.5" />
								Reject
							</Button>
						)}
					</div>
				)}

				{/* Status badge for completed requests */}
				{!isPending && (
					<div className="mt-3 pt-2 border-t">
						<Badge
							className={cn(
								"w-full justify-center",
								request.status === "approved" && "bg-green-500",
								request.status === "rejected" && "bg-red-500",
							)}
						>
							{request.status === "approved" && <Check className="h-3 w-3 mr-1" />}
							{request.status === "rejected" && <X className="h-3 w-3 mr-1" />}
							{request.status.charAt(0).toUpperCase() + request.status.slice(1)}
						</Badge>
					</div>
				)}
			</div>
		</NotificationCardBase>
	);
}
