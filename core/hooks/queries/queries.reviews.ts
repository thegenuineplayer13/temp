import { useQuery } from "@/mock/mock-react-query";
import { reviewSchema, reviewStatsSchema } from "@/features/core/schemas/schemas.reviews";
import type { Review, ReviewStats } from "@/features/core/types/types.reviews";
import { mockReviews, mockReviewStats } from "@/mock/mock-reviews";

export const QUERY_KEYS = {
	reviews: ["reviews"],
	stats: ["reviews", "stats"],
} satisfies Record<string, readonly string[]>;

export function useReviews() {
	return useQuery<Review[]>({
		queryKey: QUERY_KEYS.reviews,
		queryFn: () => {
			const validated = mockReviews.map((review) => reviewSchema.parse(review));
			return validated;
		},
	});
}

export function useReviewStats() {
	return useQuery<ReviewStats>({
		queryKey: QUERY_KEYS.stats,
		queryFn: () => {
			const validated = reviewStatsSchema.parse(mockReviewStats);
			return validated;
		},
	});
}
