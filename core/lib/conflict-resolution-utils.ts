import type { Employee } from "@/features/core/types/types.staff";
import type { Appointment } from "@/features/core/types/types.dashboard-front-desk";
import type { WorkingHours, TimeOffEntry } from "@/features/core/types/types.calendar";
import type { ServiceRelationship } from "@/features/core/types/types.services";
import type {
	AppointmentConflict,
	ConflictDay,
	ReplacementStaff,
	StaffAvailabilityTier,
	Request,
} from "@/features/core/types/types.notifications";
import { getStaffServiceIds, isEmployeeWorkingOnDate, timeToMinutes } from "./booking-utils";

/**
 * Detect appointments that conflict with a time-off request
 */
export function detectTimeOffConflicts(
	staffId: string,
	startDate: string,
	endDate: string,
	appointments: Appointment[],
	services: Array<{ id: string; name: string; duration: number }>,
	serviceRelationships: ServiceRelationship,
	employees: Employee[],
): AppointmentConflict[] {
	const conflicts: AppointmentConflict[] = [];
	const start = new Date(startDate);
	const end = new Date(endDate);

	// Get the staff member's specializations to map services to specializations
	const employee = employees.find((e) => e.id === staffId);
	if (!employee) return conflicts;

	// Create a map of service ID to specialization ID
	const serviceToSpecMap = new Map<string, string>();
	Object.entries(serviceRelationships).forEach(([specId, serviceIds]) => {
		serviceIds.forEach((svcId) => {
			serviceToSpecMap.set(svcId, specId);
		});
	});

	// Filter appointments for this staff member within the date range
	const conflictingAppointments = appointments.filter((apt) => {
		if (apt.staffId !== staffId) return false;
		if (apt.status === "cancelled" || apt.status === "no-show") return false;

		const aptDate = new Date(apt.startTime);
		const aptDateStr = aptDate.toISOString().split("T")[0];
		return aptDateStr >= startDate && aptDateStr <= endDate;
	});

	// Convert to AppointmentConflict format
	conflictingAppointments.forEach((apt) => {
		const aptDate = new Date(apt.startTime);
		const aptEndTime = new Date(apt.endTime);

		// Get service details
		const service = services.find((s) => s.id === apt.serviceId);
		const serviceDetails = service
			? [
					{
						id: service.id,
						name: service.name,
						specializationId: serviceToSpecMap.get(service.id) || "",
						duration: service.duration,
					},
			  ]
			: [
					{
						id: apt.serviceId || apt.service,
						name: apt.service,
						specializationId: "",
						duration: apt.duration,
					},
			  ];

		conflicts.push({
			id: apt.id,
			date: aptDate.toISOString().split("T")[0],
			startTime: aptDate.toTimeString().substring(0, 5),
			endTime: aptEndTime.toTimeString().substring(0, 5),
			clientName: apt.customerName,
			clientPhone: apt.customerPhone,
			services: serviceDetails,
			status: "pending",
		});
	});

	return conflicts;
}

/**
 * Group conflicts by date for day-level management
 */
export function groupConflictsByDay(conflicts: AppointmentConflict[]): ConflictDay[] {
	const dayMap = new Map<string, AppointmentConflict[]>();

	// Group appointments by date
	conflicts.forEach((conflict) => {
		const existing = dayMap.get(conflict.date) || [];
		dayMap.set(conflict.date, [...existing, conflict]);
	});

	// Convert to ConflictDay objects
	const days: ConflictDay[] = [];

	dayMap.forEach((appointments, date) => {
		// Get all unique specialization IDs needed for this day
		const specializationIds = new Set<string>();
		appointments.forEach((apt) => {
			apt.services.forEach((svc) => {
				if (svc.specializationId) {
					specializationIds.add(svc.specializationId);
				}
			});
		});

		days.push({
			date,
			appointments,
			totalAppointments: appointments.length,
			requiredSpecializationIds: Array.from(specializationIds),
			assignmentMode: "single", // Default mode
			assignments: {},
			isResolved: false,
		});
	});

	// Sort by date
	days.sort((a, b) => a.date.localeCompare(b.date));

	return days;
}

/**
 * Determine staff availability tier for conflict resolution
 */
export function getStaffAvailabilityTier(
	employee: Employee,
	date: Date,
	workingHours: WorkingHours[],
	timeOffEntries: TimeOffEntry[],
	staffLeavePreferences?: Map<string, { willingToWork: boolean; leaveType?: string }>,
): {
	tier: StaffAvailabilityTier;
	leaveType?: string;
	unavailableReason?: string;
} {
	// Check if employee is on time off
	const dateStr = date.toISOString().split("T")[0];
	const timeOff = timeOffEntries.find(
		(to) => to.employeeId === employee.id && dateStr >= to.startDate && dateStr <= to.endDate,
	);

	if (timeOff) {
		// Check if this is a flexible leave type and they're willing to work
		const preferences = staffLeavePreferences?.get(employee.id);
		const isFlexibleLeave = timeOff.type === "vacation" || timeOff.type === "day-off";

		if (isFlexibleLeave && preferences?.willingToWork) {
			return {
				tier: "needs-approval",
				leaveType: timeOff.type,
			};
		}

		// Sick leave or unwilling to work during leave
		return {
			tier: "unavailable",
			leaveType: timeOff.type,
			unavailableReason: `On ${timeOff.type}`,
		};
	}

	// Check if employee is working on this date
	if (!isEmployeeWorkingOnDate(employee.id, date, workingHours, timeOffEntries)) {
		return {
			tier: "unavailable",
			unavailableReason: "Not scheduled to work",
		};
	}

	// Check if employee is inactive
	if (employee.status !== "active") {
		return {
			tier: "unavailable",
			unavailableReason: `Status: ${employee.status}`,
		};
	}

	// Fully available
	return {
		tier: "available",
	};
}

