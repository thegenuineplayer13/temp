import type { Employee } from "@/features/core/types/types.staff";
import type { Appointment } from "@/features/core/types/types.dashboard-front-desk";
import type { WorkingHours, TimeOffEntry } from "@/features/core/types/types.calendar";
import type { ServiceRelationship } from "@/features/core/types/types.services";
import type { ConflictDay, Request } from "@/features/core/types/types.notifications";
import {
	findReplacementStaffForDay,
	getStaffAvailabilityTier,
} from "./conflict-resolution-utils";

export interface SmartSuggestion {
	canAutoResolve: boolean;
	confidence: "high" | "medium" | "low";
	suggestion: {
		staffId: string;
		staffName: string;
		days: string[]; // Dates this staff member covers
		totalAppointments: number;
		totalHours: number;
		reasons: string[]; // Why this is a good choice
	} | null;
	alternatives?: Array<{
		staffId: string;
		staffName: string;
		days: string[];
		reason: string;
	}>;
	needsManualReview: boolean;
	manualReviewReason?: string;
}

/**
 * Generate smart suggestion for resolving all conflicts automatically
 */
export function generateSmartSuggestion(
	request: Request,
	allEmployees: Employee[],
	appointments: Appointment[],
	workingHours: WorkingHours[],
	timeOffEntries: TimeOffEntry[],
	serviceRelationships: ServiceRelationship,
): SmartSuggestion {
	if (!request.conflicts || request.conflicts.days.length === 0) {
		return {
			canAutoResolve: true,
			confidence: "high",
			suggestion: null,
			needsManualReview: false,
		};
	}

	const days = request.conflicts.days;
	const totalAppointments = request.conflicts.total;

	// Find staff who can cover ALL days
	const staffScores = new Map<
		string,
		{
			staff: Employee;
			canCoverDays: string[];
			score: number;
			reasons: string[];
			totalHours: number;
		}
	>();

	allEmployees.forEach((employee) => {
		if (employee.id === request.createdBy?.id) return; // Skip person requesting time off

		const canCoverDays: string[] = [];
		let totalHours = 0;
		const reasons: string[] = [];

		// Check if this employee can cover each day
		days.forEach((day) => {
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

			const staffOption = replacementStaff.find((s) => s.id === employee.id);

			if (staffOption && staffOption.canTakeFullDay && staffOption.availability === "available") {
				canCoverDays.push(day.date);
				// Calculate hours for this day
				const dayHours =
					day.appointments.reduce((sum, apt) => {
						const duration = apt.services.reduce((svcSum, svc) => svcSum + svc.duration, 0);
						return sum + duration;
					}, 0) / 60;
				totalHours += dayHours;
			}
		});

		if (canCoverDays.length > 0) {
			// Calculate score
			let score = 0;

			// Can cover all days? Big bonus
			if (canCoverDays.length === days.length) {
				score += 100;
				reasons.push("Can cover all days");
			} else {
				score += canCoverDays.length * 30;
				reasons.push(`Can cover ${canCoverDays.length}/${days.length} days`);
			}

			// Lower current workload = higher score
			const staffOption = findReplacementStaffForDay(
				days[0],
				allEmployees,
				request.createdBy?.id || "",
				new Date(days[0].date),
				appointments,
				workingHours,
				timeOffEntries,
				serviceRelationships,
			).find((s) => s.id === employee.id);

			if (staffOption) {
				const workloadScore = Math.max(0, 50 - staffOption.hoursScheduled * 5);
				score += workloadScore;

				if (staffOption.hoursScheduled < 4) {
					reasons.push("Light current schedule");
				} else if (staffOption.hoursScheduled < 6) {
					reasons.push("Moderate current schedule");
				}
			}

			// Prefer active status
			if (employee.status === "active") {
				score += 20;
				reasons.push("Active and available");
			}

			staffScores.set(employee.id, {
				staff: employee,
				canCoverDays,
				score,
				reasons,
				totalHours,
			});
		}
	});

	// Sort by score
	const sortedStaff = Array.from(staffScores.values()).sort((a, b) => b.score - a.score);

	if (sortedStaff.length === 0) {
		return {
			canAutoResolve: false,
			confidence: "low",
			suggestion: null,
			needsManualReview: true,
			manualReviewReason: "No staff available to cover all days",
		};
	}

	const bestOption = sortedStaff[0];

	// Check if we have high confidence
	const canCoverAllDays = bestOption.canCoverDays.length === days.length;
	const hasLowWorkload = bestOption.score > 150;

	let confidence: "high" | "medium" | "low" = "medium";
	if (canCoverAllDays && hasLowWorkload) {
		confidence = "high";
	} else if (canCoverAllDays) {
		confidence = "medium";
	} else {
		confidence = "low";
	}

	const alternatives = sortedStaff.slice(1, 4).map((option) => ({
		staffId: option.staff.id,
		staffName: option.staff.name,
		days: option.canCoverDays,
		reason:
			option.canCoverDays.length === days.length
				? "Can also cover all days"
				: `Can cover ${option.canCoverDays.length} out of ${days.length} days`,
	}));

	return {
		canAutoResolve: canCoverAllDays,
		confidence,
		suggestion: {
			staffId: bestOption.staff.id,
			staffName: bestOption.staff.name,
			days: bestOption.canCoverDays,
			totalAppointments:
				canCoverAllDays
					? totalAppointments
					: days
							.filter((d) => bestOption.canCoverDays.includes(d.date))
							.reduce((sum, d) => sum + d.totalAppointments, 0),
			totalHours: bestOption.totalHours,
			reasons: bestOption.reasons,
		},
		alternatives: alternatives.length > 0 ? alternatives : undefined,
		needsManualReview: !canCoverAllDays,
		manualReviewReason: !canCoverAllDays
			? `Only covers ${bestOption.canCoverDays.length} of ${days.length} days`
			: undefined,
	};
}

/**
 * Apply smart suggestion to a request
 */
export function applySmartSuggestion(request: Request, suggestion: SmartSuggestion): Request {
	if (!request.conflicts || !suggestion.suggestion) return request;

	const updatedDays = request.conflicts.days.map((day) => {
		if (suggestion.suggestion!.days.includes(day.date)) {
			return {
				...day,
				assignmentMode: "single" as const,
				assignments: {
					fullDay: {
						staffId: suggestion.suggestion!.staffId,
						staffName: suggestion.suggestion!.staffName,
						appointmentIds: day.appointments.map((apt) => apt.id),
					},
				},
				isResolved: true,
			};
		}
		return day;
	});

	const resolvedCount = updatedDays.filter((d) => d.isResolved).length;

	return {
		...request,
		conflicts: {
			...request.conflicts,
			days: updatedDays,
			resolved: resolvedCount,
		},
	};
}
