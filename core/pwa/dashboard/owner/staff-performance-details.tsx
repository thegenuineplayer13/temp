import { Star, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import type { StaffMember } from "@/features/core/types/types.dashboard-owner";
import { AvatarWithBadge } from "./common/avatar-with-badge";
import { ProgressBar } from "./common/progress-bar";

interface StaffPerformanceDetailsProps {
   staff: StaffMember[];
}

export function StaffPerformanceDetails({ staff }: StaffPerformanceDetailsProps) {
   const isMobile = useIsMobile();

   if (isMobile) {
      return (
         <div className="p-4 space-y-3">
            {staff.map((member, idx) => (
               <div key={member.id} className="p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                  <div className="flex items-start gap-3 mb-3">
                     <AvatarWithBadge initials={member.avatar} size="lg" showBadge={idx === 0} />
                     <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{member.specialization}</p>
                     </div>
                     <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 text-accent fill-accent" />
                        <span className="text-sm font-semibold">{member.rating}</span>
                        <span className="text-xs text-muted-foreground">({member.totalReviews})</span>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                     <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Today</p>
                        <p className="text-lg font-bold">${member.todayRevenue}</p>
                        <p className="text-xs text-muted-foreground">{member.todayJobs} jobs</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">This Week</p>
                        <p className="text-lg font-bold">${member.weekRevenue}</p>
                        <div className="flex items-center gap-1">
                           <TrendingUp className="h-3 w-3 text-green-500" />
                           <span className="text-xs text-green-600 dark:text-green-500 font-semibold">+12%</span>
                        </div>
                     </div>
                  </div>

                  <div className="mt-3 pt-3 border-t">
                     <ProgressBar
                        value={member.efficiency}
                        size="sm"
                        color={member.efficiency >= 90 ? "success" : "primary"}
                        showLabel
                        label="Efficiency"
                     />
                  </div>
               </div>
            ))}
         </div>
      );
   }

   return (
      <div className="space-y-3 p-2">
         {staff.map((member, idx) => (
            <div key={member.id} className="p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
               <div className="flex items-center gap-4">
                  <AvatarWithBadge initials={member.avatar} size="lg" showBadge={idx === 0} />

                  <div className="flex-1 grid grid-cols-5 gap-4 items-center">
                     <div>
                        <p className="font-semibold">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{member.specialization}</p>
                     </div>

                     <div className="text-center">
                        <p className="text-xs text-muted-foreground mb-1">Today</p>
                        <p className="text-xl font-bold">${member.todayRevenue}</p>
                        <p className="text-xs text-muted-foreground">{member.todayJobs} jobs</p>
                     </div>

                     <div className="text-center">
                        <p className="text-xs text-muted-foreground mb-1">This Week</p>
                        <p className="text-xl font-bold">${member.weekRevenue}</p>
                        <div className="flex items-center justify-center gap-1 mt-0.5">
                           <TrendingUp className="h-3 w-3 text-green-500" />
                           <span className="text-xs text-green-600 dark:text-green-500 font-semibold">+12%</span>
                        </div>
                     </div>

                     <div>
                        <p className="text-xs text-muted-foreground mb-1.5">Efficiency</p>
                        <div className="flex items-center gap-2">
                           <ProgressBar
                              value={member.efficiency}
                              size="sm"
                              color={member.efficiency >= 90 ? "success" : "primary"}
                              className="flex-1"
                           />
                           <span
                              className={cn(
                                 "text-sm font-semibold",
                                 member.efficiency >= 90 ? "text-green-600 dark:text-green-500" : "text-foreground"
                              )}
                           >
                              {member.efficiency}%
                           </span>
                        </div>
                     </div>

                     <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                           <Star className="h-4 w-4 text-accent fill-accent" />
                           <span className="text-xl font-semibold">{member.rating}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{member.totalReviews} reviews</p>
                     </div>
                  </div>
               </div>
            </div>
         ))}
      </div>
   );
}