/**
 * Find qualified replacement staff for a conflict day
 */
export function findReplacementStaffForDay(
	day: ConflictDay,
	allEmployees: Employee[],
	excludeStaffId: string,
	date: Date,
	appointments: Appointment[],
	workingHours: WorkingHours[],
	timeOffEntries: TimeOffEntry[],
	serviceRelationships: ServiceRelationship,
	staffLeavePreferences?: Map<string, { willingToWork: boolean; leaveType?: string }>,
): ReplacementStaff[] {
	const dateStr = date.toISOString().split("T")[0];
	const replacements: ReplacementStaff[] = [];

	allEmployees.forEach((employee) => {
		if (employee.id === excludeStaffId) return; // Skip the person requesting time off

		// Get availability tier
		const { tier, leaveType, unavailableReason } = getStaffAvailabilityTier(
			employee,
			date,
			workingHours,
			timeOffEntries,
			staffLeavePreferences,
		);

		// Get services this employee can perform
		const canPerformServiceIds = getStaffServiceIds(employee, serviceRelationships);

		// Check which services from the conflict day they can handle
		const conflictServiceIds = new Set<string>();
		day.appointments.forEach((apt) => {
			apt.services.forEach((svc) => conflictServiceIds.add(svc.id));
		});

		const canTakeServiceIds = Array.from(conflictServiceIds).filter((svcId) =>
			canPerformServiceIds.includes(svcId),
		);

		// Check if they can take the full day (all services)
		const canTakeFullDay =
			canTakeServiceIds.length === conflictServiceIds.size &&
			day.requiredSpecializationIds.every((specId) => employee.specializationIds.includes(specId));

		// Count existing appointments and hours scheduled
		const existingAppointments = appointments.filter((apt) => {
			if (apt.staffId !== employee.id) return false;
			const aptDate = new Date(apt.startTime).toISOString().split("T")[0];
			return aptDate === dateStr && apt.status !== "cancelled" && apt.status !== "no-show";
		});

		const hoursScheduled =
			existingAppointments.reduce((sum, apt) => sum + apt.duration, 0) / 60;

		replacements.push({
			id: employee.id,
			name: employee.name,
			avatar: employee.avatar,
			specializationIds: employee.specializationIds,
			availability: tier,
			leaveType: leaveType as "vacation" | "personal-day" | "day-off" | "sick-leave" | undefined,
			willingToWork: tier === "needs-approval" ? true : undefined,
			existingAppointments: existingAppointments.length,
			hoursScheduled,
			canTakeFullDay,
			canTakeServiceIds,
			unavailableReason,
		});
	});

	// Sort by: available first, then needs-approval, then unavailable
	// Within each tier, sort by workload (fewer appointments first)
	const tierRank: Record<StaffAvailabilityTier, number> = {
		available: 1,
		"needs-approval": 2,
		unavailable: 3,
	};

	replacements.sort((a, b) => {
		const tierDiff = tierRank[a.availability] - tierRank[b.availability];
		if (tierDiff !== 0) return tierDiff;
		return a.existingAppointments - b.existingAppointments;
	});

	return replacements;
}

/**
 * Calculate total hours for a day's appointments
 */
export function calculateDayHours(appointments: AppointmentConflict[]): number {
	const totalMinutes = appointments.reduce((sum, apt) => {
		const duration = apt.services.reduce((svcSum, svc) => svcSum + svc.duration, 0);
		return sum + duration;
	}, 0);

	return totalMinutes / 60;
}

/**
 * Suggest the best assignment mode for a conflict day
 */
export function suggestAssignmentMode(
	day: ConflictDay,
	replacementStaff: ReplacementStaff[],
): "single" | "split" | "individual" {
	// Find staff who can take the full day
	const fullDayCandidates = replacementStaff.filter(
		(staff) =>
			staff.canTakeFullDay && (staff.availability === "available" || staff.availability === "needs-approval"),
	);

	if (fullDayCandidates.length > 0) {
		return "single"; // Recommend single assignment
	}

	// Check if we can split by specialization
	if (day.requiredSpecializationIds.length > 1) {
		return "split";
	}

	// Default to individual assignment
	return "individual";
}

/**
 * Check if all conflicts in a request are resolved
 */
export function areAllConflictsResolved(request: Request): boolean {
	if (!request.conflicts) return true;
	return request.conflicts.resolved === request.conflicts.total;
}

/**
 * Calculate progress percentage for conflict resolution
 */
export function calculateConflictProgress(request: Request): number {
	if (!request.conflicts || request.conflicts.total === 0) return 100;
	return Math.round((request.conflicts.resolved / request.conflicts.total) * 100);
}

/**
 * Get conflicts summary for a request
 */
export function getConflictsSummary(request: Request): {
	totalDays: number;
	totalAppointments: number;
	resolvedDays: number;
	pendingDays: number;
} {
	if (!request.conflicts) {
		return {
			totalDays: 0,
			totalAppointments: 0,
			resolvedDays: 0,
			pendingDays: 0,
		};
	}

	const totalDays = request.conflicts.days.length;
	const resolvedDays = request.conflicts.days.filter((day) => day.isResolved).length;
	const totalAppointments = request.conflicts.total;

	return {
		totalDays,
		totalAppointments,
		resolvedDays,
		pendingDays: totalDays - resolvedDays,
	};
}
