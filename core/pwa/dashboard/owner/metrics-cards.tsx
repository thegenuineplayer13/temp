import { Calendar, Star, DollarSign, TrendingUp, Clock } from "lucide-react";
import { StarRating } from "./common/star-rating";
import type { JobsData, ReviewsData } from "@/features/core/types/types.dashboard-owner";

interface MetricsCardsProps {
   jobsData: JobsData;
   reviewsData: ReviewsData;
}

export function MetricsCards({ jobsData, reviewsData }: MetricsCardsProps) {
   return (
      <div className="grid grid-cols-1 md:grid-cols-3 border border-border rounded-xl overflow-hidden divide-y md:divide-y-0 md:divide-x divide-border bg-card/50 backdrop-blur-sm">
         {/* Scheduled Jobs */}
         <div className="relative group p-4 flex items-center gap-4 hover:bg-accent/5 transition-colors duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-accent/5 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative z-10 flex-shrink-0 rounded-xl bg-accent/10 p-3 group-hover:scale-110 transition-transform duration-300">
               <Calendar className="h-5 w-5 text-accent" />
            </div>
            <div className="relative z-10 space-y-1">
               <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Scheduled Jobs</p>
               <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold tracking-tight">{jobsData.scheduledTomorrow}</p>
                  <TrendingUp className="h-4 w-4 text-accent" />
               </div>
               <div className="flex items-center gap-1 text-xs text-accent">
                  <Clock className="h-3 w-3" />
                  <span>Tomorrow</span>
               </div>
            </div>
         </div>

         {/* Average Rating */}
         <div className="relative group p-4 flex items-center gap-4 hover:bg-yellow-500/5 transition-colors duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/5 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative z-10 flex-shrink-0 rounded-xl bg-yellow-500/10 p-3 group-hover:scale-110 transition-transform duration-300">
               <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-500 fill-yellow-600 dark:fill-yellow-500" />
            </div>
            <div className="relative z-10 space-y-1">
               <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Customer Rating</p>
               <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold tracking-tight">{reviewsData.averageRating}</p>
                  <span className="text-sm font-semibold text-muted-foreground">/ 5.0</span>
               </div>
               <StarRating rating={reviewsData.averageRating} size="sm" />
               <p className="text-xs text-muted-foreground">{reviewsData.totalReviews} reviews</p>
            </div>
         </div>

         {/* Average Job Value */}
         <div className="relative group p-4 flex items-center gap-4 hover:bg-primary/5 transition-colors duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative z-10 flex-shrink-0 rounded-xl bg-primary/10 p-3 group-hover:scale-110 transition-transform duration-300">
               <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div className="relative z-10 space-y-1">
               <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Avg. Job Value</p>
               <div className="flex items-baseline gap-1">
                  <span className="text-sm font-bold text-muted-foreground">$</span>
                  <p className="text-2xl font-bold tracking-tight">{jobsData.averageJobValue}</p>
               </div>
               <p className="text-xs text-muted-foreground">Per completed job</p>
            </div>
         </div>
      </div>
   );
}
