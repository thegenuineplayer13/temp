import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
	Calendar,
	Clock,
	Users,
	AlertTriangle,
	Check,
	X,
	DollarSign,
	GraduationCap,
	ArrowLeftRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Request } from "@/features/core/types/types.notifications";
import type { Employee } from "@/features/core/types/types.staff";
import type { Appointment } from "@/features/core/types/types.dashboard-front-desk";
import type { WorkingHours, TimeOffEntry } from "@/features/core/types/types.calendar";
import type { ServiceRelationship } from "@/features/core/types/types.services";
import { formatDate } from "../notification-utils";
import { ConflictResolutionPanel } from "../conflict-resolution-panel";
import { areAllConflictsResolved } from "@/features/core/lib/conflict-resolution-utils";

interface RequestDetailProps {
	request: Request;
	onApprove?: (id: string) => void;
	onReject?: (id: string) => void;
	// Conflict resolution props
	allEmployees?: Employee[];
	appointments?: Appointment[];
	workingHours?: WorkingHours[];
	timeOffEntries?: TimeOffEntry[];
	serviceRelationships?: ServiceRelationship;
	onUpdateConflicts?: (updatedRequest: Request) => void;
	onSendOffer?: (dayDate: string, staffId: string) => void;
}

export function RequestDetail({
	request,
	onApprove,
	onReject,
	allEmployees,
	appointments,
	workingHours,
	timeOffEntries,
	serviceRelationships,
	onUpdateConflicts,
	onSendOffer,
}: RequestDetailProps) {
	const metadata = request.metadata as any;
	const isTimeOffRequest = [
		"day-off",
		"vacation",
		"sick-leave",
		"personal-day",
		"bereavement",
	].includes(request.type);

	// Check if conflicts are resolved
	const canApprove = !request.conflicts || areAllConflictsResolved(request);

	return (
		<div className="space-y-6">
			{/* Requester Info */}
			{request.createdBy && (
				<Card className="p-4">
					<div className="flex items-center gap-4">
						<Avatar className="h-16 w-16">
							<AvatarFallback className="text-lg bg-primary/10">
								{request.createdBy.name
									.split(" ")
									.map((n) => n[0])
									.join("")}
							</AvatarFallback>
						</Avatar>
						<div className="flex-1">
							<h3 className="font-semibold text-lg">{request.createdBy.name}</h3>
							{request.createdBy.role && (
								<p className="text-sm text-muted-foreground">{request.createdBy.role}</p>
							)}
							<Badge variant="outline" className="mt-2 capitalize">
								{request.type.replace(/-/g, " ")}
							</Badge>
						</div>
					</div>
				</Card>
			)}

			{/* Time Off Details */}
			{isTimeOffRequest && (request.startDate || request.duration) && (
				<Card className="p-4 space-y-4">
					<h3 className="font-semibold">Request Details</h3>
					<Separator />
					<div className="space-y-3 text-sm">
						{request.startDate && (
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground">Date{request.endDate && "s"}</span>
								<span className="font-medium">
									{formatDate(request.startDate)}
									{request.endDate && request.startDate !== request.endDate && (
										<> - {formatDate(request.endDate)}</>
									)}
								</span>
							</div>
						)}
						{request.duration !== undefined && (
							<>
								<Separator />
								<div className="flex items-center justify-between">
									<span className="text-muted-foreground">Duration</span>
									<span className="font-medium">
										{request.duration} {request.duration === 1 ? "day" : "days"}
									</span>
								</div>
							</>
						)}
					</div>
				</Card>
			)}

			{/* Shift Swap Details */}
			{request.type === "shift-swap" && metadata?.swapWith && (
				<Card className="p-4 space-y-4">
					<h3 className="font-semibold">Shift Swap Details</h3>
					<Separator />
					<div className="space-y-3 text-sm">
						<div className="flex items-center justify-between">
							<span className="text-muted-foreground">Swap With</span>
							<span className="font-semibold">{metadata.swapWith.name}</span>
						</div>
						{metadata.originalShift && (
							<>
								<Separator />
								<div>
									<p className="text-muted-foreground mb-1">Original Shift</p>
									<Badge variant="outline">{metadata.originalShift}</Badge>
								</div>
							</>
						)}
						{metadata.swapShift && (
							<>
								<Separator />
								<div>
									<p className="text-muted-foreground mb-1">Requested Shift</p>
									<Badge variant="outline">{metadata.swapShift}</Badge>
								</div>
							</>
						)}
						{metadata.bothApproved && (
							<>
								<Separator />
								<div className="flex items-center gap-2 text-green-600 dark:text-green-500">
									<Check className="h-4 w-4" />
									<span className="font-medium">Both parties agreed</span>
								</div>
							</>
						)}
					</div>
				</Card>
			)}

			{/* Schedule Change Details */}
			{request.type === "schedule-change" && (
				<Card className="p-4 space-y-4">
					<h3 className="font-semibold">Schedule Change Details</h3>
					<Separator />
					<div className="space-y-3 text-sm">
						{metadata?.currentSchedule && (
							<div>
								<p className="text-muted-foreground mb-1">Current Schedule</p>
								<Badge variant="outline">{metadata.currentSchedule}</Badge>
							</div>
						)}
						{metadata?.requestedSchedule && (
							<>
								<Separator />
								<div>
									<p className="text-muted-foreground mb-1">Requested Schedule</p>
									<Badge variant="default">{metadata.requestedSchedule}</Badge>
								</div>
							</>
						)}
						{metadata?.effectiveDate && (
							<>
								<Separator />
								<div className="flex items-center justify-between">
									<span className="text-muted-foreground">Effective Date</span>
									<span className="font-medium">{formatDate(metadata.effectiveDate)}</span>
								</div>
							</>
						)}
						{metadata?.duration && (
							<>
								<Separator />
								<div className="flex items-center justify-between">
									<span className="text-muted-foreground">Duration</span>
									<span className="font-medium">{metadata.duration}</span>
								</div>
							</>
						)}
					</div>
				</Card>
			)}

			{/* Equipment Request Details */}
			{request.type === "equipment-request" && (
				<Card className="p-4 space-y-4">
					<h3 className="font-semibold">Equipment Request Details</h3>
					<Separator />
					<div className="space-y-3 text-sm">
						{metadata?.equipmentType && (
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground">Type</span>
								<span className="font-medium">{metadata.equipmentType}</span>
							</div>
						)}
						{metadata?.estimatedCost && (
							<>
								<Separator />
								<div className="flex items-center justify-between">
									<span className="text-muted-foreground">Estimated Cost</span>
									<span className="font-semibold text-lg">${metadata.estimatedCost}</span>
								</div>
							</>
						)}
						{metadata?.supplier && (
							<>
								<Separator />
								<div className="flex items-center justify-between">
									<span className="text-muted-foreground">Supplier</span>
									<span className="font-medium">{metadata.supplier}</span>
								</div>
							</>
						)}
						{metadata?.urgency && (
							<>
								<Separator />
								<div>
									<p className="text-muted-foreground mb-1">Urgency</p>
									<p className="text-sm">{metadata.urgency}</p>
								</div>
							</>
						)}
					</div>
				</Card>
			)}

			{/* Training Request Details */}
			{request.type === "training-request" && (
				<Card className="p-4 space-y-4">
					<h3 className="font-semibold">Training Request Details</h3>
					<Separator />
					<div className="space-y-3 text-sm">
						{metadata?.courseName && (
							<div>
								<p className="text-muted-foreground mb-1">Course Name</p>
								<p className="font-medium">{metadata.courseName}</p>
							</div>
						)}
						{metadata?.provider && (
							<>
								<Separator />
								<div className="flex items-center justify-between">
									<span className="text-muted-foreground">Provider</span>
									<span className="font-medium">{metadata.provider}</span>
								</div>
							</>
						)}
						{metadata?.cost && (
							<>
								<Separator />
								<div className="flex items-center justify-between">
									<span className="text-muted-foreground">Cost</span>
									<span className="font-semibold text-lg">${metadata.cost}</span>
								</div>
							</>
						)}
						{metadata?.dates && metadata.dates.length > 0 && (
							<>
								<Separator />
								<div>
									<p className="text-muted-foreground mb-1">Dates</p>
									{metadata.dates.map((date: string, idx: number) => (
										<Badge key={idx} variant="outline" className="mr-1">
											{formatDate(date)}
										</Badge>
									))}
								</div>
							</>
						)}
						{metadata?.certificationType && (
							<>
								<Separator />
								<div>
									<p className="text-muted-foreground mb-1">Type</p>
									<Badge variant={metadata.certificationType === "Required" ? "destructive" : "secondary"}>
										{metadata.certificationType}
									</Badge>
								</div>
							</>
						)}
					</div>
				</Card>
			)}

			{/* Reason */}
			{request.reason && (
				<Card className="p-4">
					<h3 className="font-semibold mb-2">Reason</h3>
					<p className="text-sm text-muted-foreground">{request.reason}</p>
				</Card>
			)}

			{/* Affected Appointments */}
			{request.affectedAppointments !== undefined && request.affectedAppointments > 0 && (
				<Card className="p-4 bg-orange-500/5 border-orange-500/20">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-500" />
							<div>
								<p className="font-semibold">Affected Appointments</p>
								<p className="text-sm text-muted-foreground">
									{request.affectedAppointments} appointment{request.affectedAppointments !== 1 ? "s" : ""} will need rescheduling
								</p>
							</div>
						</div>
						<div className="text-2xl font-bold text-orange-600 dark:text-orange-500">
							{request.affectedAppointments}
						</div>
					</div>
				</Card>
			)}

			{/* Conflict Resolution Panel */}
			{request.conflicts &&
				allEmployees &&
				appointments &&
				workingHours &&
				timeOffEntries &&
				serviceRelationships &&
				onUpdateConflicts && (
					<ConflictResolutionPanel
						request={request}
						allEmployees={allEmployees}
						appointments={appointments}
						workingHours={workingHours}
						timeOffEntries={timeOffEntries}
						serviceRelationships={serviceRelationships}
						onUpdateConflicts={onUpdateConflicts}
						onSendOffer={onSendOffer}
					/>
				)}

			{/* Replacement */}
			{request.replacement && (
				<Card className="p-4 bg-green-500/5 border-green-500/20">
					<div className="flex items-center gap-3">
						<Users className="h-5 w-5 text-green-600 dark:text-green-500" />
						<div>
							<p className="text-sm text-muted-foreground">Replacement Arranged</p>
							<p className="font-semibold">{request.replacement.name}</p>
						</div>
					</div>
				</Card>
			)}

			{/* Review Notes (if approved/rejected) */}
			{request.reviewNotes && (
				<Card
					className={cn(
						"p-4",
						request.status === "approved" && "bg-green-500/5 border-green-500/20",
						request.status === "rejected" && "bg-red-500/5 border-red-500/20",
					)}
				>
					<h3 className="font-semibold mb-2">
						{request.status === "approved" ? "Approval" : "Rejection"} Notes
					</h3>
					<p className="text-sm text-muted-foreground">{request.reviewNotes}</p>
				</Card>
			)}

			{/* Pending Actions */}
			{request.status === "pending" && (onApprove || onReject) && (
				<div className="space-y-2">
					<h3 className="font-semibold">Actions</h3>
					{!canApprove && request.conflicts && (
						<p className="text-sm text-orange-600 dark:text-orange-500 flex items-center gap-2">
							<AlertTriangle className="h-4 w-4" />
							Resolve all conflicts before approving this request
						</p>
					)}
					<div className="grid grid-cols-2 gap-2">
						{onApprove && (
							<Button
								onClick={() => onApprove(request.id)}
								className="w-full"
								disabled={!canApprove}
							>
								<Check className="h-4 w-4 mr-2" />
								Approve
							</Button>
						)}
						{onReject && (
							<Button onClick={() => onReject(request.id)} variant="outline" className="w-full">
								<X className="h-4 w-4 mr-2" />
								Reject
							</Button>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
