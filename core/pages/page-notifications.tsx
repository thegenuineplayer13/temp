import * as React from "react";
import { useDocumentTitle } from "@/hooks/use-route";
import { useIsMobile } from "@/hooks/use-mobile";
import {
	ResizablePanelGroup,
	ResizablePanel,
	ResizableHandle,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Search, Filter, Bell, ClipboardList } from "lucide-react";
import { NotificationsList } from "@/features/core/components/notifications/notifications-list";
import { NotificationsDetail } from "@/features/core/components/notifications/notifications-detail";
import {
	useNotifications,
	useAcknowledgeAlert,
	useResolveAlert,
	useApproveRequest,
	useRejectRequest,
} from "@/features/core/hooks/queries/queries.notifications";
import type { NotificationCategory, PriorityLevel } from "@/features/core/types/types.notifications";

export default function NotificationsPage() {
	useDocumentTitle("Alerts & Requests");
	const isMobile = useIsMobile();
	const { data: notifications = [] } = useNotifications();
	const [selectedNotificationId, setSelectedNotificationId] = React.useState<string | null>(
		notifications[0]?.id || null,
	);
	const [categoryFilter, setCategoryFilter] = React.useState<NotificationCategory | "all">("all");
	const [statusFilter, setStatusFilter] = React.useState<"all" | "active" | "completed">("active");
	const [priorityFilter, setPriorityFilter] = React.useState<PriorityLevel | "all">("all");
	const [searchQuery, setSearchQuery] = React.useState("");
	const [showDetail, setShowDetail] = React.useState(false);

	const acknowledgeMutation = useAcknowledgeAlert();
	const resolveMutation = useResolveAlert();
	const approveMutation = useApproveRequest();
	const rejectMutation = useRejectRequest();

	const selectedNotification =
		notifications.find((n) => n.id === selectedNotificationId) || null;

	// Set initial selected notification when data loads
	React.useEffect(() => {
		if (!selectedNotificationId && notifications.length > 0) {
			setSelectedNotificationId(notifications[0].id);
		}
	}, [notifications, selectedNotificationId]);

	const filteredNotifications = notifications.filter((notification) => {
		// Category filter
		if (categoryFilter !== "all" && notification.category !== categoryFilter) {
			return false;
		}

		// Status filter
		if (statusFilter === "active") {
			if (notification.category === "alert") {
				if (notification.status === "resolved") return false;
			} else {
				if (notification.status !== "pending") return false;
			}
		} else if (statusFilter === "completed") {
			if (notification.category === "alert") {
				if (notification.status !== "resolved") return false;
			} else {
				if (notification.status === "pending") return false;
			}
		}

		// Priority filter
		if (priorityFilter !== "all" && notification.priority !== priorityFilter) {
			return false;
		}

		// Search filter
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			return (
				notification.title.toLowerCase().includes(query) ||
				notification.description.toLowerCase().includes(query) ||
				(notification.createdBy?.name &&
					notification.createdBy.name.toLowerCase().includes(query))
			);
		}

		return true;
	});

	const handleSelectNotification = (notificationId: string) => {
		setSelectedNotificationId(notificationId);
		if (isMobile) {
			setShowDetail(true);
		}
	};

	const handleBackToList = () => {
		setShowDetail(false);
	};

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

	if (isMobile) {
		return (
			<div className="min-h-screen flex flex-col bg-background">
				{/* Mobile Header */}
				{!showDetail ? (
					<>
						<div className="sticky top-0 z-10 bg-background border-b">
							<div className="p-4 space-y-4">
								<div className="flex items-center justify-between">
									<h1 className="text-2xl font-bold">Alerts & Requests</h1>
									<Button variant="ghost" size="icon">
										<Filter className="h-5 w-5" />
									</Button>
								</div>

								<div className="relative">
									<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
									<Input
										placeholder="Search notifications..."
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="pl-9"
									/>
								</div>

								{/* Category Filter */}
								<Tabs
									value={categoryFilter}
									onValueChange={(v) => setCategoryFilter(v as any)}
								>
									<TabsList className="w-full">
										<TabsTrigger value="all" className="flex-1">
											All
										</TabsTrigger>
										<TabsTrigger value="alert" className="flex-1">
											<Bell className="h-3 w-3 mr-1" />
											Alerts
										</TabsTrigger>
										<TabsTrigger value="request" className="flex-1">
											<ClipboardList className="h-3 w-3 mr-1" />
											Requests
										</TabsTrigger>
									</TabsList>
								</Tabs>

								{/* Status Filter */}
								<Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
									<TabsList className="w-full">
										<TabsTrigger value="all" className="flex-1">
											All
										</TabsTrigger>
										<TabsTrigger value="active" className="flex-1">
											Active
										</TabsTrigger>
										<TabsTrigger value="completed" className="flex-1">
											Done
										</TabsTrigger>
									</TabsList>
								</Tabs>
							</div>
						</div>

						<div className="flex-1 overflow-hidden">
							<NotificationsList
								notifications={filteredNotifications}
								selectedNotificationId={selectedNotificationId}
								onSelectNotification={handleSelectNotification}
							/>
						</div>
					</>
				) : (
					<>
						<div className="sticky top-0 z-10 bg-background border-b">
							<div className="p-4 flex items-center gap-3">
								<Button variant="ghost" size="icon" onClick={handleBackToList}>
									<ArrowLeft className="h-5 w-5" />
								</Button>
								<h2 className="font-semibold">Notification Details</h2>
							</div>
						</div>
						<div className="flex-1 overflow-hidden">
							<NotificationsDetail
								notification={selectedNotification}
								onAcknowledge={handleAcknowledge}
								onResolve={handleResolve}
								onApprove={handleApprove}
								onReject={handleReject}
							/>
						</div>
					</>
				)}
			</div>
		);
	}

	// Desktop Layout
	return (
		<div className="h-full flex flex-col bg-background">
			{/* Desktop Header */}
			<div className="border-b">
				<div className="p-6 space-y-4">
					<div className="flex items-center justify-between">
						<h1 className="text-3xl font-bold">Alerts & Requests</h1>
						<Button variant="ghost" size="icon">
							<Filter className="h-5 w-5" />
						</Button>
					</div>

					<div className="flex items-center gap-4">
						<div className="relative flex-1 max-w-md">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search notifications..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-9"
							/>
						</div>

						{/* Category Filter */}
						<Tabs value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as any)}>
							<TabsList>
								<TabsTrigger value="all">All</TabsTrigger>
								<TabsTrigger value="alert">
									<Bell className="h-4 w-4 mr-2" />
									Alerts
								</TabsTrigger>
								<TabsTrigger value="request">
									<ClipboardList className="h-4 w-4 mr-2" />
									Requests
								</TabsTrigger>
							</TabsList>
						</Tabs>

						{/* Status Filter */}
						<Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
							<TabsList>
								<TabsTrigger value="all">All</TabsTrigger>
								<TabsTrigger value="active">Active</TabsTrigger>
								<TabsTrigger value="completed">Done</TabsTrigger>
							</TabsList>
						</Tabs>
					</div>
				</div>
			</div>

			{/* Desktop Master-Detail Layout */}
			<div className="flex-1 overflow-hidden">
				<ResizablePanelGroup direction="horizontal">
					<ResizablePanel defaultSize={35} minSize={25} maxSize={50}>
						<NotificationsList
							notifications={filteredNotifications}
							selectedNotificationId={selectedNotificationId}
							onSelectNotification={handleSelectNotification}
						/>
					</ResizablePanel>

					<ResizableHandle withHandle />

					<ResizablePanel defaultSize={65}>
						<NotificationsDetail
							notification={selectedNotification}
							onAcknowledge={handleAcknowledge}
							onResolve={handleResolve}
							onApprove={handleApprove}
							onReject={handleReject}
						/>
					</ResizablePanel>
				</ResizablePanelGroup>
			</div>
		</div>
	);
}
