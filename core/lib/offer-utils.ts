import type { WorkOffer, ConflictDay } from "@/features/core/types/types.notifications";
import { calculateDayHours } from "./conflict-resolution-utils";

/**
 * Create a work offer for staff on leave to cover a conflict day
 */
export function createWorkOffer(
	requestId: string,
	targetStaffId: string,
	targetStaffName: string,
	offeredById: string,
	offeredByName: string,
	conflictDay: ConflictDay,
): WorkOffer {
	const totalHours = calculateDayHours(conflictDay.appointments);
	const expiresAt = new Date();
	expiresAt.setHours(expiresAt.getHours() + 48); // Offer expires in 48 hours

	return {
		id: `offer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
		type: "time-off-coverage",
		fromRequestId: requestId,
		targetStaffId,
		targetStaffName,
		offeredBy: {
			id: offeredById,
			name: offeredByName,
		},
		coverageDetails: {
			date: conflictDay.date,
			appointments: conflictDay.appointments,
			totalHours,
			estimatedRevenue: calculateEstimatedRevenue(conflictDay),
		},
		compensation: {
			overtimePay: true,
			timeOffCredit: 1, // 1 day of time-off credit
		},
		status: "pending",
		expiresAt: expiresAt.toISOString(),
		createdAt: new Date().toISOString(),
	};
}

/**
 * Calculate estimated revenue for a conflict day
 * This is a placeholder - in production you'd calculate based on actual service prices
 */
function calculateEstimatedRevenue(conflictDay: ConflictDay): number {
	// Placeholder: assume average of $50 per appointment
	return conflictDay.totalAppointments * 50;
}

/**
 * Calculate compensation based on hours and company policy
 */
export function calculateCompensation(
	totalHours: number,
	overtimePay: boolean = true,
): {
	overtimePay: boolean;
	bonusAmount?: number;
	timeOffCredit?: number;
} {
	const baseCompensation = {
		overtimePay,
	};

	// If working more than 6 hours, add time-off credit
	if (totalHours > 6) {
		return {
			...baseCompensation,
			timeOffCredit: Math.ceil(totalHours / 8), // 1 day credit per 8 hours
		};
	}

	// If working less than 4 hours, offer bonus instead
	if (totalHours < 4) {
		return {
			...baseCompensation,
			bonusAmount: Math.round(totalHours * 25), // $25 per hour bonus
		};
	}

	return baseCompensation;
}

/**
 * Process work offer response
 */
export function processOfferResponse(
	offer: WorkOffer,
	accepted: boolean,
	respondedAt: string = new Date().toISOString(),
): WorkOffer {
	return {
		...offer,
		status: accepted ? "accepted" : "declined",
		respondedAt,
	};
}

/**
 * Check if an offer is expired
 */
export function isOfferExpired(offer: WorkOffer): boolean {
	const now = new Date();
	const expiresAt = new Date(offer.expiresAt);
	return now > expiresAt;
}

/**
 * Format compensation for display
 */
export function formatCompensation(compensation?: WorkOffer["compensation"]): string {
	if (!compensation) return "Standard pay";

	const parts: string[] = [];

	if (compensation.overtimePay) {
		parts.push("1.5x overtime pay");
	}

	if (compensation.bonusAmount) {
		parts.push(`$${compensation.bonusAmount} bonus`);
	}

	if (compensation.timeOffCredit) {
		const days = compensation.timeOffCredit === 1 ? "1 day" : `${compensation.timeOffCredit} days`;
		parts.push(`${days} time-off credit`);
	}

	return parts.join(" + ") || "Standard pay";
}

/**
 * Get offer status color for UI
 */
export function getOfferStatusColor(
	status: WorkOffer["status"],
): "yellow" | "green" | "red" | "gray" {
	switch (status) {
		case "pending":
			return "yellow";
		case "accepted":
			return "green";
		case "declined":
			return "red";
		default:
			return "gray";
	}
}

/**
 * Get offer status label
 */
export function getOfferStatusLabel(status: WorkOffer["status"]): string {
	switch (status) {
		case "pending":
			return "Pending Response";
		case "accepted":
			return "Accepted";
		case "declined":
			return "Declined";
		default:
			return "Unknown";
	}
}
