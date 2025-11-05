import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquare, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useModal } from "@/hooks/use-modal";
import { ResponsiveModal } from "@/components/ui/modal";
import { FeedbackDetails } from "./feedback-details";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Review } from "@/features/core/types/types.dashboard-owner";
import { useDetailedFeedback } from "@/features/core/hooks/queries/queries.dashboard-owner";
import { StarRating } from "./common/star-rating";

interface CustomerFeedbackProps {
   reviews: Review[];
   averageRating: number;
}

export function CustomerFeedback({ reviews, averageRating }: CustomerFeedbackProps) {
   const isMobile = useIsMobile();
   const modal = useModal();
   const { data: detailedFeedback } = useDetailedFeedback();

   const CardWrapper = isMobile ? "button" : "div";
   const cardProps = isMobile
      ? {
           onClick: modal.open,
           className: "w-full text-left active:scale-[0.98] transition-transform",
        }
      : {};

   if (isMobile) {
      return (
         <>
            <CardWrapper {...cardProps}>
               <Card className="relative">
                  <ChevronRight className="absolute top-4 right-4 h-4 w-4 text-muted-foreground" />
                  <CardHeader className="pb-3">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <MessageSquare className="h-4 w-4 text-primary" />
                           <CardTitle className="text-sm font-semibold">Recent Feedback</CardTitle>
                        </div>
                        <div className="flex items-center gap-1">
                           <StarRating rating={averageRating} size="sm" showValue />
                        </div>
                     </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                     {reviews.map((review) => (
                        <div
                           key={review.id}
                           className={cn(
                              "p-3 rounded-lg border transition-colors",
                              review.sentiment === "negative"
                                 ? "bg-destructive/5 border-destructive/20"
                                 : "bg-muted/50 border-transparent"
                           )}
                        >
                           <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                 <p className="text-sm font-semibold">{review.customerName}</p>
                                 {!review.responded && review.sentiment === "negative" && (
                                    <Badge variant="destructive" className="text-xs h-5">
                                       New
                                    </Badge>
                                 )}
                              </div>
                              <StarRating rating={review.rating} size="sm" />
                           </div>
                           <p className="text-xs text-muted-foreground line-clamp-2">{review.comment}</p>
                           <p className="text-xs text-muted-foreground/70 mt-1">{review.service}</p>
                        </div>
                     ))}
                  </CardContent>
               </Card>
            </CardWrapper>

            <ResponsiveModal open={modal.isOpen} onOpenChange={modal.setIsOpen} title="Customer Feedback">
               {detailedFeedback && <FeedbackDetails reviews={detailedFeedback} />}
            </ResponsiveModal>
         </>
      );
   }

   return (
      <>
         <Card className="mt-6">
            <CardHeader>
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <MessageSquare className="h-5 w-5 text-primary" />
                     <CardTitle className="text-base font-semibold">Customer Feedback</CardTitle>
                  </div>
                  <Button variant="outline" size="sm" onClick={modal.open}>
                     View All
                     <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
               </div>
            </CardHeader>
            <CardContent>
               <div className="grid grid-cols-3 gap-4">
                  {reviews.map((review) => (
                     <div
                        key={review.id}
                        className={cn(
                           "p-4 rounded-lg border transition-all hover:shadow-md",
                           review.sentiment === "negative"
                              ? "bg-destructive/5 border-destructive/20"
                              : "bg-muted/30 border-border"
                        )}
                     >
                        <div className="flex items-center justify-between mb-3">
                           <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                 <AvatarFallback className="text-xs bg-primary/10">
                                    {review.customerName
                                       .split(" ")
                                       .map((n) => n[0])
                                       .join("")}
                                 </AvatarFallback>
                              </Avatar>
                              <p className="text-sm font-semibold">{review.customerName}</p>
                           </div>
                           {!review.responded && review.sentiment === "negative" && (
                              <Badge variant="destructive" className="text-xs">
                                 Reply
                              </Badge>
                           )}
                        </div>
                        <StarRating rating={review.rating} size="sm" className="mb-2" />
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-2">{review.comment}</p>
                        <p className="text-xs text-muted-foreground/70">
                           {review.service} • {review.employee}
                        </p>
                     </div>
                  ))}
               </div>
            </CardContent>
         </Card>

         <ResponsiveModal open={modal.isOpen} onOpenChange={modal.setIsOpen} title="Customer Feedback">
            {detailedFeedback && <FeedbackDetails reviews={detailedFeedback} />}
         </ResponsiveModal>
      </>
   );
}
