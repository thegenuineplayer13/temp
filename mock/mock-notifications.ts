import type { Notification, NotificationStats } from "@/features/core/types/types.notifications";

// ============================================================================
// Mock Alerts
// ============================================================================

export const mockAlerts: Notification[] = [
	// Inventory Alerts
	{
		id: "alert-1",
		category: "alert",
		type: "inventory-low",
		priority: "high",
		status: "unread",
		title: "Low Stock: Premium Shampoo",
		description: "Premium Shampoo stock is running low. Current level: 3 bottles remaining.",
		createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
		actionRequired: true,
		actionUrl: "/inventory",
		affectedEntities: [
			{ id: "item-1", type: "product", name: "Premium Shampoo" },
		],
		metadata: {
			currentStock: 3,
			reorderLevel: 10,
			supplier: "Beauty Supplies Co.",
			estimatedDaysRemaining: 2,
		},
	},
	{
		id: "alert-2",
		category: "alert",
		type: "inventory-out",
		priority: "urgent",
		status: "acknowledged",
		title: "Out of Stock: Hair Dye Kit",
		description: "Hair Dye Kit is completely out of stock. Unable to fulfill color services.",
		createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
		acknowledgedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
		actionRequired: true,
		actionUrl: "/inventory",
		affectedEntities: [
			{ id: "item-2", type: "product", name: "Hair Dye Kit" },
			{ id: "svc-1", type: "service", name: "Hair Coloring" },
		],
		metadata: {
			currentStock: 0,
			affectedServices: ["Hair Coloring", "Highlights"],
			nextDeliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
		},
	},
	{
		id: "alert-3",
		category: "alert",
		type: "inventory-expiring",
		priority: "medium",
		status: "unread",
		title: "Expiring Soon: Chemical Treatment Kit",
		description: "Chemical Treatment Kit expires in 5 days. 8 units need to be used or discarded.",
		createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
		actionRequired: true,
		metadata: {
			expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
			quantity: 8,
			purchaseValue: 320,
		},
	},

	// Staff Alerts
	{
		id: "alert-4",
		category: "alert",
		type: "staff-no-show",
		priority: "urgent",
		status: "unread",
		title: "No Show: Sarah Johnson",
		description: "Sarah Johnson has not checked in for her 9:00 AM shift. 6 appointments affected.",
		createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
		actionRequired: true,
		affectedEntities: [
			{ id: "emp-1", type: "employee", name: "Sarah Johnson" },
		],
		metadata: {
			scheduledTime: "9:00 AM",
			affectedAppointments: 6,
			potentialRevenueLoss: 480,
			possibleReplacements: [
				{ id: "emp-5", name: "Emma Davis" },
				{ id: "emp-6", name: "Mike Wilson" },
			],
		},
	},
	{
		id: "alert-5",
		category: "alert",
		type: "staff-late",
		priority: "medium",
		status: "acknowledged",
		title: "Late Arrival: Tom Martinez",
		description: "Tom Martinez checked in 25 minutes late. First appointment delayed.",
		createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
		acknowledgedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
		affectedEntities: [
			{ id: "emp-2", type: "employee", name: "Tom Martinez" },
		],
		metadata: {
			scheduledTime: "8:00 AM",
			actualCheckIn: "8:25 AM",
			delayMinutes: 25,
			affectedAppointments: 1,
		},
	},
	{
		id: "alert-6",
		category: "alert",
		type: "staff-early-departure",
		priority: "low",
		status: "resolved",
		title: "Early Departure: Lisa Brown",
		description: "Lisa Brown left 30 minutes before scheduled end of shift.",
		createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
		resolvedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
		resolvedBy: { id: "mgr-1", name: "Manager" },
		affectedEntities: [
			{ id: "emp-3", type: "employee", name: "Lisa Brown" },
		],
		metadata: {
			scheduledEnd: "6:00 PM",
			actualDeparture: "5:30 PM",
			reason: "Family emergency",
		},
	},

	// Operations Alerts
	{
		id: "alert-7",
		category: "alert",
		type: "appointment-conflict",
		priority: "high",
		status: "unread",
		title: "Double Booking Detected",
		description: "Two appointments scheduled for Sarah Johnson at 2:00 PM today.",
		createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
		actionRequired: true,
		actionUrl: "/schedule",
		affectedEntities: [
			{ id: "apt-1", type: "appointment", name: "Haircut - John Doe" },
			{ id: "apt-2", type: "appointment", name: "Color - Jane Smith" },
		],
		metadata: {
			conflictTime: "2:00 PM",
			appointments: [
				{ id: "apt-1", customer: "John Doe", service: "Haircut" },
				{ id: "apt-2", customer: "Jane Smith", service: "Hair Color" },
			],
		},
	},
	{
		id: "alert-8",
		category: "alert",
		type: "equipment-malfunction",
		priority: "urgent",
		status: "unread",
		title: "Equipment Issue: Dryer Station 3",
		description: "Dryer Station 3 is not heating properly. Reported by staff.",
		createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
		actionRequired: true,
		affectedEntities: [
			{ id: "equip-1", type: "equipment", name: "Dryer Station 3" },
		],
		metadata: {
			equipmentId: "DRY-003",
			issue: "No heat output",
			reportedBy: "Sarah Johnson",
			lastMaintenance: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
		},
	},
	{
		id: "alert-9",
		category: "alert",
		type: "maintenance-due",
		priority: "low",
		status: "unread",
		title: "Scheduled Maintenance: HVAC System",
		description: "HVAC system maintenance is due within 7 days.",
		createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
		actionRequired: true,
		metadata: {
			equipmentType: "HVAC System",
			lastMaintenance: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
			dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
			contractorContact: "ABC Maintenance - (555) 123-4567",
		},
	},

	// System Alerts
	{
		id: "alert-10",
		category: "alert",
		type: "payment-failed",
		priority: "high",
		status: "unread",
		title: "Payment Declined: Customer #1234",
		description: "Credit card payment for $125 appointment was declined.",
		createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
		actionRequired: true,
		affectedEntities: [
			{ id: "cust-1234", type: "customer", name: "Mike Johnson" },
			{ id: "apt-5", type: "appointment", name: "Haircut & Beard Trim" },
		],
		metadata: {
			customerId: "1234",
			customerName: "Mike Johnson",
			amount: 125,
			appointmentId: "apt-5",
			declineReason: "Insufficient funds",
		},
	},
	{
		id: "alert-11",
		category: "alert",
		type: "license-expiring",
		priority: "medium",
		status: "unread",
		title: "License Expiring: Sarah Johnson",
		description: "Cosmetology license for Sarah Johnson expires in 30 days.",
		createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
		actionRequired: true,
		affectedEntities: [
			{ id: "emp-1", type: "employee", name: "Sarah Johnson" },
		],
		metadata: {
			licenseType: "Cosmetology License",
			employeeId: "emp-1",
			employeeName: "Sarah Johnson",
			expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
			renewalUrl: "https://licensing.example.com",
		},
	},
	{
		id: "alert-12",
		category: "alert",
		type: "system-update",
		priority: "low",
		status: "unread",
		title: "System Update Available",
		description: "A new version of the booking system is available with bug fixes and improvements.",
		createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
		actionRequired: false,
		metadata: {
			version: "2.4.0",
			releaseNotes: "Bug fixes and performance improvements",
			updateSize: "45 MB",
		},
	},
];

