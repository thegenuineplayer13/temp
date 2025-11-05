import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, User, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { ResponsiveDialog } from "@/features/core/components/shared/responsive-dialog";
import type { Review } from "@/features/core/types/types.reviews";

interface ResponseModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	review: Review | null;
	onSubmit?: (reviewId: string, response: string) => void;
}

export function ResponseModal({ open, onOpenChange, review, onSubmit }: ResponseModalProps) {
	const [responseText, setResponseText] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async () => {
		if (!review || !responseText.trim()) return;

		setIsSubmitting(true);
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 500));

		if (onSubmit) {
			onSubmit(review.id, responseText);
		}

		setIsSubmitting(false);
		setResponseText("");
		onOpenChange(false);
	};

	if (!review) return null;

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
	};

	const footer = (
		<div className="flex gap-2 w-full">
			<Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1" disabled={isSubmitting}>
				Cancel
			</Button>
			<Button onClick={handleSubmit} className="flex-1" disabled={!responseText.trim() || isSubmitting}>
				{isSubmitting ? "Sending..." : "Send Response"}
			</Button>
		</div>
	);

	return (
		<ResponsiveDialog open={open} onOpenChange={onOpenChange} title="Respond to Review" footer={footer}>
			<div className="space-y-4">
				{/* Review Summary */}
				<div className="bg-muted/50 rounded-lg p-4 space-y-3">
					<div className="flex items-start gap-3">
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
							<div className="flex items-center gap-2 mb-1">
								<h4 className="font-semibold text-sm">{review.customerName}</h4>
								<span className="text-xs text-muted-foreground">• {formatDate(review.date)}</span>
							</div>

							<div className="flex items-center gap-2 mb-2">
								{[...Array(5)].map((_, i) => (
									<Star
										key={i}
										className={cn("h-3.5 w-3.5", i < review.rating ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground/30")}
									/>
								))}
							</div>

							<p className="text-sm text-foreground/90 leading-relaxed">{review.comment}</p>

							<div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
								<div>
									<span className="font-medium">Service:</span> {review.service}
								</div>
								<span>•</span>
								<div>
									<span className="font-medium">Staff:</span> {review.employee}
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Response Input */}
				<div className="space-y-2">
					<Label htmlFor="response">Your Response</Label>
					<Textarea
						id="response"
						placeholder="Write a thoughtful response to this review..."
						value={responseText}
						onChange={(e) => setResponseText(e.target.value)}
						rows={6}
						className="resize-none"
					/>
					<p className="text-xs text-muted-foreground">{responseText.length} characters</p>
				</div>

				{/* Tips */}
				<div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
					<h5 className="text-xs font-semibold text-blue-600 dark:text-blue-500 mb-2">💡 Response Tips</h5>
					<ul className="text-xs text-muted-foreground space-y-1">
						<li>• Thank the customer for their feedback</li>
						<li>• Address specific points mentioned in the review</li>
						<li>• Keep it professional and courteous</li>
						{review.sentiment === "negative" && <li>• Offer to resolve the issue privately if needed</li>}
					</ul>
				</div>
			</div>
		</ResponsiveDialog>
	);
}
