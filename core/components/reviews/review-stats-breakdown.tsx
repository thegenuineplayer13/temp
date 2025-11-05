import { Star, MessageSquare, TrendingUp, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Review } from "@/features/core/types/types.reviews";

interface ReviewStatsBreakdownProps {
	reviews: Review[];
	averageRating: number;
	responseRate: number;
	unreadCount: number;
}

export function ReviewStatsBreakdown({ reviews, averageRating, responseRate, unreadCount }: ReviewStatsBreakdownProps) {
	// Calculate star distribution
	const starCounts = [0, 0, 0, 0, 0]; // Index 0 = 1 star, Index 4 = 5 stars
	reviews.forEach((review) => {
		if (review.rating >= 1 && review.rating <= 5) {
			starCounts[review.rating - 1]++;
		}
	});

	const totalReviews = reviews.length;

	// Generate breakdown data (5 to 1 stars)
	const breakdown = [5, 4, 3, 2, 1].map((stars) => {
		const count = starCounts[stars - 1];
		const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
		return { stars, count, percentage };
	});

	return (
		<Card>
			<CardContent className="pt-6 pb-6">
				<div className="space-y-5">
					{/* Hero Section - Rating */}
					<div className="text-center pb-4 border-b border-border">
						<div className="inline-flex items-baseline gap-2 mb-2">
							<div className="text-6xl font-bold">{averageRating.toFixed(1)}</div>
							<div className="text-2xl text-muted-foreground font-medium">/5</div>
						</div>
						<div className="flex items-center justify-center gap-1 mb-2">
							{[...Array(5)].map((_, i) => (
								<Star
									key={i}
									className={cn("h-5 w-5", i < Math.round(averageRating) ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground/20")}
								/>
							))}
						</div>
						<p className="text-sm text-muted-foreground font-medium">Based on {totalReviews} reviews</p>
					</div>

					{/* Quick Metrics Row */}
					<div className="grid grid-cols-2 gap-3">
						<div className="rounded-lg border p-3">
							<div className="flex items-center gap-2 mb-1">
								<CheckCircle2 className="h-3.5 w-3.5 text-primary" />
								<span className="text-xs font-medium text-muted-foreground">Response Rate</span>
							</div>
							<div className="flex items-baseline gap-1">
								<span className="text-2xl font-bold">{responseRate.toFixed(0)}</span>
								<span className="text-sm text-muted-foreground">%</span>
							</div>
						</div>

						<div className="rounded-lg border p-3">
							<div className="flex items-center gap-2 mb-1">
								<MessageSquare className="h-3.5 w-3.5 text-primary" />
								<span className="text-xs font-medium text-muted-foreground">Unread</span>
							</div>
							<div>
								<span className="text-2xl font-bold">{unreadCount}</span>
							</div>
						</div>
					</div>

					{/* Star Distribution */}
					<div className="space-y-2.5">
						<div className="flex items-center gap-2 mb-1">
							<TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
							<span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Rating Distribution</span>
						</div>
						{breakdown.map(({ stars, count, percentage }) => (
							<div key={stars} className="flex items-center gap-3">
								<div className="flex items-center gap-1 w-14 flex-shrink-0">
									<span className="text-xs font-semibold w-3">{stars}</span>
									<Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
								</div>
								<div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
									<div className="h-full bg-yellow-500 rounded-full transition-all duration-300" style={{ width: `${percentage}%` }} />
								</div>
								<div className="flex items-center gap-2 w-20 justify-end flex-shrink-0">
									<span className="text-xs font-semibold">{count}</span>
									<span className="text-xs text-muted-foreground">({percentage.toFixed(0)}%)</span>
								</div>
							</div>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
