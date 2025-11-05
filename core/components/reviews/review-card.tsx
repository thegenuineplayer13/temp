import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, User, UserCheck, ChevronDown, ChevronUp, MessageSquare, Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Review } from "@/features/core/types/types.reviews";

interface ReviewCardProps {
	review: Review;
	onToggleRead?: (id: string) => void;
}

const CHARACTER_LIMIT = 150;

export function ReviewCard({ review, onToggleRead }: ReviewCardProps) {
	const [isExpanded, setIsExpanded] = useState(false);
	const needsExpansion = review.comment.length > CHARACTER_LIMIT;
	const displayText = needsExpansion && !isExpanded ? review.comment.slice(0, CHARACTER_LIMIT) + "..." : review.comment;

	const getSentimentColor = (sentiment: string) => {
		switch (sentiment) {
			case "positive":
				return "bg-green-500/10 text-green-600 dark:text-green-500 border-green-500/20";
			case "negative":
				return "bg-red-500/10 text-red-600 dark:text-red-500 border-red-500/20";
			default:
				return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border-yellow-500/20";
		}
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffTime = Math.abs(now.getTime() - date.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays === 0) return "Today";
		if (diffDays === 1) return "Yesterday";
		if (diffDays < 7) return `${diffDays} days ago`;

		return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
	};

	return (
		<Card
			className={cn(
				"relative overflow-hidden transition-all duration-200",
				!review.isRead && "border-l-4 border-l-primary bg-primary/5"
			)}
		>
			<CardContent className="p-4">
				{/* Header */}
				<div className="flex items-start justify-between gap-3 mb-3">
					<div className="flex items-start gap-3 flex-1 min-w-0">
						<div className="flex-shrink-0 mt-1">
							{review.customerType === "client" ? (
								<div className="rounded-full bg-primary/10 p-2">
									<UserCheck className="h-4 w-4 text-primary" />
								</div>
							) : (
								<div className="rounded-full bg-muted p-2">
									<User className="h-4 w-4 text-muted-foreground" />
								</div>
							)}
						</div>

						<div className="flex-1 min-w-0">
							<div className="flex items-center gap-2 flex-wrap">
								<h3 className="font-semibold text-sm truncate">{review.customerName}</h3>
								<Badge variant="outline" className="text-xs">
									{review.customerType === "client" ? "Client" : "Walk-in"}
								</Badge>
								{review.flagged && (
									<Badge variant="destructive" className="text-xs">
										<Flag className="h-3 w-3 mr-1" />
										Flagged
									</Badge>
								)}
							</div>

							<div className="flex items-center gap-2 mt-1">
								<div className="flex items-center">
									{[...Array(5)].map((_, i) => (
										<Star
											key={i}
											className={cn("h-3.5 w-3.5", i < review.rating ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground/30")}
										/>
									))}
								</div>
								<span className="text-xs text-muted-foreground">•</span>
								<span className="text-xs text-muted-foreground">{formatDate(review.date)}</span>
							</div>
						</div>
					</div>

					<div className="flex flex-col items-end gap-1.5 flex-shrink-0">
						<Badge className={cn("text-xs", getSentimentColor(review.sentiment))}>{review.sentiment}</Badge>
						{!review.isRead && (
							<Badge variant="secondary" className="text-xs">
								New
							</Badge>
						)}
					</div>
				</div>

				{/* Service & Employee Info */}
				<div className="flex flex-wrap gap-2 mb-3">
					<div className="text-xs text-muted-foreground">
						<span className="font-medium">Service:</span> {review.service}
					</div>
					<span className="text-xs text-muted-foreground">•</span>
					<div className="text-xs text-muted-foreground">
						<span className="font-medium">Staff:</span> {review.employee}
					</div>
				</div>

				{/* Review Comment */}
				<div className="space-y-2">
					<p className="text-sm leading-relaxed text-foreground/90">{displayText}</p>
					{needsExpansion && (
						<Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="h-auto py-1 px-2 text-xs">
							{isExpanded ? (
								<>
									<ChevronUp className="h-3 w-3 mr-1" />
									Show less
								</>
							) : (
								<>
									<ChevronDown className="h-3 w-3 mr-1" />
									Read more
								</>
							)}
						</Button>
					)}
				</div>

				{/* Response */}
				{review.responded && review.responseText && (
					<div className="mt-3 pt-3 border-t border-border">
						<div className="flex items-start gap-2 bg-muted/50 rounded-lg p-3">
							<MessageSquare className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
							<div className="flex-1 min-w-0">
								<p className="text-xs font-medium text-muted-foreground mb-1">Your response • {formatDate(review.responseDate!)}</p>
								<p className="text-sm text-foreground/90">{review.responseText}</p>
							</div>
						</div>
					</div>
				)}

				{/* Actions */}
				<div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
					{!review.isRead && onToggleRead && (
						<Button variant="outline" size="sm" onClick={() => onToggleRead(review.id)} className="text-xs">
							Mark as read
						</Button>
					)}
					{!review.responded && (
						<Button variant="default" size="sm" className="text-xs">
							Respond
						</Button>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
