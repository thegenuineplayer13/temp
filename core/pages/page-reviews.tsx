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
	ThumbsUp,
	Meh,
	ThumbsDown,
	Mail,
	MailOpen,
	CalendarIcon,
	X,
	CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useReviews, useReviewStats } from "@/features/core/hooks/queries/queries.reviews";
import { useReviewsStore } from "@/features/core/store/store.reviews";
import { ReviewCard } from "@/features/core/components/reviews/review-card";
import type { ReadStatus } from "@/features/core/types/types.reviews";

export default function ReviewsPage() {
	useDocumentTitle("Reviews");
	const isMobile = useIsMobile();
	const { data: reviews = [] } = useReviews();
	const { data: stats } = useReviewStats();
	const { selectedDate, readFilter, setSelectedDate, setReadFilter, clearFilters } = useReviewsStore();

	const [calendarOpen, setCalendarOpen] = useState(false);

	// Filter reviews based on selected filters
	const filteredReviews = useMemo(() => {
		let filtered = [...reviews];

		// Filter by date
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

		// Filter by read status
		if (readFilter === "read") {
			filtered = filtered.filter((review) => review.isRead);
		} else if (readFilter === "unread") {
			filtered = filtered.filter((review) => !review.isRead);
		}

		// Sort by date (newest first)
		filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

		return filtered;
	}, [reviews, selectedDate, readFilter]);

	const handleToggleRead = (id: string) => {
		// In a real app, this would call an API to update the read status
		console.log("Toggle read status for review:", id);
	};

	const formatDateDisplay = (date: Date) => {
		return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
	};

	const activeFiltersCount = [selectedDate, readFilter !== "all"].filter(Boolean).length;

	if (!stats) return null;

	if (isMobile) {
		return (
			<div className="min-h-screen bg-background pb-4">
				{/* Sticky Header */}
				<div className="sticky top-0 z-20 bg-background border-b border-border">
					<div className="px-4 py-4">
						<h1 className="text-2xl font-bold text-foreground">Reviews</h1>
					</div>

					{/* Stats Grid - Mobile */}
					<div className="px-4 pb-4">
						<div className="grid grid-cols-2 gap-3 mb-4">
							{/* Average Rating */}
							<Card className="bg-gradient-to-br from-yellow-500/10 to-background">
								<CardContent className="pt-4 pb-4">
									<div className="rounded-full bg-yellow-500/10 p-2 w-fit mb-2">
										<Star className="h-4 w-4 text-yellow-600 dark:text-yellow-500 fill-yellow-600" />
									</div>
									<p className="text-xs font-medium text-muted-foreground mb-1">Avg Rating</p>
									<div className="flex items-baseline gap-1">
										<p className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</p>
										<span className="text-sm text-muted-foreground">/ 5.0</span>
									</div>
								</CardContent>
							</Card>

							{/* Total Reviews */}
							<Card className="bg-gradient-to-br from-primary/10 to-background">
								<CardContent className="pt-4 pb-4">
									<div className="rounded-full bg-primary/10 p-2 w-fit mb-2">
										<MessageSquare className="h-4 w-4 text-primary" />
									</div>
									<p className="text-xs font-medium text-muted-foreground mb-1">Total Reviews</p>
									<p className="text-2xl font-bold">{stats.totalReviews}</p>
								</CardContent>
							</Card>

							{/* Unread */}
							<Card className="bg-gradient-to-br from-blue-500/10 to-background">
								<CardContent className="pt-4 pb-4">
									<div className="rounded-full bg-blue-500/10 p-2 w-fit mb-2">
										<Mail className="h-4 w-4 text-blue-600 dark:text-blue-500" />
									</div>
									<p className="text-xs font-medium text-muted-foreground mb-1">Unread</p>
									<p className="text-2xl font-bold">{stats.unreadCount}</p>
								</CardContent>
							</Card>

							{/* Response Rate */}
							<Card className="bg-gradient-to-br from-green-500/10 to-background">
								<CardContent className="pt-4 pb-4">
									<div className="rounded-full bg-green-500/10 p-2 w-fit mb-2">
										<CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
									</div>
									<p className="text-xs font-medium text-muted-foreground mb-1">Response Rate</p>
									<div className="flex items-baseline gap-1">
										<p className="text-2xl font-bold">{stats.responseRate.toFixed(0)}</p>
										<span className="text-sm text-muted-foreground">%</span>
									</div>
								</CardContent>
							</Card>
						</div>

						{/* Sentiment Distribution - Mobile */}
						<Card>
							<CardContent className="pt-4 pb-4">
								<div className="flex items-center justify-around">
									<div className="text-center">
										<div className="flex items-center justify-center mb-1">
											<ThumbsUp className="h-4 w-4 text-green-600 dark:text-green-500" />
										</div>
										<p className="text-xl font-bold">{stats.positiveCount}</p>
										<p className="text-xs text-muted-foreground">Positive</p>
									</div>
									<div className="h-12 w-px bg-border" />
									<div className="text-center">
										<div className="flex items-center justify-center mb-1">
											<Meh className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
										</div>
										<p className="text-xl font-bold">{stats.neutralCount}</p>
										<p className="text-xs text-muted-foreground">Neutral</p>
									</div>
									<div className="h-12 w-px bg-border" />
									<div className="text-center">
										<div className="flex items-center justify-center mb-1">
											<ThumbsDown className="h-4 w-4 text-red-600 dark:text-red-500" />
										</div>
										<p className="text-xl font-bold">{stats.negativeCount}</p>
										<p className="text-xs text-muted-foreground">Negative</p>
									</div>
								</div>
							</CardContent>
						</Card>
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
							<Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
								<PopoverTrigger asChild>
									<Button variant="outline" size="sm" className={cn("flex-1 justify-start text-xs", selectedDate && "border-primary")}>
										<CalendarIcon className="h-3 w-3 mr-1" />
										{selectedDate ? formatDateDisplay(selectedDate) : "Filter by date"}
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0" align="start">
									<Calendar
										mode="single"
										selected={selectedDate || undefined}
										onSelect={(date) => {
											setSelectedDate(date || null);
											setCalendarOpen(false);
										}}
										initialFocus
									/>
								</PopoverContent>
							</Popover>

							{activeFiltersCount > 0 && (
								<Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
									<X className="h-3 w-3 mr-1" />
									Clear
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
						filteredReviews.map((review) => <ReviewCard key={review.id} review={review} onToggleRead={handleToggleRead} />)
					)}
				</div>
			</div>
		);
	}

	// Desktop Layout
	return (
		<div className="bg-background min-h-screen">
			{/* Sticky Header */}
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

					{/* Stats Grid - Desktop */}
					<div className="grid grid-cols-6 border border-border rounded-xl overflow-hidden divide-x divide-border bg-card/50 mb-4">
						{/* Average Rating */}
						<div className="relative group p-4 hover:bg-yellow-500/5 transition-colors duration-300">
							<div className="flex items-center gap-3">
								<div className="flex-shrink-0 rounded-xl bg-yellow-500/10 p-3 group-hover:scale-110 transition-transform duration-300">
									<Star className="h-5 w-5 text-yellow-600 dark:text-yellow-500 fill-yellow-600" />
								</div>
								<div className="space-y-1">
									<p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Average Rating</p>
									<div className="flex items-baseline gap-2">
										<p className="text-2xl font-bold tracking-tight">{stats.averageRating.toFixed(1)}</p>
										<span className="text-sm font-semibold text-muted-foreground">/ 5.0</span>
									</div>
								</div>
							</div>
						</div>

						{/* Total Reviews */}
						<div className="relative group p-4 hover:bg-primary/5 transition-colors duration-300">
							<div className="flex items-center gap-3">
								<div className="flex-shrink-0 rounded-xl bg-primary/10 p-3 group-hover:scale-110 transition-transform duration-300">
									<MessageSquare className="h-5 w-5 text-primary" />
								</div>
								<div className="space-y-1">
									<p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Reviews</p>
									<p className="text-2xl font-bold tracking-tight">{stats.totalReviews}</p>
								</div>
							</div>
						</div>

						{/* Positive */}
						<div className="relative group p-4 hover:bg-green-500/5 transition-colors duration-300">
							<div className="flex items-center gap-3">
								<div className="flex-shrink-0 rounded-xl bg-green-500/10 p-3 group-hover:scale-110 transition-transform duration-300">
									<ThumbsUp className="h-5 w-5 text-green-600 dark:text-green-500" />
								</div>
								<div className="space-y-1">
									<p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Positive</p>
									<p className="text-2xl font-bold tracking-tight">{stats.positiveCount}</p>
								</div>
							</div>
						</div>

						{/* Neutral */}
						<div className="relative group p-4 hover:bg-yellow-500/5 transition-colors duration-300">
							<div className="flex items-center gap-3">
								<div className="flex-shrink-0 rounded-xl bg-yellow-500/10 p-3 group-hover:scale-110 transition-transform duration-300">
									<Meh className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
								</div>
								<div className="space-y-1">
									<p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Neutral</p>
									<p className="text-2xl font-bold tracking-tight">{stats.neutralCount}</p>
								</div>
							</div>
						</div>

						{/* Negative */}
						<div className="relative group p-4 hover:bg-red-500/5 transition-colors duration-300">
							<div className="flex items-center gap-3">
								<div className="flex-shrink-0 rounded-xl bg-red-500/10 p-3 group-hover:scale-110 transition-transform duration-300">
									<ThumbsDown className="h-5 w-5 text-red-600 dark:text-red-500" />
								</div>
								<div className="space-y-1">
									<p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Negative</p>
									<p className="text-2xl font-bold tracking-tight">{stats.negativeCount}</p>
								</div>
							</div>
						</div>

						{/* Response Rate */}
						<div className="relative group p-4 hover:bg-blue-500/5 transition-colors duration-300">
							<div className="flex items-center gap-3">
								<div className="flex-shrink-0 rounded-xl bg-blue-500/10 p-3 group-hover:scale-110 transition-transform duration-300">
									<CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-500" />
								</div>
								<div className="space-y-1">
									<p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Response Rate</p>
									<div className="flex items-baseline gap-1">
										<p className="text-2xl font-bold tracking-tight">{stats.responseRate.toFixed(0)}</p>
										<span className="text-sm text-muted-foreground">%</span>
									</div>
								</div>
							</div>
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

						<Popover>
							<PopoverTrigger asChild>
								<Button variant="outline" className={cn(selectedDate && "border-primary bg-primary/5")}>
									<CalendarIcon className="h-4 w-4 mr-2" />
									{selectedDate ? formatDateDisplay(selectedDate) : "Filter by date"}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0" align="start">
								<Calendar mode="single" selected={selectedDate || undefined} onSelect={(date) => setSelectedDate(date || null)} initialFocus />
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

			{/* Reviews List - Desktop */}
			<div className="container mx-auto px-6 py-6">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
					{filteredReviews.length === 0 ? (
						<div className="col-span-full">
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
						</div>
					) : (
						filteredReviews.map((review) => <ReviewCard key={review.id} review={review} onToggleRead={handleToggleRead} />)
					)}
				</div>
			</div>
		</div>
	);
}
