import { useMemo, useState } from "react";
import { useDocumentTitle } from "@/hooks/use-route";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Bell,
	ClipboardList,
	Search,
	X,
	AlertTriangle,
	Clock,
	AlertCircle,
	Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
	useNotifications,
	useNotificationStats,
	useAcknowledgeAlert,
	useResolveAlert,
	useApproveRequest,
	useRejectRequest,
} from "@/features/core/hooks/queries/queries.notifications";
import { useNotificationsStore } from "@/features/core/store/store.notifications";
import { NotificationRouter } from "@/features/core/components/notifications/notification-router";
import type {
	NotificationCategory,
	PriorityLevel,
	AlertType,
	RequestType,
} from "@/features/core/types/types.notifications";
import {
	getAlertTypeIcon,
	getRequestTypeIcon,
	getAlertTypeLabel,
	getRequestTypeLabel,
	getPriorityColor,
} from "@/features/core/components/notifications/notification-utils";

export default function NotificationsPage() {
	useDocumentTitle("Alerts & Requests");
	const isMobile = useIsMobile();
	const { data: notifications = [] } = useNotifications();
	const { data: stats } = useNotificationStats();
	const {
		categoryFilter,
		priorityFilter,
		statusFilter,
		typeFilter,
		searchQuery,
		setCategoryFilter,
		setPriorityFilter,
		setStatusFilter,
		setTypeFilter,
		setSearchQuery,
		clearFilters,
		selectedNotificationId,
		openDetail,
		closeDetail,
	} = useNotificationsStore();

	const acknowledgeMutation = useAcknowledgeAlert();
	const resolveMutation = useResolveAlert();
	const approveMutation = useApproveRequest();
	const rejectMutation = useRejectRequest();

	// Filter notifications
	const filteredNotifications = useMemo(() => {
		let filtered = [...notifications];

		// Category filter
		if (categoryFilter !== "all") {
			filtered = filtered.filter((n) => n.category === categoryFilter);
		}

		// Priority filter
		if (priorityFilter !== "all") {
			filtered = filtered.filter((n) => n.priority === priorityFilter);
		}

		// Status filter
		if (statusFilter === "active") {
			filtered = filtered.filter((n) =>
				n.category === "alert"
					? n.status !== "resolved"
					: n.status === "pending",
			);
		} else if (statusFilter === "completed") {
			filtered = filtered.filter((n) =>
				n.category === "alert"
					? n.status === "resolved"
					: n.status === "approved" || n.status === "rejected",
			);
		}

		// Type filter
		if (typeFilter !== "all") {
			filtered = filtered.filter((n) => n.type === typeFilter);
		}

		// Search filter
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(n) =>
					n.title.toLowerCase().includes(query) ||
					n.description.toLowerCase().includes(query) ||
					(n.createdBy?.name && n.createdBy.name.toLowerCase().includes(query)),
			);
		}

		// Sort by priority and date
		const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
		filtered.sort((a, b) => {
			const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
			if (priorityDiff !== 0) return priorityDiff;
			return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
		});

		return filtered;
	}, [notifications, categoryFilter, priorityFilter, statusFilter, typeFilter, searchQuery]);

	// Group by priority
	const groupedByPriority = useMemo(() => {
		const groups: Record<PriorityLevel, typeof filteredNotifications> = {
			urgent: [],
			high: [],
			medium: [],
			low: [],
		};

		filteredNotifications.forEach((n) => {
			groups[n.priority].push(n);
		});

		return groups;
	}, [filteredNotifications]);

	// Get unique types for filter
	const availableTypes = useMemo(() => {
		const types = new Set(notifications.map((n) => n.type));
		return Array.from(types).sort();
	}, [notifications]);

	const activeFiltersCount = [
		categoryFilter !== "all",
		priorityFilter !== "all",
		statusFilter !== "all",
		typeFilter !== "all",
		searchQuery !== "",
	].filter(Boolean).length;

	const handleAcknowledge = (id: string) => {
		acknowledgeMutation.mutate(id);
	};

	const handleResolve = (id: string) => {
		resolveMutation.mutate(id);
	};

	const handleApprove = (id: string) => {
		approveMutation.mutate({ requestId: id });
	};

	const handleReject = (id: string) => {
		rejectMutation.mutate({ requestId: id });
	};

	if (!stats) return null;

	const priorityGroups: Array<{
		priority: PriorityLevel;
		label: string;
		icon: React.ElementType;
		color: string;
	}> = [
		{
			priority: "urgent",
			label: "Urgent",
			icon: AlertTriangle,
			color: "text-red-600 dark:text-red-500",
		},
		{
			priority: "high",
			label: "High Priority",
			icon: AlertCircle,
			color: "text-orange-600 dark:text-orange-500",
		},
		{
			priority: "medium",
			label: "Needs Attention",
			icon: Clock,
			color: "text-yellow-600 dark:text-yellow-500",
		},
		{
			priority: "low",
			label: "For Review",
			icon: Info,
			color: "text-blue-600 dark:text-blue-500",
		},
	];

	return (
		<div className="min-h-screen bg-background pb-6">
			{/* Header */}
			<div className="sticky top-0 z-20 bg-background border-b border-border">
				<div className={cn("px-4 py-4", !isMobile && "px-6")}>
					<div className="flex items-center justify-between mb-4">
						<h1 className="text-2xl font-bold">Alerts & Requests</h1>
						<div className="flex items-center gap-2">
							<Badge variant="secondary" className="text-xs">
								{filteredNotifications.length} of {notifications.length}
							</Badge>
						</div>
					</div>

					{/* Stats Row */}
					<div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
						<Card className="bg-gradient-to-br from-red-500/10 to-background">
							<CardContent className="p-3">
								<div className="flex items-center gap-2">
									<AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-500" />
									<div>
										<p className="text-xs text-muted-foreground">Unread Alerts</p>
										<p className="text-lg font-bold">{stats.unreadAlerts}</p>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card className="bg-gradient-to-br from-blue-500/10 to-background">
							<CardContent className="p-3">
								<div className="flex items-center gap-2">
									<ClipboardList className="h-4 w-4 text-blue-600 dark:text-blue-500" />
									<div>
										<p className="text-xs text-muted-foreground">Pending Requests</p>
										<p className="text-lg font-bold">{stats.pendingRequests}</p>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card className="bg-gradient-to-br from-orange-500/10 to-background">
							<CardContent className="p-3">
								<div className="flex items-center gap-2">
									<AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-500" />
									<div>
										<p className="text-xs text-muted-foreground">High Priority</p>
										<p className="text-lg font-bold">{stats.urgentCount + stats.highCount}</p>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card className="bg-gradient-to-br from-purple-500/10 to-background">
							<CardContent className="p-3">
								<div className="flex items-center gap-2">
									<Clock className="h-4 w-4 text-purple-600 dark:text-purple-500" />
									<div>
										<p className="text-xs text-muted-foreground">This Week</p>
										<p className="text-lg font-bold">{stats.thisWeekCount}</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Filters */}
					<div className="space-y-3">
						{/* Search */}
						<div className="relative">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search notifications..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-9"
							/>
						</div>

						{/* Category & Status Tabs */}
						<div className="flex items-center gap-2 overflow-x-auto">
							<Tabs value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as NotificationCategory | "all")} className="flex-1">
								<TabsList className={cn("w-full grid", isMobile ? "grid-cols-3" : "grid-cols-3")}>
									<TabsTrigger value="all" className="text-xs">
										All
									</TabsTrigger>
									<TabsTrigger value="alert" className="text-xs">
										<Bell className="h-3 w-3 mr-1" />
										Alerts
									</TabsTrigger>
									<TabsTrigger value="request" className="text-xs">
										<ClipboardList className="h-3 w-3 mr-1" />
										Requests
									</TabsTrigger>
								</TabsList>
							</Tabs>

							<Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as "all" | "active" | "completed")}>
								<TabsList>
									<TabsTrigger value="all" className="text-xs">
										All
									</TabsTrigger>
									<TabsTrigger value="active" className="text-xs">
										Active
									</TabsTrigger>
									<TabsTrigger value="completed" className="text-xs">
										Done
									</TabsTrigger>
								</TabsList>
							</Tabs>

							{activeFiltersCount > 0 && (
								<Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs px-2 flex-shrink-0">
									<X className="h-3 w-3" />
									<Badge variant="secondary" className="ml-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs">
										{activeFiltersCount}
									</Badge>
								</Button>
							)}
						</div>

						{/* Priority Filter Badges */}
						<div className="flex items-center gap-2 overflow-x-auto pb-1">
							<Button
								variant={priorityFilter === "all" ? "default" : "outline"}
								size="sm"
								onClick={() => setPriorityFilter("all")}
								className="text-xs flex-shrink-0"
							>
								All Priorities
							</Button>
							{(["urgent", "high", "medium", "low"] as PriorityLevel[]).map((priority) => {
								const colors = getPriorityColor(priority);
								const count = groupedByPriority[priority].length;
								if (count === 0) return null;

								return (
									<Button
										key={priority}
										variant={priorityFilter === priority ? "default" : "outline"}
										size="sm"
										onClick={() => setPriorityFilter(priority)}
										className={cn(
											"text-xs flex-shrink-0",
											priorityFilter === priority && colors.badge,
										)}
									>
										{priority.charAt(0).toUpperCase() + priority.slice(1)}
										<Badge variant="secondary" className="ml-1.5 h-4 px-1 text-xs">
											{count}
										</Badge>
									</Button>
								);
							})}
						</div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className={cn("px-4 pt-4 space-y-6", !isMobile && "px-6")}>
				{filteredNotifications.length === 0 ? (
					<Card>
						<CardContent className="pt-12 pb-12 text-center">
							<Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-20" />
							<p className="text-lg font-medium text-muted-foreground mb-2">No notifications found</p>
							<p className="text-sm text-muted-foreground mb-4">
								{activeFiltersCount > 0
									? "Try adjusting your filters"
									: "You're all caught up!"}
							</p>
							{activeFiltersCount > 0 && (
								<Button variant="outline" onClick={clearFilters}>
									Clear all filters
								</Button>
							)}
						</CardContent>
					</Card>
				) : (
					<>
						{/* Grouped by Priority */}
						{priorityGroups.map(({ priority, label, icon: Icon, color }) => {
							const items = groupedByPriority[priority];
							if (items.length === 0) return null;

							const priorityColors = getPriorityColor(priority);

							return (
								<div key={priority} className="space-y-2">
									<div className="flex items-center gap-2 mb-3">
										<Icon className={cn("h-5 w-5", color)} />
										<h2 className="text-lg font-semibold">{label}</h2>
										<Badge className={cn("ml-auto", priorityColors.badge)}>
											{items.length}
										</Badge>
									</div>

									<div className="space-y-2">
										{items.map((notification) => (
											<NotificationRouter
												key={notification.id}
												notification={notification}
												onClick={() => openDetail(notification.id)}
												isSelected={selectedNotificationId === notification.id}
												onAcknowledge={handleAcknowledge}
												onResolve={handleResolve}
												onApprove={handleApprove}
												onReject={handleReject}
											/>
										))}
									</div>
								</div>
							);
						})}
					</>
				)}
			</div>
		</div>
	);
}
