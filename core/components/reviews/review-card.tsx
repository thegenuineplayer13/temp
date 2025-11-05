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

const CHARACTER_LIMIT = 120;

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
		if (diffDays < 7) return `${diffDays}d ago`;

		return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
	};

	if (isMobile) {
		// Ultra-compact mobile layout
		return (
			<div
				className={cn(
					"p-3 rounded-lg border bg-card transition-all duration-200",
					!review.isRead && "border-l-2 border-l-primary bg-primary/5"
				)}
			>
				{/* Header - Single Line */}
				<div className="flex items-center justify-between gap-2 mb-1.5">
					<div className="flex items-center gap-1.5 flex-1 min-w-0">
						{review.customerType === "client" ? (
							<UserCheck className="h-3 w-3 text-primary flex-shrink-0" />
						) : (
							<User className="h-3 w-3 text-muted-foreground flex-shrink-0" />
						)}
						<span className="text-xs font-semibold truncate">{review.customerName}</span>
						<span className="text-xs text-muted-foreground">•</span>
						<span className="text-xs text-muted-foreground flex-shrink-0">{formatDate(review.date)}</span>
					</div>
					<div className="flex items-center gap-1 flex-shrink-0">
						{review.flagged && <Flag className="h-3 w-3 text-destructive" />}
						{!review.isRead && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
					</div>
				</div>

				{/* Rating */}
				<div className="flex items-center gap-1 mb-1.5">
					{[...Array(5)].map((_, i) => (
						<Star
							key={i}
							className={cn("h-3 w-3", i < review.rating ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground/30")}
						/>
					))}
				</div>

				{/* Comment */}
				<p className="text-xs leading-relaxed text-foreground/80 mb-2">{displayComment}</p>

				{/* Actions Row */}
				<div className="flex items-center justify-between gap-2">
					<div className="flex items-center gap-1.5">
						{commentNeedsExpansion && (
							<button onClick={() => setIsCommentExpanded(!isCommentExpanded)} className="text-xs text-primary hover:underline">
								{isCommentExpanded ? "Less" : "More"}
							</button>
						)}
						{!review.responded && onRespond && (
							<button onClick={() => onRespond(review)} className="text-xs text-primary hover:underline">
								Respond
							</button>
						)}
					</div>
					<div className="flex items-center gap-1 text-xs text-muted-foreground">
						<span className="truncate">{review.service}</span>
					</div>
				</div>

				{/* Response Section - Mobile (collapsed) */}
				{review.responded && review.responseText && (
					<div className="border-t border-border mt-2 pt-2">
						<button
							onClick={() => setIsResponseExpanded(!isResponseExpanded)}
							className="flex items-center justify-between w-full text-xs text-muted-foreground hover:text-foreground transition-colors"
						>
							<div className="flex items-center gap-1.5">
								<MessageSquare className="h-3 w-3" />
								<span>Your response</span>
							</div>
							{isResponseExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
						</button>

						{isResponseExpanded && (
							<p className="text-xs leading-relaxed text-foreground/70 mt-2 pl-4 border-l-2 border-primary/20">{review.responseText}</p>
						)}
					</div>
				)}
			</div>
		);
	}

	// Compact desktop layout
	return (
		<Card
			className={cn(
				"relative overflow-hidden transition-all duration-200 hover:shadow-sm",
				!review.isRead && "border-l-2 border-l-primary bg-primary/5"
			)}
		>
			<CardContent className="p-3">
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
					<div className="flex-1 min-w-0 space-y-1.5">
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
									<Badge variant="destructive" className="text-xs h-5">
										<Flag className="h-2.5 w-2.5 mr-0.5" />
										Flagged
									</Badge>
								)}
								{!review.isRead && <div className="w-2 h-2 rounded-full bg-primary" />}
							</div>
						</div>

						{/* Second Row: Comment */}
						<p className="text-sm leading-relaxed text-foreground/80">{displayComment}</p>

						{/* Third Row: Service/Staff + Actions */}
						<div className="flex items-center justify-between gap-2">
							<div className="flex items-center gap-2 text-xs text-muted-foreground">
								<span>{review.service}</span>
								<span>•</span>
								<span>{review.employee}</span>
							</div>

							<div className="flex items-center gap-2">
								{commentNeedsExpansion && (
									<Button
										variant="ghost"
										size="sm"
										onClick={() => setIsCommentExpanded(!isCommentExpanded)}
										className="h-6 px-2 text-xs"
									>
										{isCommentExpanded ? "Show less" : "Read more"}
									</Button>
								)}

								{review.responded && review.responseText && (
									<Button
										variant="ghost"
										size="sm"
										onClick={() => setIsResponseExpanded(!isResponseExpanded)}
										className="h-6 px-2 text-xs"
									>
										<MessageSquare className="h-3 w-3 mr-1" />
										{isResponseExpanded ? "Hide" : "Show"} response
									</Button>
								)}

								{!review.responded && onRespond && (
									<Button variant="default" size="sm" onClick={() => onRespond(review)} className="h-6 px-2 text-xs">
										Respond
									</Button>
								)}
							</div>
						</div>

						{/* Response Content - Desktop (expandable) */}
						{review.responded && review.responseText && isResponseExpanded && (
							<div className="bg-muted/50 rounded-lg p-2.5 mt-1.5">
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
