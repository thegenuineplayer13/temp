import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Star, DollarSign, Clock } from "lucide-react";
import type { TodayStats as TodayStatsType } from "@/features/core/types/types.dashboard-employee";
import { useIsMobile } from "@/hooks/use-mobile";

interface TodayStatsProps {
   stats: TodayStatsType;
}

export function TodayStats({ stats }: TodayStatsProps) {
   const isMobile = useIsMobile();

   if (isMobile) {
      return (
         <div className="grid grid-cols-4 gap-2 px-4 py-3">
            <Card className="bg-card/50 backdrop-blur-sm">
               <CardContent className="p-3 space-y-1">
                  <div className="flex items-center justify-center">
                     <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
                  </div>
                  <div className="text-center">
                     <p className="text-xl font-bold">{stats.jobsCompleted}</p>
                     <p className="text-xs text-muted-foreground">Done</p>
                  </div>
               </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm">
               <CardContent className="p-3 space-y-1">
                  <div className="flex items-center justify-center">
                     <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-center">
                     <p className="text-xl font-bold">{stats.jobsRemaining}</p>
                     <p className="text-xs text-muted-foreground">Left</p>
                  </div>
               </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm">
               <CardContent className="p-3 space-y-1">
                  <div className="flex items-center justify-center">
                     <Star className="h-4 w-4 text-yellow-600 dark:text-yellow-500 fill-yellow-600 dark:fill-yellow-500" />
                  </div>
                  <div className="text-center">
                     <p className="text-xl font-bold">{stats.averageRating}</p>
                     <p className="text-xs text-muted-foreground">Rating</p>
                  </div>
               </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm">
               <CardContent className="p-3 space-y-1">
                  <div className="flex items-center justify-center">
                     <DollarSign className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-center">
                     <p className="text-xl font-bold">${stats.totalRevenue}</p>
                     <p className="text-xs text-muted-foreground">Today</p>
                  </div>
               </CardContent>
            </Card>
         </div>
      );
   }

   return (
      <div className="grid grid-cols-4 border border-border rounded-xl overflow-hidden divide-x divide-border bg-card/50 backdrop-blur-sm">
         {/* Jobs Completed */}
         <div className="relative group p-4 hover:bg-green-500/5 transition-colors duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/5 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative z-10 flex items-center gap-4">
               <div className="flex-shrink-0 rounded-xl bg-green-500/10 p-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500" />
               </div>
               <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Jobs Completed</p>
                  <p className="text-2xl font-bold tracking-tight">{stats.jobsCompleted}</p>
               </div>
            </div>
         </div>

         {/* Jobs Remaining */}
         <div className="relative group p-4 hover:bg-primary/5 transition-colors duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative z-10 flex items-center gap-4">
               <div className="flex-shrink-0 rounded-xl bg-primary/10 p-3">
                  <Clock className="h-5 w-5 text-primary" />
               </div>
               <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Jobs Remaining</p>
                  <p className="text-2xl font-bold tracking-tight">{stats.jobsRemaining}</p>
               </div>
            </div>
         </div>

         {/* Average Rating */}
         <div className="relative group p-4 hover:bg-yellow-500/5 transition-colors duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/5 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative z-10 flex items-center gap-4">
               <div className="flex-shrink-0 rounded-xl bg-yellow-500/10 p-3">
                  <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-500 fill-yellow-600 dark:fill-yellow-500" />
               </div>
               <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Avg. Rating</p>
                  <div className="flex items-baseline gap-1">
                     <p className="text-2xl font-bold tracking-tight">{stats.averageRating}</p>
                     <span className="text-sm font-semibold text-muted-foreground">/ 5.0</span>
                  </div>
               </div>
            </div>
         </div>

         {/* Total Revenue */}
         <div className="relative group p-4 hover:bg-primary/5 transition-colors duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative z-10 flex items-center gap-4">
               <div className="flex-shrink-0 rounded-xl bg-primary/10 p-3">
                  <DollarSign className="h-5 w-5 text-primary" />
               </div>
               <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Today's Revenue</p>
                  <div className="flex items-baseline gap-0.5">
                     <span className="text-sm font-bold text-muted-foreground">$</span>
                     <p className="text-2xl font-bold tracking-tight">{stats.totalRevenue}</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
