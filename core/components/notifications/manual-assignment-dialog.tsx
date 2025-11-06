import { useState } from "react";
import { ResponsiveDialog } from "@/components/shared/responsive-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, ChevronRight, Check, ChevronLeft, Clock, Send, AlertTriangle } from "lucide-react";
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

interface ManualAssignmentDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	request: Request;
	allEmployees: Employee[];
	appointments: Appointment[];
	workingHours: WorkingHours[];
	timeOffEntries: TimeOffEntry[];
	serviceRelationships: ServiceRelationship;
	onUpdateConflicts: (updatedRequest: Request) => void;
}

type View = "day-list" | "staff-selection";

export function ManualAssignmentDialog({
	open,
	onOpenChange,
	request,
	allEmployees,
	appointments,
	workingHours,
	timeOffEntries,
	serviceRelationships,
	onUpdateConflicts,
}: ManualAssignmentDialogProps) {
	const [currentView, setCurrentView] = useState<View>("day-list");
	const [selectedDay, setSelectedDay] = useState<ConflictDay | null>(null);
	const [selectedStaffId, setSelectedStaffId] = useState<string>("");

	if (!request.conflicts) return null;

	const handleSelectDay = (day: ConflictDay) => {
		setSelectedDay(day);
		setSelectedStaffId(day.assignments.fullDay?.staffId || "");
		setCurrentView("staff-selection");
	};

	const handleBack = () => {
		setCurrentView("day-list");
		setSelectedDay(null);
		setSelectedStaffId("");
	};

	const handleConfirmAssignment = () => {
		if (!selectedDay || !selectedStaffId) return;

		const staff = allEmployees.find((e) => e.id === selectedStaffId);
		if (!staff) return;

		// Update the request
		const updatedDays = request.conflicts!.days.map((d) => {
			if (d.date === selectedDay.date) {
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

		onUpdateConflicts(updatedRequest);
		handleBack();
	};

	const formatDate = (dateStr: string) => {
		const date = new Date(dateStr);
		return date.toLocaleDateString("en-US", {
			weekday: "short",
			month: "short",
			day: "numeric",
		});
	};

	const formatLongDate = (dateStr: string) => {
		const date = new Date(dateStr);
		return date.toLocaleDateString("en-US", {
			weekday: "long",
			month: "long",
			day: "numeric",
		});
	};

	// Day List View
	if (currentView === "day-list") {
		return (
			<ResponsiveDialog
				open={open}
				onOpenChange={onOpenChange}
				title="Manual Assignment"
				description="Tap each day to assign staff"
			>
				<div className="space-y-3 py-2">
					{request.conflicts.days.map((day) => {
						const assigned = day.isResolved;
						const assignedStaff = day.assignments.fullDay?.staffName;

						return (
							<Card
								key={day.date}
								className={`p-4 cursor-pointer transition-all ${
									assigned
										? "bg-green-500/5 border-green-500/30"
										: "hover:border-primary/50"
								}`}
								onClick={() => handleSelectDay(day)}
							>
								<div className="flex items-center justify-between">
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2">
											<p className="font-medium text-sm">
												{formatDate(day.date)}
											</p>
											{assigned && (
												<Badge variant="default" className="bg-green-600 hover:bg-green-600">
													<Check className="h-3 w-3 mr-1" />
													Assigned
												</Badge>
											)}
										</div>
										<p className="text-xs text-muted-foreground mt-1">
											{day.totalAppointments} appointments
											{assigned && assignedStaff && ` → ${assignedStaff}`}
										</p>
									</div>
									{!assigned ? (
										<Button size="sm" variant="outline">
											Assign
										</Button>
									) : (
										<Button size="sm" variant="ghost">
											<ChevronRight className="h-4 w-4" />
										</Button>
									)}
								</div>
							</Card>
						);
					})}
				</div>
			</ResponsiveDialog>
		);
	}

	// Staff Selection View
	if (currentView === "staff-selection" && selectedDay) {
		const date = new Date(selectedDay.date);
		const replacementStaff = findReplacementStaffForDay(
			selectedDay,
			allEmployees,
			request.createdBy?.id || "",
			date,
			appointments,
			workingHours,
			timeOffEntries,
			serviceRelationships,
		);

		const availableStaff = replacementStaff.filter(
			(s) => s.availability === "available" && s.canTakeFullDay,
		);
		const needsApprovalStaff = replacementStaff.filter(
			(s) => s.availability === "needs-approval" && s.canTakeFullDay,
		);

		const totalHours =
			selectedDay.appointments.reduce((sum, apt) => {
				const duration = apt.services.reduce((svcSum, svc) => svcSum + svc.duration, 0);
				return sum + duration;
			}, 0) / 60;

		return (
			<ResponsiveDialog
				open={open}
				onOpenChange={onOpenChange}
				title={formatLongDate(selectedDay.date)}
				description={`${selectedDay.totalAppointments} appointments • ${totalHours.toFixed(1)} hours`}
				footer={
					<div className="flex gap-2 w-full">
						<Button variant="outline" onClick={handleBack} className="flex-1">
							<ChevronLeft className="h-4 w-4 mr-2" />
							Back
						</Button>
						<Button
							onClick={handleConfirmAssignment}
							disabled={!selectedStaffId}
							className="flex-1"
						>
							Confirm
						</Button>
					</div>
				}
			>
				<div className="space-y-6 py-2">
					{/* Available Staff */}
					{availableStaff.length > 0 && (
						<div className="space-y-3">
							<div className="flex items-center gap-2">
								<Check className="h-4 w-4 text-green-600" />
								<h4 className="font-semibold text-sm">Available Now</h4>
							</div>

							<RadioGroup value={selectedStaffId} onValueChange={setSelectedStaffId}>
								<div className="space-y-2">
									{availableStaff.map((staff) => (
										<Label key={staff.id} htmlFor={`staff-${staff.id}`} className="cursor-pointer">
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
									))}
								</div>
							</RadioGroup>
						</div>
					)}

					{/* On Leave Staff */}
					{needsApprovalStaff.length > 0 && (
						<div className="space-y-3">
							<div className="flex items-center gap-2">
								<Clock className="h-4 w-4 text-yellow-600" />
								<h4 className="font-semibold text-sm">On Leave (Can Offer)</h4>
							</div>

							<div className="space-y-2">
								{needsApprovalStaff.map((staff) => (
									<Card key={staff.id} className="p-3 bg-yellow-500/5 border-yellow-500/20">
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
				</div>
			</ResponsiveDialog>
		);
	}

	return null;
}
