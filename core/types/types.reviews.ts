import type z from "zod";
import type {
	customerTypeSchema,
	readStatusSchema,
	sentimentSchema,
	reviewSchema,
	reviewStatsSchema,
	ratingDistributionSchema,
} from "../schemas/schemas.reviews";

export type CustomerType = z.infer<typeof customerTypeSchema>;
export type ReadStatus = z.infer<typeof readStatusSchema>;
export type Sentiment = z.infer<typeof sentimentSchema>;
export type Review = z.infer<typeof reviewSchema>;
export type ReviewStats = z.infer<typeof reviewStatsSchema>;
export type RatingDistribution = z.infer<typeof ratingDistributionSchema>;
