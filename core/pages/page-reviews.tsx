import { useMemo, useState } from "react";
import { useDocumentTitle } from "@/hooks/use-route";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
	Star,
	MessageSquare,
	TrendingUp,
	TrendingDown,
	Mail,
	MailOpen,
	CalendarIcon,
	X,
	CheckCircle2,
	Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useReviews, useReviewStats } from "@/features/core/hooks/queries/queries.reviews";
import { useReviewsStore } from "@/features/core/store/store.reviews";
import { ReviewCard } from "@/features/core/components/reviews/review-card";
import { ResponseModal } from "@/features/core/components/reviews/response-modal";
import type { ReadStatus, Review } from "@/features/core/types/types.reviews";
import type { DateRange } from "react-day-picker";

export default function ReviewsPage() {
	useDocumentTitle("Reviews");
	const isMobile = useIsMobile();
	const { data: reviews = [] } = useReviews();
	const { data: stats } = useReviewStats();
	const {
		selectedDate,
		dateRange,
		readFilter,
		starFilter,
		setSelectedDate,
		setDateRange,
		setReadFilter,
		setStarFilter,
		clearFilters,
		responseModalOpen,
		reviewToRespond,
		openResponseModal,
		closeResponseModal,
	} = useReviewsStore();

	const [calendarOpen, setCalendarOpen] = useState(false);

	// Filter reviews based on selected filters
	const filteredReviews = useMemo(() => {
		let filtered = [...reviews];

		// Filter by single date
		if (selectedDate) {
			filtered = filtered.filter((review) => {
				const reviewDate = new Date(review.date);
				return (
					reviewDate.getFullYear() === selectedDate.getFullYear() &&
					reviewDate.getMonth() === selectedDate.getMonth() &&
					reviewDate.getDate() === selectedDate.getDate()
				);
			});
		}

		// Filter by date range
		if (dateRange?.from) {
			filtered = filtered.filter((review) => {
				const reviewDate = new Date(review.date);
				const fromDate = new Date(dateRange.from);
				fromDate.setHours(0, 0, 0, 0);

				if (dateRange.to) {
					const toDate = new Date(dateRange.to);
					toDate.setHours(23, 59, 59, 999);
					return reviewDate >= fromDate && reviewDate <= toDate;
				}

				return reviewDate >= fromDate;
			});
		}

		// Filter by read status
		if (readFilter === "read") {
			filtered = filtered.filter((review) => review.isRead);
		} else if (readFilter === "unread") {
			filtered = filtered.filter((review) => !review.isRead);
		}

		// Filter by star rating
		if (starFilter !== "all") {
			filtered = filtered.filter((review) => review.rating === starFilter);
		}

		// Sort by date (newest first)
		filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

		return filtered;
	}, [reviews, selectedDate, dateRange, readFilter, starFilter]);

	const handleToggleRead = (id: string) => {
		// In a real app, this would call an API to update the read status
		console.log("Toggle read status for review:", id);
	};

	const handleRespond = (review: Review) => {
		openResponseModal(review);
	};

	const handleSubmitResponse = (reviewId: string, response: string) => {
		// In a real app, this would call an API to submit the response
		console.log("Submit response for review:", reviewId, response);
	};

	const formatDateDisplay = (date: Date) => {
		return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
	};

	const formatDateRangeDisplay = (range: DateRange | undefined) => {
		if (!range?.from) return "Filter by date";
		if (!range.to) return formatDateDisplay(range.from);
		return `${formatDateDisplay(range.from)} - ${formatDateDisplay(range.to)}`;
	};

	const activeFiltersCount = [selectedDate, dateRange?.from, readFilter !== "all", starFilter !== "all"].filter(Boolean).length;

	if (!stats) return null;

	if (isMobile) {
		return (
			<div className="min-h-screen bg-background pb-4">
				{/* Sticky Header */}
				<div className="sticky top-0 z-20 bg-background border-b border-border">
					<div className="px-4 py-4">
						<h1 className="text-2xl font-bold text-foreground">Reviews</h1>
					</div>

					{/* Compact Stats Grid - Mobile (Only 2 stats) */}
					<div className="px-4 pb-4">
						<div className="grid grid-cols-2 gap-3">
							{/* Average Rating */}
							<Card className="bg-gradient-to-br from-yellow-500/10 to-background">
								<CardContent className="pt-3 pb-3">
									<div className="flex items-center gap-2">
										<div className="rounded-full bg-yellow-500/10 p-1.5 flex-shrink-0">
											<Star className="h-3.5 w-3.5 text-yellow-600 dark:text-yellow-500 fill-yellow-600" />
										</div>
										<div className="flex-1 min-w-0">
											<p className="text-xs font-medium text-muted-foreground mb-0.5">Avg Rating</p>
											<div className="flex items-baseline gap-1">
												<p className="text-xl font-bold">{stats.averageRating.toFixed(1)}</p>
												<span className="text-xs text-muted-foreground">/ 5.0</span>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>

							{/* Response Rate */}
							<Card className="bg-gradient-to-br from-green-500/10 to-background">
								<CardContent className="pt-3 pb-3">
									<div className="flex items-center gap-2">
										<div className="rounded-full bg-green-500/10 p-1.5 flex-shrink-0">
											<CheckCircle2 className="h-3.5 w-3.5 text-green-600 dark:text-green-500" />
										</div>
										<div className="flex-1 min-w-0">
											<p className="text-xs font-medium text-muted-foreground mb-0.5">Response</p>
											<div className="flex items-baseline gap-1">
												<p className="text-xl font-bold">{stats.responseRate.toFixed(0)}</p>
												<span className="text-xs text-muted-foreground">%</span>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>

					{/* Filters - Mobile */}
					<div className="px-4 pb-3 space-y-3">
						<div className="flex items-center gap-2">
							<Tabs value={readFilter} onValueChange={(v) => setReadFilter(v as ReadStatus | "all")} className="flex-1">
								<TabsList className="w-full grid grid-cols-3">
									<TabsTrigger value="all" className="text-xs">
										All
									</TabsTrigger>
									<TabsTrigger value="unread" className="text-xs">
										<Mail className="h-3 w-3 mr-1" />
										Unread
									</TabsTrigger>
									<TabsTrigger value="read" className="text-xs">
										<MailOpen className="h-3 w-3 mr-1" />
										Read
									</TabsTrigger>
								</TabsList>
							</Tabs>
						</div>

						<div className="flex items-center gap-2">
							{/* Date Filter */}
							<Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										size="sm"
										className={cn("flex-1 justify-start text-xs", (selectedDate || dateRange?.from) && "border-primary")}
									>
										<CalendarIcon className="h-3 w-3 mr-1" />
										{dateRange?.from ? formatDateRangeDisplay(dateRange) : selectedDate ? formatDateDisplay(selectedDate) : "Date"}
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0" align="start">
									<Calendar
										mode="range"
										selected={dateRange}
										onSelect={(range) => {
											setDateRange(range as any);
											if (range?.from && range?.to) {
												setCalendarOpen(false);
											}
										}}
										initialFocus
									/>
								</PopoverContent>
							</Popover>

							{/* Star Filter */}
							<Popover>
								<PopoverTrigger asChild>
									<Button variant="outline" size="sm" className={cn("flex-1 justify-start text-xs", starFilter !== "all" && "border-primary")}>
										<Star className="h-3 w-3 mr-1" />
										{starFilter === "all" ? "Stars" : `${starFilter} ★`}
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-40 p-2" align="start">
									<div className="space-y-1">
										<Button
											variant={starFilter === "all" ? "default" : "ghost"}
											size="sm"
											onClick={() => setStarFilter("all")}
											className="w-full justify-start text-xs"
										>
											All Ratings
										</Button>
										{[5, 4, 3, 2, 1].map((rating) => (
											<Button
												key={rating}
												variant={starFilter === rating ? "default" : "ghost"}
												size="sm"
												onClick={() => setStarFilter(rating)}
												className="w-full justify-start text-xs"
											>
												<div className="flex items-center gap-1">
													{[...Array(rating)].map((_, i) => (
														<Star key={i} className="h-3 w-3 fill-yellow-500 text-yellow-500" />
													))}
												</div>
											</Button>
										))}
									</div>
								</PopoverContent>
							</Popover>

							{activeFiltersCount > 0 && (
								<Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs px-2">
									<X className="h-3 w-3" />
									<Badge variant="secondary" className="ml-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs">
										{activeFiltersCount}
									</Badge>
								</Button>
							)}
						</div>
					</div>
				</div>

				{/* Reviews List */}
				<div className="px-4 pt-4 space-y-3">
					{filteredReviews.length === 0 ? (
						<Card>
							<CardContent className="pt-12 pb-12 text-center">
								<MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
								<p className="text-sm text-muted-foreground">No reviews found</p>
								{activeFiltersCount > 0 && (
									<Button variant="link" onClick={clearFilters} className="mt-2 text-xs">
										Clear filters
									</Button>
								)}
							</CardContent>
						</Card>
					) : (
						filteredReviews.map((review) => (
							<ReviewCard key={review.id} review={review} onToggleRead={handleToggleRead} onRespond={handleRespond} />
						))
					)}
				</div>

				{/* Response Modal */}
				<ResponseModal
					open={responseModalOpen}
					onOpenChange={closeResponseModal}
					review={reviewToRespond}
					onSubmit={handleSubmitResponse}
				/>
			</div>
		);
	}

	// Desktop Layout - Reviews List on Left, Sticky Stats on Right
	return (
		<div className="bg-background min-h-screen">
			{/* Sticky Header with Filters */}
			<div className="sticky top-0 z-20 bg-background border-b border-border">
				<div className="container mx-auto px-6 py-4">
					<div className="flex items-center justify-between mb-4">
						<h1 className="text-2xl font-bold">Customer Reviews</h1>
						<div className="flex items-center gap-2">
							{stats.monthlyTrend === "up" ? (
								<div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-500 bg-green-500/10 px-2.5 py-1 rounded-md">
									<TrendingUp className="h-4 w-4" />
									<span className="font-bold">{stats.monthlyPercentageChange}%</span>
									<span className="text-xs text-muted-foreground">vs last month</span>
								</div>
							) : stats.monthlyTrend === "down" ? (
								<div className="flex items-center gap-1 text-sm text-red-600 dark:text-red-500 bg-red-500/10 px-2.5 py-1 rounded-md">
									<TrendingDown className="h-4 w-4" />
									<span className="font-bold">{Math.abs(stats.monthlyPercentageChange)}%</span>
									<span className="text-xs text-muted-foreground">vs last month</span>
								</div>
							) : null}
						</div>
					</div>

					{/* Filters - Desktop */}
					<div className="flex items-center gap-3">
						<Tabs value={readFilter} onValueChange={(v) => setReadFilter(v as ReadStatus | "all")}>
							<TabsList>
								<TabsTrigger value="all">All Reviews</TabsTrigger>
								<TabsTrigger value="unread">
									<Mail className="h-4 w-4 mr-2" />
									Unread ({stats.unreadCount})
								</TabsTrigger>
								<TabsTrigger value="read">
									<MailOpen className="h-4 w-4 mr-2" />
									Read
								</TabsTrigger>
							</TabsList>
						</Tabs>

						{/* Date Range Filter */}
						<Popover>
							<PopoverTrigger asChild>
								<Button variant="outline" className={cn((selectedDate || dateRange?.from) && "border-primary bg-primary/5")}>
									<CalendarIcon className="h-4 w-4 mr-2" />
									{dateRange?.from ? formatDateRangeDisplay(dateRange) : selectedDate ? formatDateDisplay(selectedDate) : "Filter by date"}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0" align="start">
								<Calendar mode="range" selected={dateRange} onSelect={(range) => setDateRange(range as any)} initialFocus />
							</PopoverContent>
						</Popover>

						{/* Star Filter */}
						<Popover>
							<PopoverTrigger asChild>
								<Button variant="outline" className={cn(starFilter !== "all" && "border-primary bg-primary/5")}>
									<Star className="h-4 w-4 mr-2" />
									{starFilter === "all" ? "All Ratings" : `${starFilter} Stars`}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-48 p-2" align="start">
								<div className="space-y-1">
									<Button
										variant={starFilter === "all" ? "default" : "ghost"}
										size="sm"
										onClick={() => setStarFilter("all")}
										className="w-full justify-start"
									>
										All Ratings
									</Button>
									{[5, 4, 3, 2, 1].map((rating) => (
										<Button
											key={rating}
											variant={starFilter === rating ? "default" : "ghost"}
											size="sm"
											onClick={() => setStarFilter(rating)}
											className="w-full justify-start"
										>
											<div className="flex items-center gap-1">
												{[...Array(rating)].map((_, i) => (
													<Star key={i} className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
												))}
												<span className="ml-2 text-xs text-muted-foreground">({rating} stars)</span>
											</div>
										</Button>
									))}
								</div>
							</PopoverContent>
						</Popover>

						{activeFiltersCount > 0 && (
							<Button variant="outline" onClick={clearFilters}>
								<X className="h-4 w-4 mr-2" />
								Clear Filters
								<Badge variant="secondary" className="ml-2">
									{activeFiltersCount}
								</Badge>
							</Button>
						)}

						<div className="ml-auto text-sm text-muted-foreground">
							Showing <span className="font-semibold text-foreground">{filteredReviews.length}</span> of{" "}
							<span className="font-semibold text-foreground">{reviews.length}</span> reviews
						</div>
					</div>
				</div>
			</div>

			{/* Main Content Area - Desktop */}
			<div className="container mx-auto px-6 py-6">
				<div className="grid grid-cols-12 gap-6">
					{/* Reviews List - Left Side (8 columns) */}
					<div className="col-span-8 space-y-3">
						{filteredReviews.length === 0 ? (
							<Card>
								<CardContent className="pt-12 pb-12 text-center">
									<MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-20" />
									<p className="text-lg font-medium text-muted-foreground mb-2">No reviews found</p>
									<p className="text-sm text-muted-foreground mb-4">Try adjusting your filters to see more results</p>
									{activeFiltersCount > 0 && (
										<Button variant="outline" onClick={clearFilters}>
											Clear all filters
										</Button>
									)}
								</CardContent>
							</Card>
						) : (
							filteredReviews.map((review) => (
								<ReviewCard key={review.id} review={review} onToggleRead={handleToggleRead} onRespond={handleRespond} />
							))
						)}
					</div>

					{/* Stats Sidebar - Right Side (4 columns, sticky) */}
					<div className="col-span-4">
						<div className="sticky top-24 space-y-4">
							{/* Overview Card */}
							<Card>
								<CardContent className="pt-6 pb-6">
									<h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
										<Filter className="h-4 w-4 text-primary" />
										Overview
									</h3>

									<div className="space-y-4">
										{/* Average Rating */}
										<div>
											<div className="flex items-center justify-between mb-2">
												<span className="text-xs font-medium text-muted-foreground">Average Rating</span>
												<div className="flex items-baseline gap-1">
													<span className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</span>
													<span className="text-sm text-muted-foreground">/ 5.0</span>
												</div>
											</div>
											<div className="flex items-center gap-1">
												{[...Array(5)].map((_, i) => (
													<Star
														key={i}
														className={cn(
															"h-4 w-4",
															i < Math.round(stats.averageRating) ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground/30"
														)}
													/>
												))}
											</div>
										</div>

										<div className="h-px bg-border" />

										{/* Total Reviews */}
										<div className="flex items-center justify-between">
											<span className="text-xs font-medium text-muted-foreground">Total Reviews</span>
											<span className="text-xl font-bold">{stats.totalReviews}</span>
										</div>

										{/* Unread Count */}
										<div className="flex items-center justify-between">
											<span className="text-xs font-medium text-muted-foreground">Unread</span>
											<Badge variant="secondary" className="text-sm font-bold">
												{stats.unreadCount}
											</Badge>
										</div>

										{/* Response Rate */}
										<div className="flex items-center justify-between">
											<span className="text-xs font-medium text-muted-foreground">Response Rate</span>
											<div className="flex items-baseline gap-1">
												<span className="text-xl font-bold">{stats.responseRate.toFixed(0)}</span>
												<span className="text-sm text-muted-foreground">%</span>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>

							{/* Sentiment Distribution */}
							<Card>
								<CardContent className="pt-6 pb-6">
									<h3 className="font-semibold text-sm mb-4">Sentiment</h3>

									<div className="space-y-3">
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												<div className="w-3 h-3 rounded-full bg-green-500" />
												<span className="text-xs font-medium text-muted-foreground">Positive</span>
											</div>
											<div className="flex items-center gap-2">
												<span className="text-sm font-bold">{stats.positiveCount}</span>
												<span className="text-xs text-muted-foreground">
													({((stats.positiveCount / stats.totalReviews) * 100).toFixed(0)}%)
												</span>
											</div>
										</div>

										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												<div className="w-3 h-3 rounded-full bg-yellow-500" />
												<span className="text-xs font-medium text-muted-foreground">Neutral</span>
											</div>
											<div className="flex items-center gap-2">
												<span className="text-sm font-bold">{stats.neutralCount}</span>
												<span className="text-xs text-muted-foreground">
													({((stats.neutralCount / stats.totalReviews) * 100).toFixed(0)}%)
												</span>
											</div>
										</div>

										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												<div className="w-3 h-3 rounded-full bg-red-500" />
												<span className="text-xs font-medium text-muted-foreground">Negative</span>
											</div>
											<div className="flex items-center gap-2">
												<span className="text-sm font-bold">{stats.negativeCount}</span>
												<span className="text-xs text-muted-foreground">
													({((stats.negativeCount / stats.totalReviews) * 100).toFixed(0)}%)
												</span>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>

							{/* Monthly Trend */}
							<Card>
								<CardContent className="pt-6 pb-6">
									<h3 className="font-semibold text-sm mb-4">This Month</h3>

									<div className="space-y-3">
										<div className="flex items-center justify-between">
											<span className="text-xs font-medium text-muted-foreground">Reviews</span>
											<span className="text-xl font-bold">{stats.thisMonthCount}</span>
										</div>

										<div className="flex items-center justify-between">
											<span className="text-xs font-medium text-muted-foreground">vs Last Month</span>
											{stats.monthlyTrend === "up" ? (
												<div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-500 bg-green-500/10 px-2 py-0.5 rounded">
													<TrendingUp className="h-3 w-3" />
													<span className="font-bold">+{stats.monthlyPercentageChange}%</span>
												</div>
											) : stats.monthlyTrend === "down" ? (
												<div className="flex items-center gap-1 text-sm text-red-600 dark:text-red-500 bg-red-500/10 px-2 py-0.5 rounded">
													<TrendingDown className="h-3 w-3" />
													<span className="font-bold">{stats.monthlyPercentageChange}%</span>
												</div>
											) : (
												<span className="text-sm text-muted-foreground">No change</span>
											)}
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</div>

			{/* Response Modal */}
			<ResponseModal open={responseModalOpen} onOpenChange={closeResponseModal} review={reviewToRespond} onSubmit={handleSubmitResponse} />
		</div>
	);
}
