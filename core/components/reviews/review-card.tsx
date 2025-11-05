import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, User, UserCheck, ChevronDown, ChevronUp, MessageSquare, Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Review } from "@/features/core/types/types.reviews";

interface ReviewCardProps {
	review: Review;
	onToggleRead?: (id: string) => void;
	onRespond?: (review: Review) => void;
}

const CHARACTER_LIMIT = 100;

export function ReviewCard({ review, onToggleRead, onRespond }: ReviewCardProps) {
	const isMobile = useIsMobile();
	const [isCommentExpanded, setIsCommentExpanded] = useState(false);
	const [isResponseExpanded, setIsResponseExpanded] = useState(false);

	const commentNeedsExpansion = review.comment.length > CHARACTER_LIMIT;
	const displayComment =
		commentNeedsExpansion && !isCommentExpanded ? review.comment.slice(0, CHARACTER_LIMIT) + "..." : review.comment;

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffTime = Math.abs(now.getTime() - date.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays === 0) return "Today";
		if (diffDays === 1) return "Yesterday";
		if (diffDays < 7) return `${diffDays}d`;

		return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
	};

	if (isMobile) {
		// Super compact mobile layout
		return (
			<div
				className={cn(
					"px-2.5 py-2 rounded-md border bg-card/50 backdrop-blur-sm",
					!review.isRead && "border-l-2 border-l-primary"
				)}
			>
				{/* Single compact row */}
				<div className="flex items-start gap-2">
					{/* Icon */}
					{review.customerType === "client" ? (
						<UserCheck className="h-3 w-3 text-primary flex-shrink-0 mt-0.5" />
					) : (
						<User className="h-3 w-3 text-muted-foreground flex-shrink-0 mt-0.5" />
					)}

					{/* Content */}
					<div className="flex-1 min-w-0 space-y-0.5">
						{/* Name + Date + Stars in one line */}
						<div className="flex items-center justify-between gap-2">
							<div className="flex items-center gap-1.5 flex-1 min-w-0">
								<span className="text-xs font-semibold truncate">{review.customerName}</span>
								<span className="text-[10px] text-muted-foreground flex-shrink-0">• {formatDate(review.date)}</span>
							</div>
							<div className="flex items-center gap-0.5 flex-shrink-0">
								{[...Array(5)].map((_, i) => (
									<Star
										key={i}
										className={cn("h-2.5 w-2.5", i < review.rating ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground/20")}
									/>
								))}
							</div>
						</div>

						{/* Comment - compact */}
						<p className="text-[11px] leading-snug text-foreground/70 line-clamp-2">{displayComment}</p>

						{/* Actions - inline */}
						<div className="flex items-center gap-2 pt-0.5">
							{commentNeedsExpansion && (
								<button
									onClick={() => setIsCommentExpanded(!isCommentExpanded)}
									className="text-[10px] text-primary font-medium"
								>
									{isCommentExpanded ? "Less" : "More"}
								</button>
							)}
							{!review.responded && onRespond && (
								<button onClick={() => onRespond(review)} className="text-[10px] text-primary font-medium">
									Reply
								</button>
							)}
							{review.responded && review.responseText && (
								<button
									onClick={() => setIsResponseExpanded(!isResponseExpanded)}
									className="text-[10px] text-muted-foreground font-medium"
								>
									{isResponseExpanded ? "Hide reply" : "View reply"}
								</button>
							)}
							<span className="text-[10px] text-muted-foreground ml-auto">{review.service}</span>
						</div>

						{/* Response */}
						{review.responded && review.responseText && isResponseExpanded && (
							<div className="pt-1 mt-1 border-t border-border/50">
								<p className="text-[10px] leading-snug text-foreground/60">{review.responseText}</p>
							</div>
						)}
					</div>

					{/* Indicators */}
					<div className="flex flex-col items-end gap-1 flex-shrink-0">
						{review.flagged && <Flag className="h-2.5 w-2.5 text-destructive" />}
						{!review.isRead && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
					</div>
				</div>
			</div>
		);
	}

	// Desktop layout
	return (
		<Card
			className={cn(
				"relative overflow-hidden transition-all duration-200 hover:shadow-sm",
				!review.isRead && "border-l-2 border-l-primary bg-primary/5"
			)}
		>
			<CardContent className="p-2.5">
				<div className="flex items-start gap-3">
					{/* Customer Icon */}
					<div className="flex-shrink-0">
						{review.customerType === "client" ? (
							<div className="rounded-full bg-primary/10 p-1.5">
								<UserCheck className="h-3.5 w-3.5 text-primary" />
							</div>
						) : (
							<div className="rounded-full bg-muted p-1.5">
								<User className="h-3.5 w-3.5 text-muted-foreground" />
							</div>
						)}
					</div>

					{/* Main Content */}
					<div className="flex-1 min-w-0 space-y-1">
						{/* First Row: Name, Rating, Date, Badges */}
						<div className="flex items-center justify-between gap-2">
							<div className="flex items-center gap-2 flex-1 min-w-0">
								<span className="text-sm font-semibold truncate">{review.customerName}</span>
								<div className="flex items-center gap-0.5">
									{[...Array(5)].map((_, i) => (
										<Star
											key={i}
											className={cn("h-3 w-3", i < review.rating ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground/30")}
										/>
									))}
								</div>
								<span className="text-xs text-muted-foreground flex-shrink-0">{formatDate(review.date)}</span>
							</div>

							<div className="flex items-center gap-1.5 flex-shrink-0">
								{review.flagged && (
									<Badge variant="destructive" className="text-xs h-5 px-1.5">
										<Flag className="h-2.5 w-2.5 mr-0.5" />
										Flagged
									</Badge>
								)}
								{!review.isRead && <div className="w-2 h-2 rounded-full bg-primary" />}
							</div>
						</div>

						{/* Second Row: Comment */}
						<p className="text-sm leading-relaxed text-foreground/80">{displayComment}</p>

						{/* Third Row: Meta + Actions */}
						<div className="flex items-center justify-between gap-3 pt-2 border-t border-border/50">
							<div className="flex items-center gap-2 text-xs text-muted-foreground">
								<span>{review.service}</span>
								<span>•</span>
								<span>{review.employee}</span>
							</div>

							<div className="flex items-center gap-1 flex-shrink-0">
								{commentNeedsExpansion && (
									<Button
										variant="ghost"
										size="sm"
										onClick={() => setIsCommentExpanded(!isCommentExpanded)}
										className="h-7 px-3 text-xs font-medium hover:bg-accent"
									>
										{isCommentExpanded ? "Show less" : "Read more"}
									</Button>
								)}

								{review.responded && review.responseText && (
									<Button
										variant="ghost"
										size="sm"
										onClick={() => setIsResponseExpanded(!isResponseExpanded)}
										className="h-7 px-3 text-xs font-medium hover:bg-accent"
									>
										<MessageSquare className="h-3 w-3 mr-1.5" />
										{isResponseExpanded ? "Hide" : "View"} response
									</Button>
								)}

								{!review.responded && onRespond && (
									<Button
										variant="default"
										size="sm"
										onClick={() => onRespond(review)}
										className="h-7 px-3 text-xs font-medium bg-primary hover:bg-primary/90"
									>
										<MessageSquare className="h-3 w-3 mr-1.5" />
										Respond
									</Button>
								)}
							</div>
						</div>

						{/* Response Content - Desktop (expandable) */}
						{review.responded && review.responseText && isResponseExpanded && (
							<div className="bg-muted/50 rounded-lg p-2.5 mt-1">
								<div className="flex items-center gap-1.5 mb-1">
									<MessageSquare className="h-3 w-3 text-primary" />
									<span className="text-xs font-medium text-muted-foreground">Your response</span>
								</div>
								<p className="text-sm text-foreground/80 leading-relaxed">{review.responseText}</p>
							</div>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
