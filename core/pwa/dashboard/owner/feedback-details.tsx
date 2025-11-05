import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Review } from "@/features/core/types/types.dashboard-owner";
import { StarRating } from "./common/star-rating";

interface FeedbackDetailsProps {
   reviews: Review[];
}

export function FeedbackDetails({ reviews }: FeedbackDetailsProps) {
   const isMobile = useIsMobile();

   if (isMobile) {
      return (
         <div className="p-4 space-y-3">
            {reviews.map((review) => (
               <div
                  key={review.id}
                  className={cn(
                     "p-4 rounded-lg border transition-colors",
                     review.sentiment === "negative" ? "bg-destructive/5 border-destructive/20" : "bg-card"
                  )}
               >
                  <div className="flex items-start gap-3 mb-3">
                     <Avatar className="h-10 w-10">
                        <AvatarFallback className="text-xs bg-primary/10">
                           {review.customerName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                        </AvatarFallback>
                     </Avatar>
                     <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                           <p className="font-semibold text-sm">{review.customerName}</p>
                           {!review.responded && review.sentiment === "negative" && (
                              <Badge variant="destructive" className="text-xs">
                                 Reply
                              </Badge>
                           )}
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                           <StarRating rating={review.rating} size="sm" />
                           <span className="text-xs text-muted-foreground">{review.date}</span>
                        </div>
                     </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">{review.comment}</p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                     <span>{review.service}</span>
                     <span>{review.employee}</span>
                  </div>

                  {review.responded && review.responseText && (
                     <div className="mt-3 pt-3 border-t bg-muted/30 -mx-4 -mb-4 p-3 rounded-b-lg">
                        <div className="flex items-start gap-2">
                           <MessageSquare className="h-3.5 w-3.5 text-primary mt-0.5" />
                           <div className="flex-1">
                              <p className="text-xs font-semibold mb-1">Your response:</p>
                              <p className="text-xs text-muted-foreground">{review.responseText}</p>
                           </div>
                        </div>
                     </div>
                  )}

                  {!review.responded && review.sentiment === "negative" && (
                     <Button size="sm" variant="outline" className="w-full mt-3">
                        Reply to Review
                     </Button>
                  )}
               </div>
            ))}
         </div>
      );
   }

   return (
      <div className="space-y-3 p-2">
         {reviews.map((review) => (
            <div
               key={review.id}
               className={cn(
                  "p-4 rounded-lg border transition-colors hover:bg-accent/5",
                  review.sentiment === "negative" ? "bg-destructive/5 border-destructive/20" : "bg-card"
               )}
            >
               <div className="flex gap-4">
                  <Avatar className="h-12 w-12">
                     <AvatarFallback className="text-sm bg-primary/10">
                        {review.customerName
                           .split(" ")
                           .map((n) => n[0])
                           .join("")}
                     </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                     <div className="flex items-start justify-between mb-2">
                        <div>
                           <p className="font-semibold">{review.customerName}</p>
                           <div className="flex items-center gap-2 mt-1">
                              <StarRating rating={review.rating} size="sm" />
                              <span className="text-xs text-muted-foreground">{review.date}</span>
                           </div>
                        </div>
                        {!review.responded && review.sentiment === "negative" && (
                           <Badge variant="destructive" className="text-xs">
                              Action Required
                           </Badge>
                        )}
                     </div>

                     <p className="text-sm text-muted-foreground mb-3">{review.comment}</p>

                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                           <span>{review.service}</span>
                           <span>•</span>
                           <span>{review.employee}</span>
                        </div>

                        {!review.responded && review.sentiment === "negative" && (
                           <Button size="sm" variant="outline">
                              Reply to Review
                           </Button>
                        )}
                     </div>

                     {review.responded && review.responseText && (
                        <div className="mt-3 pt-3 border-t bg-muted/30 p-3 rounded-lg">
                           <div className="flex items-start gap-2">
                              <MessageSquare className="h-4 w-4 text-primary mt-0.5" />
                              <div className="flex-1">
                                 <p className="text-xs font-semibold mb-1">Your response:</p>
                                 <p className="text-sm text-muted-foreground">{review.responseText}</p>
                              </div>
                           </div>
                        </div>
                     )}
                  </div>
               </div>
            </div>
         ))}
      </div>
   );
}
