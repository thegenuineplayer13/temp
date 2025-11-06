import { useState } from "react";
import { ResponsiveModal, ResponsiveModalBody, ResponsiveModalFooter } from "@/components/ui/responsive-modal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, Clock, Send, AlertTriangle } from "lucide-react";
import type {
	Request,
	ConflictDay,
	ReplacementStaff,
} from "@/features/core/types/types.notifications";
import type { Employee } from "@/features/core/types/types.staff";
import type { Appointment } from "@/features/core/types/types.dashboard-front-desk";
import type { WorkingHours, TimeOffEntry } from "@/features/core/types/types.calendar";
import type { ServiceRelationship } from "@/features/core/types/types.services";
import { findReplacementStaffForDay } from "@/features/core/lib/conflict-resolution-utils";

interface DayAssignmentSheetProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	day: ConflictDay;
	request: Request;
	allEmployees: Employee[];
	appointments: Appointment[];
	workingHours: WorkingHours[];
	timeOffEntries: TimeOffEntry[];
	serviceRelationships: ServiceRelationship;
	onAssign: (updatedRequest: Request) => void;
}

export function DayAssignmentSheet({
	open,
	onOpenChange,
	day,
	request,
	allEmployees,
	appointments,
	workingHours,
	timeOffEntries,
	serviceRelationships,
	onAssign,
}: DayAssignmentSheetProps) {
	const [selectedStaffId, setSelectedStaffId] = useState<string>(
		day.assignments.fullDay?.staffId || "",
	);

	// Get replacement staff options
	const date = new Date(day.date);
	const replacementStaff = findReplacementStaffForDay(
		day,
		allEmployees,
		request.createdBy?.id || "",
		date,
		appointments,
		workingHours,
		timeOffEntries,
		serviceRelationships,
	);

	// Filter and group by availability
	const availableStaff = replacementStaff.filter(
		(s) => s.availability === "available" && s.canTakeFullDay,
	);
	const needsApprovalStaff = replacementStaff.filter(
		(s) => s.availability === "needs-approval" && s.canTakeFullDay,
	);

	const formatDate = (dateStr: string) => {
		const date = new Date(dateStr);
		return date.toLocaleDateString("en-US", {
			weekday: "long",
			month: "long",
			day: "numeric",
		});
	};

	const totalHours =
		day.appointments.reduce((sum, apt) => {
			const duration = apt.services.reduce((svcSum, svc) => svcSum + svc.duration, 0);
			return sum + duration;
		}, 0) / 60;

	const handleConfirm = () => {
		if (!selectedStaffId) return;

		const staff = allEmployees.find((e) => e.id === selectedStaffId);
		if (!staff) return;

		// Update the request with this assignment
		const updatedDays = request.conflicts!.days.map((d) => {
			if (d.date === day.date) {
				return {
					...d,
					assignmentMode: "single" as const,
					assignments: {
						fullDay: {
							staffId: staff.id,
							staffName: staff.name,
							appointmentIds: d.appointments.map((apt) => apt.id),
						},
					},
					isResolved: true,
				};
			}
			return d;
		});

		const resolvedCount = updatedDays.filter((d) => d.isResolved).length;

		const updatedRequest: Request = {
			...request,
			conflicts: {
				...request.conflicts!,
				days: updatedDays,
				resolved: resolvedCount,
			},
		};

		onAssign(updatedRequest);
	};

	return (
		<ResponsiveModal
			open={open}
			onOpenChange={onOpenChange}
			title={formatDate(day.date)}
			description={`${day.totalAppointments} appointments • ${totalHours.toFixed(1)} hours`}
		>
			<ResponsiveModalBody>
				{/* Available Staff */}
				{availableStaff.length > 0 && (
					<div className="space-y-3 mb-6">
						<div className="flex items-center gap-2">
							<Check className="h-4 w-4 text-green-600" />
							<h4 className="font-semibold text-sm">Available Now</h4>
						</div>

						<RadioGroup value={selectedStaffId} onValueChange={setSelectedStaffId}>
							<div className="space-y-2">
								{availableStaff.map((staff) => (
									<StaffOption key={staff.id} staff={staff} />
								))}
							</div>
						</RadioGroup>
					</div>
				)}

				{/* On Leave Staff */}
				{needsApprovalStaff.length > 0 && (
					<div className="space-y-3 mb-6">
						<div className="flex items-center gap-2">
							<Clock className="h-4 w-4 text-yellow-600" />
							<h4 className="font-semibold text-sm">On Leave (Can Offer)</h4>
						</div>

						<div className="space-y-2">
							{needsApprovalStaff.map((staff) => (
								<StaffOfferOption key={staff.id} staff={staff} />
							))}
						</div>
					</div>
				)}

				{/* No options */}
				{availableStaff.length === 0 && needsApprovalStaff.length === 0 && (
					<Card className="p-4 bg-muted/50 border-dashed">
						<div className="flex items-start gap-3">
							<AlertTriangle className="h-5 w-5 text-muted-foreground mt-0.5" />
							<div>
								<p className="text-sm font-medium">No qualified staff available</p>
								<p className="text-xs text-muted-foreground mt-1">
									Try broadcasting to the team or splitting by service type.
								</p>
							</div>
						</div>
					</Card>
				)}
			</ResponsiveModalBody>

			<ResponsiveModalFooter>
				<Button
					onClick={handleConfirm}
					disabled={!selectedStaffId}
					className="w-full"
					size="lg"
				>
					Confirm Assignment
				</Button>
			</ResponsiveModalFooter>
		</ResponsiveModal>
	);
}

