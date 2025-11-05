import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Review } from "@/features/core/types/types.reviews";

interface ReviewStatsBreakdownProps {
	reviews: Review[];
	averageRating: number;
}

export function ReviewStatsBreakdown({ reviews, averageRating }: ReviewStatsBreakdownProps) {
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
				<div className="space-y-4">
					{/* Overall Rating */}
					<div className="text-center pb-4 border-b border-border">
						<div className="text-5xl font-bold mb-2">{averageRating.toFixed(1)}</div>
						<div className="flex items-center justify-center gap-1 mb-2">
							{[...Array(5)].map((_, i) => (
								<Star
									key={i}
									className={cn(
										"h-4 w-4",
										i < Math.round(averageRating) ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground/30"
									)}
								/>
							))}
						</div>
						<p className="text-sm text-muted-foreground">Based on {totalReviews} reviews</p>
					</div>

					{/* Star Breakdown */}
					<div className="space-y-2">
						{breakdown.map(({ stars, count, percentage }) => (
							<div key={stars} className="flex items-center gap-3">
								<div className="flex items-center gap-1 w-12 flex-shrink-0">
									<span className="text-xs font-medium">{stars}</span>
									<Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
								</div>
								<div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
									<div
										className="h-full bg-yellow-500 rounded-full transition-all duration-300"
										style={{ width: `${percentage}%` }}
									/>
								</div>
								<span className="text-xs text-muted-foreground w-12 text-right">{count}</span>
							</div>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
