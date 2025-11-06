import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle2, Calendar } from "lucide-react";
import type {
	Request,
	ConflictDay,
	ReplacementStaff,
	AssignmentMode,
} from "@/features/core/types/types.notifications";
import type { Employee } from "@/features/core/types/types.staff";
import type { Appointment } from "@/features/core/types/types.dashboard-front-desk";
import type { WorkingHours, TimeOffEntry } from "@/features/core/types/types.calendar";
import type { ServiceRelationship } from "@/features/core/types/types.services";
import { DayConflictCard } from "./day-conflict-card";
import {
	findReplacementStaffForDay,
	calculateConflictProgress,
	getConflictsSummary,
} from "@/features/core/lib/conflict-resolution-utils";

interface ConflictResolutionPanelProps {
	request: Request;
	allEmployees: Employee[];
	appointments: Appointment[];
	workingHours: WorkingHours[];
	timeOffEntries: TimeOffEntry[];
	serviceRelationships: ServiceRelationship;
	onUpdateConflicts: (updatedRequest: Request) => void;
	onSendOffer?: (dayDate: string, staffId: string) => void;
}

export function ConflictResolutionPanel({
	request,
	allEmployees,
	appointments,
	workingHours,
	timeOffEntries,
	serviceRelationships,
	onUpdateConflicts,
	onSendOffer,
}: ConflictResolutionPanelProps) {
	// Early return if no conflicts
	if (!request.conflicts || request.conflicts.total === 0) {
		return null;
	}

	const progress = calculateConflictProgress(request);
	const summary = getConflictsSummary(request);
	const allResolved = summary.resolvedDays === summary.totalDays;

	// Get replacement staff preferences map (placeholder - would come from API)
	const staffLeavePreferences = useMemo(() => {
		const map = new Map();
		// In production, this would come from staff preferences API
		// For now, assume staff on vacation/personal-day are willing to work
		return map;
	}, []);

	const handleAssignFullDay = (dayDate: string, staffId: string) => {
		if (!request.conflicts) return;

		const updatedDays = request.conflicts.days.map((day) => {
			if (day.date !== dayDate) return day;

			const staff = allEmployees.find((e) => e.id === staffId);
			if (!staff) return day;

			return {
				...day,
				assignmentMode: "single" as AssignmentMode,
				assignments: {
					fullDay: {
						staffId: staff.id,
						staffName: staff.name,
						appointmentIds: day.appointments.map((a) => a.id),
					},
				},
				isResolved: true,
			};
		});

		const updatedRequest: Request = {
			...request,
			conflicts: {
				...request.conflicts,
				days: updatedDays,
				resolved: updatedDays.filter((d) => d.isResolved).length,
			},
		};

		onUpdateConflicts(updatedRequest);
	};

	const handleAssignBySpecialization = (dayDate: string, specializationId: string, staffId: string) => {
		if (!request.conflicts) return;

		const updatedDays = request.conflicts.days.map((day) => {
			if (day.date !== dayDate) return day;

			const staff = allEmployees.find((e) => e.id === staffId);
			if (!staff) return day;

			const existingAssignments = day.assignments.bySpecialization || [];
			const otherAssignments = existingAssignments.filter(
				(a) => a.specializationId !== specializationId,
			);

			const appointmentsForSpec = day.appointments.filter((apt) =>
				apt.services.some((svc) => svc.specializationId === specializationId),
			);

			const newAssignments = [
				...otherAssignments,
				{
					specializationId,
					staffId: staff.id,
					staffName: staff.name,
					appointmentIds: appointmentsForSpec.map((a) => a.id),
				},
			];

			// Check if all specializations are assigned
			const allAssigned = day.requiredSpecializationIds.every((specId) =>
				newAssignments.some((a) => a.specializationId === specId),
			);

			return {
				...day,
				assignmentMode: "split" as AssignmentMode,
				assignments: {
					bySpecialization: newAssignments,
				},
				isResolved: allAssigned,
			};
		});

		const updatedRequest: Request = {
			...request,
			conflicts: {
				...request.conflicts,
				days: updatedDays,
				resolved: updatedDays.filter((d) => d.isResolved).length,
			},
		};

		onUpdateConflicts(updatedRequest);
	};

	const handleAssignIndividual = (dayDate: string, appointmentId: string, staffId: string) => {
		if (!request.conflicts) return;

		const updatedDays = request.conflicts.days.map((day) => {
			if (day.date !== dayDate) return day;

			const staff = allEmployees.find((e) => e.id === staffId);
			if (!staff) return day;

			const existingAssignments = day.assignments.individual || [];
			const otherAssignments = existingAssignments.filter((a) => a.appointmentId !== appointmentId);

			const newAssignments = [
				...otherAssignments,
				{
					appointmentId,
					staffId: staff.id,
					staffName: staff.name,
				},
			];

			// Check if all appointments are assigned
			const allAssigned = day.appointments.every((apt) =>
				newAssignments.some((a) => a.appointmentId === apt.id),
			);

			return {
				...day,
				assignmentMode: "individual" as AssignmentMode,
				assignments: {
					individual: newAssignments,
				},
				isResolved: allAssigned,
			};
		});

		const updatedRequest: Request = {
			...request,
			conflicts: {
				...request.conflicts,
				days: updatedDays,
				resolved: updatedDays.filter((d) => d.isResolved).length,
			},
		};

		onUpdateConflicts(updatedRequest);
	};

	const handleChangeMode = (dayDate: string, mode: AssignmentMode) => {
		if (!request.conflicts) return;

		const updatedDays = request.conflicts.days.map((day) => {
			if (day.date !== dayDate) return day;

			return {
				...day,
				assignmentMode: mode,
				assignments: {}, // Reset assignments when changing mode
				isResolved: false,
			};
		});

		const updatedRequest: Request = {
			...request,
			conflicts: {
				...request.conflicts,
				days: updatedDays,
				resolved: updatedDays.filter((d) => d.isResolved).length,
			},
		};

		onUpdateConflicts(updatedRequest);
	};

	const handleSendOffer = (dayDate: string, staffId: string) => {
		onSendOffer?.(dayDate, staffId);
	};

	return (
		<Card className="p-6 space-y-6 bg-gradient-to-br from-orange-500/5 to-yellow-500/5 border-orange-500/20">
			{/* Header */}
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<AlertTriangle className="h-6 w-6 text-orange-600 dark:text-orange-500" />
						<div>
							<h3 className="font-semibold text-lg">Appointment Conflicts Detected</h3>
							<p className="text-sm text-muted-foreground">
								Resolve all conflicts before approving this request
							</p>
						</div>
					</div>
					<Badge
						variant={allResolved ? "default" : "outline"}
						className={allResolved ? "bg-green-600 hover:bg-green-600" : "border-orange-500/30"}
					>
						{summary.resolvedDays}/{summary.totalDays} days resolved
					</Badge>
				</div>

				{/* Progress Bar */}
				<div className="space-y-2">
					<div className="flex items-center justify-between text-sm">
						<span className="text-muted-foreground">Resolution Progress</span>
						<span className="font-medium">{progress}%</span>
					</div>
					<Progress value={progress} className="h-2" />
				</div>

				{/* Summary Stats */}
				<div className="grid grid-cols-3 gap-4">
					<Card className="p-3 bg-background">
						<div className="text-center">
							<p className="text-2xl font-bold">{summary.totalDays}</p>
							<p className="text-xs text-muted-foreground">
								Total Day{summary.totalDays !== 1 ? "s" : ""}
							</p>
						</div>
					</Card>
					<Card className="p-3 bg-background">
						<div className="text-center">
							<p className="text-2xl font-bold">{summary.totalAppointments}</p>
							<p className="text-xs text-muted-foreground">
								Appointment{summary.totalAppointments !== 1 ? "s" : ""}
							</p>
						</div>
					</Card>
					<Card className="p-3 bg-background">
						<div className="text-center">
							<p className="text-2xl font-bold text-orange-600">{summary.pendingDays}</p>
							<p className="text-xs text-muted-foreground">Pending</p>
						</div>
					</Card>
				</div>

				{/* Alert Message */}
				{!allResolved && (
					<Alert variant="destructive">
						<AlertTriangle className="h-4 w-4" />
						<AlertDescription>
							You must resolve all {summary.pendingDays} pending day{summary.pendingDays !== 1 ? "s" : ""}{" "}
							before this request can be approved.
						</AlertDescription>
					</Alert>
				)}

				{allResolved && (
					<Alert className="bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-500">
						<CheckCircle2 className="h-4 w-4" />
						<AlertDescription>
							All conflicts resolved! You can now approve this request.
						</AlertDescription>
					</Alert>
				)}
			</div>

			{/* Day Conflict Cards */}
			<div className="space-y-4">
				<div className="flex items-center gap-2">
					<Calendar className="h-4 w-4 text-muted-foreground" />
					<h4 className="font-semibold">Conflict Days</h4>
				</div>

				<div className="space-y-3">
					{request.conflicts.days.map((day) => {
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
							staffLeavePreferences,
						);

						return (
							<DayConflictCard
								key={day.date}
								day={day}
								replacementStaff={replacementStaff}
								onAssignFullDay={(staffId) => handleAssignFullDay(day.date, staffId)}
								onAssignBySpecialization={(specId, staffId) =>
									handleAssignBySpecialization(day.date, specId, staffId)
								}
								onAssignIndividual={(aptId, staffId) =>
									handleAssignIndividual(day.date, aptId, staffId)
								}
								onSendOffer={(staffId) => handleSendOffer(day.date, staffId)}
								onChangeMode={(mode) => handleChangeMode(day.date, mode)}
							/>
						);
					})}
				</div>
			</div>
		</Card>
	);
}