interface StaffOptionProps {
	staff: ReplacementStaff;
}

function StaffOption({ staff }: StaffOptionProps) {
	return (
		<Label htmlFor={`staff-${staff.id}`} className="cursor-pointer">
			<Card className="p-3 hover:border-primary/50 transition-colors">
				<div className="flex items-center gap-3">
					<RadioGroupItem value={staff.id} id={`staff-${staff.id}`} />

					<Avatar className="h-10 w-10">
						{staff.avatar && <AvatarImage src={staff.avatar} alt={staff.name} />}
						<AvatarFallback className="text-xs">
							{staff.name
								.split(" ")
								.map((n) => n[0])
								.join("")}
						</AvatarFallback>
					</Avatar>

					<div className="flex-1 min-w-0">
						<p className="font-medium text-sm">{staff.name}</p>
						<div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
							{staff.canTakeFullDay && (
								<Badge variant="secondary" className="text-xs py-0 px-1.5">
									Can do all
								</Badge>
							)}
							<span>
								{staff.existingAppointments} apt • {staff.hoursScheduled.toFixed(1)}h
							</span>
						</div>
					</div>
				</div>
			</Card>
		</Label>
	);
}

function StaffOfferOption({ staff }: StaffOptionProps) {
	return (
		<Card className="p-3 bg-yellow-500/5 border-yellow-500/20">
			<div className="flex items-center gap-3">
				<Avatar className="h-10 w-10">
					{staff.avatar && <AvatarImage src={staff.avatar} alt={staff.name} />}
					<AvatarFallback className="text-xs">
						{staff.name
							.split(" ")
							.map((n) => n[0])
							.join("")}
					</AvatarFallback>
				</Avatar>

				<div className="flex-1 min-w-0">
					<p className="font-medium text-sm">{staff.name}</p>
					<div className="flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-500 mt-0.5">
						<Badge variant="outline" className="text-xs py-0 px-1.5 border-yellow-500/30">
							On {staff.leaveType?.replace(/-/g, " ")}
						</Badge>
						{staff.willingToWork && <span>• Willing to help</span>}
					</div>
				</div>

				<Button size="sm" variant="outline" className="border-yellow-500/30">
					<Send className="h-3 w-3 mr-1" />
					Offer
				</Button>
			</div>
		</Card>
	);
}