// ============================================================================
// Mock Requests
// ============================================================================

export const mockRequests: Notification[] = [
	// Time Off Requests
	{
		id: "req-1",
		category: "request",
		type: "day-off",
		priority: "high",
		status: "pending",
		title: "Day Off Request: Sarah Johnson",
		description: "Sarah Johnson is requesting a day off on Friday, Nov 8th.",
		createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
		createdBy: { id: "emp-1", name: "Sarah Johnson", role: "Hair Stylist" },
		startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
		endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
		duration: 1,
		reason: "Personal appointment",
		affectedAppointments: 8,
		metadata: {
			requestedDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
			suggestedReplacements: [
				{ id: "emp-5", name: "Emma Davis" },
				{ id: "emp-6", name: "Mike Wilson" },
			],
		},
	},
	{
		id: "req-2",
		category: "request",
		type: "vacation",
		priority: "medium",
		status: "pending",
		title: "Vacation Request: Tom Martinez",
		description: "Tom Martinez is requesting vacation from Nov 15-22 (7 days).",
		createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
		createdBy: { id: "emp-2", name: "Tom Martinez", role: "Barber" },
		startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
		endDate: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000).toISOString(),
		duration: 7,
		reason: "Family vacation",
		affectedAppointments: 42,
		metadata: {
			advanceNotice: 10,
			canReschedule: true,
		},
	},
	{
		id: "req-3",
		category: "request",
		type: "sick-leave",
		priority: "urgent",
		status: "pending",
		title: "Sick Leave: Lisa Brown",
		description: "Lisa Brown called in sick and needs to take today off.",
		createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
		createdBy: { id: "emp-3", name: "Lisa Brown", role: "Nail Technician" },
		startDate: new Date().toISOString(),
		endDate: new Date().toISOString(),
		duration: 1,
		reason: "Flu symptoms",
		affectedAppointments: 6,
		metadata: {
			emergencyContact: true,
			doctorNote: false,
		},
	},
	{
		id: "req-4",
		category: "request",
		type: "personal-day",
		priority: "low",
		status: "approved",
		title: "Personal Day: Emma Davis",
		description: "Emma Davis requested a personal day on Monday, Nov 11th.",
		createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
		createdBy: { id: "emp-5", name: "Emma Davis", role: "Hair Stylist" },
		startDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
		endDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
		duration: 1,
		status: "approved",
		reviewedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
		reviewedBy: { id: "mgr-1", name: "Manager" },
		reviewNotes: "Approved - coverage arranged",
		affectedAppointments: 5,
		replacement: { id: "emp-6", name: "Mike Wilson" },
	},
	{
		id: "req-5",
		category: "request",
		type: "bereavement",
		priority: "urgent",
		status: "approved",
		title: "Bereavement Leave: Mike Wilson",
		description: "Mike Wilson requested bereavement leave for 3 days.",
		createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
		createdBy: { id: "emp-6", name: "Mike Wilson", role: "Barber" },
		startDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
		endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
		duration: 3,
		reason: "Family member passed away",
		status: "approved",
		reviewedAt: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
		reviewedBy: { id: "mgr-1", name: "Manager" },
		reviewNotes: "Approved immediately - condolences",
		affectedAppointments: 18,
	},

	// Schedule Requests
	{
		id: "req-6",
		category: "request",
		type: "shift-swap",
		priority: "medium",
		status: "pending",
		title: "Shift Swap Request: Sarah Johnson & Emma Davis",
		description: "Sarah Johnson wants to swap her Thursday shift with Emma Davis's Saturday shift.",
		createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
		createdBy: { id: "emp-1", name: "Sarah Johnson", role: "Hair Stylist" },
		startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
		duration: 1,
		reason: "Personal commitment on Thursday",
		affectedAppointments: 12,
		metadata: {
			swapWith: { id: "emp-5", name: "Emma Davis" },
			originalShift: "Thursday 9AM-5PM",
			swapShift: "Saturday 10AM-6PM",
			bothApproved: true,
		},
	},
	{
		id: "req-7",
		category: "request",
		type: "schedule-change",
		priority: "low",
		status: "pending",
		title: "Schedule Change: Tom Martinez",
		description: "Tom Martinez requesting to start 1 hour later on Wednesdays (9AM instead of 8AM).",
		createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
		createdBy: { id: "emp-2", name: "Tom Martinez", role: "Barber" },
		duration: 52, // 52 weeks / permanent
		reason: "Enrolled in professional development course",
		affectedAppointments: 0,
		metadata: {
			currentSchedule: "Wed 8AM-5PM",
			requestedSchedule: "Wed 9AM-6PM",
			effectiveDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
			duration: "Permanent",
		},
	},

	// Other Requests
	{
		id: "req-8",
		category: "request",
		type: "equipment-request",
		priority: "medium",
		status: "pending",
		title: "Equipment Request: New Styling Chair",
		description: "Lisa Brown requesting a new ergonomic styling chair at station 2.",
		createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
		createdBy: { id: "emp-3", name: "Lisa Brown", role: "Hair Stylist" },
		reason: "Current chair has broken hydraulics and causes back pain",
		metadata: {
			equipmentType: "Styling Chair",
			estimatedCost: 450,
			supplier: "Salon Equipment Co.",
			urgency: "Medium - current chair still usable but uncomfortable",
		},
	},
	{
		id: "req-9",
		category: "request",
		type: "training-request",
		priority: "low",
		status: "rejected",
		title: "Training Request: Advanced Color Techniques",
		description: "Emma Davis requesting to attend a 2-day advanced color techniques workshop.",
		createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
		createdBy: { id: "emp-5", name: "Emma Davis", role: "Hair Stylist" },
		reason: "To expand service offerings and stay current with trends",
		status: "rejected",
		reviewedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
		reviewedBy: { id: "mgr-1", name: "Manager" },
		reviewNotes: "Budget constraints - please resubmit next quarter",
		metadata: {
			courseName: "Advanced Color Techniques Masterclass",
			provider: "Beauty Education Institute",
			cost: 850,
			dates: [
				new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
				new Date(Date.now() + 22 * 24 * 60 * 60 * 1000).toISOString(),
			],
			affectedDays: 2,
		},
	},
	{
		id: "req-10",
		category: "request",
		type: "training-request",
		priority: "high",
		status: "approved",
		title: "Training Request: Safety Certification Renewal",
		description: "Tom Martinez needs to renew safety certification (required).",
		createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
		createdBy: { id: "emp-2", name: "Tom Martinez", role: "Barber" },
		reason: "Certification expires in 45 days - required for employment",
		status: "approved",
		reviewedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
		reviewedBy: { id: "mgr-1", name: "Manager" },
		reviewNotes: "Approved - mandatory certification",
		affectedAppointments: 4,
		metadata: {
			courseName: "Safety & Sanitation Certification",
			provider: "State Licensing Board",
			cost: 150,
			date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
			certificationType: "Required",
			expiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
		},
	},
];

// ============================================================================
// Combined Mock Data
// ============================================================================

export const mockNotifications: Notification[] = [...mockAlerts, ...mockRequests];

// ============================================================================
// Mock Stats
// ============================================================================

export const mockNotificationStats: NotificationStats = {
	total: mockNotifications.length,
	unreadAlerts: mockAlerts.filter((a) => a.status === "unread").length,
	pendingRequests: mockRequests.filter((r) => r.status === "pending").length,
	urgentCount: mockNotifications.filter((n) => n.priority === "urgent").length,
	highCount: mockNotifications.filter((n) => n.priority === "high").length,
	mediumCount: mockNotifications.filter((n) => n.priority === "medium").length,
	lowCount: mockNotifications.filter((n) => n.priority === "low").length,
	todayCount: mockNotifications.filter((n) => {
		const createdDate = new Date(n.createdAt);
		const today = new Date();
		return (
			createdDate.getDate() === today.getDate() &&
			createdDate.getMonth() === today.getMonth() &&
			createdDate.getFullYear() === today.getFullYear()
		);
	}).length,
	thisWeekCount: mockNotifications.filter((n) => {
		const createdDate = new Date(n.createdAt);
		const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
		return createdDate > weekAgo;
	}).length,
};
