import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, User, UserCheck, ChevronDown, ChevronUp, MessageSquare, Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Review } from "@/features/core/types/types.reviews";

interface ReviewCardProps {
	review: Review;
	onToggleRead?: (id: string) => void;
	onRespond?: (review: Review) => void;
}

const CHARACTER_LIMIT = 150;

export function ReviewCard({ review, onToggleRead, onRespond }: ReviewCardProps) {
	const isMobile = useIsMobile();
	const [isCommentExpanded, setIsCommentExpanded] = useState(false);
	const [isResponseExpanded, setIsResponseExpanded] = useState(false);

	const commentNeedsExpansion = review.comment.length > CHARACTER_LIMIT;
	const displayComment =
		commentNeedsExpansion && !isCommentExpanded ? review.comment.slice(0, CHARACTER_LIMIT) + "..." : review.comment;

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

	if (isMobile) {
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
						<p className="text-sm leading-relaxed text-foreground/90">{displayComment}</p>
						{commentNeedsExpansion && (
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setIsCommentExpanded(!isCommentExpanded)}
								className="h-auto py-1 px-2 text-xs"
							>
								{isCommentExpanded ? (
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

					{/* Actions */}
					<div className="flex items-center gap-2 mt-3">
						{!review.isRead && onToggleRead && (
							<Button variant="outline" size="sm" onClick={() => onToggleRead(review.id)} className="text-xs">
								Mark as read
							</Button>
						)}
						{!review.responded && onRespond && (
							<Button variant="default" size="sm" onClick={() => onRespond(review)} className="text-xs">
								Respond
							</Button>
						)}
					</div>

					{/* Response Section - Mobile (at bottom with divider) */}
					{review.responded && review.responseText && (
						<>
							<div className="border-t border-border mt-4 pt-3">
								<Button
									variant="ghost"
									size="sm"
									onClick={() => setIsResponseExpanded(!isResponseExpanded)}
									className="w-full justify-between h-auto py-2 px-2 text-xs"
								>
									<div className="flex items-center gap-2">
										<MessageSquare className="h-3 w-3 text-primary" />
										<span className="font-medium">Your response</span>
										<span className="text-muted-foreground">• {formatDate(review.responseDate!)}</span>
									</div>
									{isResponseExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
								</Button>

								{isResponseExpanded && (
									<div className="mt-2 bg-muted/50 rounded-lg p-3">
										<p className="text-sm text-foreground/90">{review.responseText}</p>
									</div>
								)}
							</div>
						</>
					)}
				</CardContent>
			</Card>
		);
	}

	// Desktop Layout - Single Line
	return (
		<Card
			className={cn(
				"relative overflow-hidden transition-all duration-200 hover:shadow-md",
				!review.isRead && "border-l-4 border-l-primary bg-primary/5"
			)}
		>
			<CardContent className="p-4">
				<div className="flex items-start gap-4">
					{/* Customer Icon */}
					<div className="flex-shrink-0">
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

					{/* Main Content */}
					<div className="flex-1 min-w-0 space-y-2">
						{/* First Row: Name, Rating, Date, Badges */}
						<div className="flex items-center justify-between gap-3">
							<div className="flex items-center gap-3 flex-1 min-w-0">
								<h3 className="font-semibold text-sm truncate">{review.customerName}</h3>
								<Badge variant="outline" className="text-xs flex-shrink-0">
									{review.customerType === "client" ? "Client" : "Walk-in"}
								</Badge>
								<div className="flex items-center gap-1">
									{[...Array(5)].map((_, i) => (
										<Star
											key={i}
											className={cn("h-3.5 w-3.5", i < review.rating ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground/30")}
										/>
									))}
								</div>
								<span className="text-xs text-muted-foreground flex-shrink-0">{formatDate(review.date)}</span>
							</div>

							<div className="flex items-center gap-2 flex-shrink-0">
								<Badge className={cn("text-xs", getSentimentColor(review.sentiment))}>{review.sentiment}</Badge>
								{!review.isRead && (
									<Badge variant="secondary" className="text-xs">
										New
									</Badge>
								)}
								{review.flagged && (
									<Badge variant="destructive" className="text-xs">
										<Flag className="h-3 w-3 mr-1" />
										Flagged
									</Badge>
								)}
							</div>
						</div>

						{/* Second Row: Service & Staff */}
						<div className="flex items-center gap-3 text-xs text-muted-foreground">
							<div>
								<span className="font-medium">Service:</span> {review.service}
							</div>
							<span>•</span>
							<div>
								<span className="font-medium">Staff:</span> {review.employee}
							</div>
						</div>

						{/* Third Row: Comment */}
						<div className="space-y-1">
							<p className="text-sm leading-relaxed text-foreground/90">{displayComment}</p>
							<div className="flex items-center gap-2">
								{commentNeedsExpansion && (
									<Button
										variant="ghost"
										size="sm"
										onClick={() => setIsCommentExpanded(!isCommentExpanded)}
										className="h-auto py-1 px-2 text-xs"
									>
										{isCommentExpanded ? (
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

								{/* Response Expand Button - Desktop */}
								{review.responded && review.responseText && (
									<Button
										variant="ghost"
										size="sm"
										onClick={() => setIsResponseExpanded(!isResponseExpanded)}
										className="h-auto py-1 px-2 text-xs"
									>
										<MessageSquare className="h-3 w-3 mr-1" />
										{isResponseExpanded ? "Hide response" : "Show your response"}
										{isResponseExpanded ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
									</Button>
								)}
							</div>
						</div>

						{/* Response Content - Desktop (expandable) */}
						{review.responded && review.responseText && isResponseExpanded && (
							<div className="bg-muted/50 rounded-lg p-3 mt-2">
								<div className="flex items-center gap-2 mb-2">
									<MessageSquare className="h-3 w-3 text-primary" />
									<p className="text-xs font-medium text-muted-foreground">Your response • {formatDate(review.responseDate!)}</p>
								</div>
								<p className="text-sm text-foreground/90">{review.responseText}</p>
							</div>
						)}

						{/* Actions */}
						<div className="flex items-center gap-2">
							{!review.isRead && onToggleRead && (
								<Button variant="outline" size="sm" onClick={() => onToggleRead(review.id)} className="text-xs">
									Mark as read
								</Button>
							)}
							{!review.responded && onRespond && (
								<Button variant="default" size="sm" onClick={() => onRespond(review)} className="text-xs">
									Respond
								</Button>
							)}
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
