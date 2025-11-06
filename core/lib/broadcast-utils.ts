import type { Request, ConflictDay } from "@/features/core/types/types.notifications";
import type { Employee } from "@/features/core/types/types.staff";

export interface CoverageBroadcast {
	id: string;
	requestId: string;
	requestedBy: {
		id: string;
		name: string;
	};
	conflictDays: Array<{
		date: string;
		totalAppointments: number;
		totalHours: number;
	}>;
	broadcastOptions: {
		allowFullDaysOnly: boolean;
		allowIndividualDays: boolean;
		allowIndividualAppointments: boolean;
	};
	responseDeadline: string; // ISO timestamp
	notifiedStaff: string[]; // Employee IDs
	responses: CoverageBroadcastResponse[];
	status: "pending" | "partially-filled" | "fully-filled" | "expired";
	createdAt: string;
}

export interface CoverageBroadcastResponse {
	id: string;
	broadcastId: string;
	staffId: string;
	staffName: string;
	offering: {
		type: "full-coverage" | "partial-days" | "individual-appointments";
		days?: string[]; // Dates they can cover
		appointmentIds?: string[]; // Specific appointments
		totalHours: number;
	};
	compensation?: {
		requestedOvertimePay: boolean;
		requestedBonus?: number;
		requestedTimeOffCredit?: number;
	};
	message?: string; // Optional message from staff
	status: "pending" | "accepted" | "declined";
	respondedAt: string;
}

/**
 * Create a coverage broadcast for a time-off request
 */
export function createCoverageBroadcast(
	request: Request,
	notifiedStaffIds: string[],
	options: {
		allowFullDaysOnly: boolean;
		allowIndividualDays: boolean;
		allowIndividualAppointments: boolean;
		deadlineHours: number;
	},
): CoverageBroadcast {
	const deadline = new Date();
	deadline.setHours(deadline.getHours() + options.deadlineHours);

	const conflictDays =
		request.conflicts?.days.map((day) => {
			const totalHours =
				day.appointments.reduce((sum, apt) => {
					const duration = apt.services.reduce((svcSum, svc) => svcSum + svc.duration, 0);
					return sum + duration;
				}, 0) / 60;

			return {
				date: day.date,
				totalAppointments: day.totalAppointments,
				totalHours,
			};
		}) || [];

	return {
		id: `broadcast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
		requestId: request.id,
		requestedBy: {
			id: request.createdBy?.id || "",
			name: request.createdBy?.name || "",
		},
		conflictDays,
		broadcastOptions: {
			allowFullDaysOnly: options.allowFullDaysOnly,
			allowIndividualDays: options.allowIndividualDays,
			allowIndividualAppointments: options.allowIndividualAppointments,
		},
		responseDeadline: deadline.toISOString(),
		notifiedStaff: notifiedStaffIds,
		responses: [],
		status: "pending",
		createdAt: new Date().toISOString(),
	};
}

/**
 * Get eligible staff for broadcast (available + on flexible leave)
 */
export function getEligibleStaffForBroadcast(
	allEmployees: Employee[],
	excludeStaffId: string,
): {
	available: Employee[];
	onFlexibleLeave: Employee[];
	total: number;
} {
	const available: Employee[] = [];
	const onFlexibleLeave: Employee[] = [];

	allEmployees.forEach((employee) => {
		if (employee.id === excludeStaffId) return;

		if (employee.status === "active") {
			available.push(employee);
		} else if (employee.status === "on-leave") {
			// In production, check if on flexible leave (vacation/personal)
			onFlexibleLeave.push(employee);
		}
	});

	return {
		available,
		onFlexibleLeave,
		total: available.length + onFlexibleLeave.length,
	};
}

/**
 * Create a volunteer response
 */
export function createVolunteerResponse(
	broadcastId: string,
	staffId: string,
	staffName: string,
	offering: {
		type: "full-coverage" | "partial-days" | "individual-appointments";
		days?: string[];
		appointmentIds?: string[];
		totalHours: number;
	},
	requestedCompensation?: {
		overtimePay: boolean;
		bonus?: number;
		timeOffCredit?: number;
	},
	message?: string,
): CoverageBroadcastResponse {
	return {
		id: `response-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
		broadcastId,
		staffId,
		staffName,
		offering,
		compensation: requestedCompensation
			? {
					requestedOvertimePay: requestedCompensation.overtimePay,
					requestedBonus: requestedCompensation.bonus,
					requestedTimeOffCredit: requestedCompensation.timeOffCredit,
			  }
			: undefined,
		message,
		status: "pending",
		respondedAt: new Date().toISOString(),
	};
}

/**
 * Apply volunteer response to request
 */
export function applyVolunteerResponse(
	request: Request,
	response: CoverageBroadcastResponse,
): Request {
	if (!request.conflicts) return request;

	const updatedDays = request.conflicts.days.map((day) => {
		// Check if this response covers this day
		const coversThisDay =
			response.offering.type === "full-coverage" ||
			(response.offering.type === "partial-days" && response.offering.days?.includes(day.date));

		if (coversThisDay) {
			return {
				...day,
				assignmentMode: "single" as const,
				assignments: {
					fullDay: {
						staffId: response.staffId,
						staffName: response.staffName,
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

/**
 * Check if broadcast has expired
 */
export function isBroadcastExpired(broadcast: CoverageBroadcast): boolean {
	return new Date() > new Date(broadcast.responseDeadline);
}

/**
 * Get broadcast status summary
 */
export function getBroadcastSummary(broadcast: CoverageBroadcast): {
	totalResponses: number;
	fullCoverageOffers: number;
	partialCoverageOffers: number;
	hoursRemaining: number;
	isExpired: boolean;
} {
	const totalResponses = broadcast.responses.length;
	const fullCoverageOffers = broadcast.responses.filter(
		(r) => r.offering.type === "full-coverage",
	).length;
	const partialCoverageOffers = broadcast.responses.filter(
		(r) => r.offering.type === "partial-days",
	).length;

	const deadline = new Date(broadcast.responseDeadline);
	const now = new Date();
	const hoursRemaining = Math.max(0, (deadline.getTime() - now.getTime()) / (1000 * 60 * 60));

	return {
		totalResponses,
		fullCoverageOffers,
		partialCoverageOffers,
		hoursRemaining: Math.round(hoursRemaining * 10) / 10,
		isExpired: isBroadcastExpired(broadcast),
	};
}
