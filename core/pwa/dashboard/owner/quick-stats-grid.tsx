import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Users, Activity } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { TrendIndicator } from "./common/trend-indicator";
import { ProgressBar } from "./common/progress-bar";
import type { JobsData, RevenueData, StaffData } from "@/features/core/types/types.dashboard-owner";

interface QuickStatsGridProps {
   jobsData: JobsData;
   staffData: StaffData;
   revenueData: RevenueData;
}

export function QuickStatsGrid({ jobsData, staffData, revenueData }: QuickStatsGridProps) {
   const isMobile = useIsMobile();

   if (isMobile) {
      return (
         <div className="grid grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-primary/5 to-background col-span-2">
               <CardContent className="pt-6">
                  <div className="rounded-full bg-primary/10 p-2 w-fit mb-3">
                     <Activity className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">This Week</p>
                  <div className="space-y-2">
                     <div className="flex items-end gap-2">
                        <p className="text-3xl font-bold">${(revenueData.thisWeek / 1000).toFixed(1)}k</p>
                     </div>
                     <div className="flex items-center gap-1 text-xs">
                        <span className="text-muted-foreground">vs last week</span>
                        <TrendIndicator trend={revenueData.weeklyTrend} value={revenueData.weeklyPercentageChange} size="sm" />
                     </div>
                  </div>
               </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary/5 to-background">
               <CardContent className="pt-6">
                  <div className="rounded-full bg-primary/10 p-2 w-fit mb-3">
                     <Briefcase className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Jobs Today</p>
                  <div className="space-y-2">
                     <div className="flex items-end gap-2">
                        <p className="text-3xl font-bold">{jobsData.completedToday}</p>
                        <p className="text-sm text-muted-foreground mb-1">/ {jobsData.scheduledToday}</p>
                     </div>
                     <ProgressBar value={jobsData.completionRate} size="sm" showLabel label="Progress" />
                  </div>
               </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-secondary/5 to-background">
               <CardContent className="pt-6">
                  <div className="rounded-full bg-secondary/10 p-2 w-fit mb-3">
                     <Users className="h-4 w-4 text-secondary" />
                  </div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Staff Present</p>
                  <div className="space-y-2">
                     <div className="flex items-end gap-2">
                        <p className="text-3xl font-bold">{staffData.presentToday}</p>
                        <p className="text-sm text-muted-foreground mb-1">/ {staffData.totalStaff}</p>
                     </div>
                     <ProgressBar value={staffData.attendanceRate} size="sm" color="secondary" showLabel label="Attendance" />
                  </div>
               </CardContent>
            </Card>
         </div>
      );
   }

   return (
      <div className="grid grid-cols-3 gap-4">
         <Card className="bg-gradient-to-br from-primary/5 to-background">
            <CardContent className="pt-6">
               <div className="rounded-lg bg-primary/10 p-2 w-fit mb-3">
                  <Activity className="h-5 w-5 text-primary" />
               </div>
               <p className="text-xs font-medium text-muted-foreground mb-1">This Week</p>
               <p className="text-3xl font-bold mb-2">${(revenueData.thisWeek / 1000).toFixed(1)}k</p>
               <div className="flex items-center gap-1 text-xs">
                  <span className="text-muted-foreground">vs last week</span>
                  <TrendIndicator trend={revenueData.weeklyTrend} value={revenueData.weeklyPercentageChange} size="sm" />
               </div>
            </CardContent>
         </Card>

         <Card className="bg-gradient-to-br from-primary/5 to-background">
            <CardContent className="pt-6">
               <div className="rounded-lg bg-primary/10 p-2 w-fit mb-3">
                  <Briefcase className="h-5 w-5 text-primary" />
               </div>
               <p className="text-xs font-medium text-muted-foreground mb-1">Jobs Today</p>
               <p className="text-3xl font-bold mb-2">
                  {jobsData.completedToday}
                  <span className="text-xl text-muted-foreground">/{jobsData.scheduledToday}</span>
               </p>
               <ProgressBar value={jobsData.completionRate} size="sm" showLabel label="Completion" />
            </CardContent>
         </Card>

         <Card className="bg-gradient-to-br from-secondary/5 to-background">
            <CardContent className="pt-6">
               <div className="rounded-lg bg-secondary/10 p-2 w-fit mb-3">
                  <Users className="h-5 w-5 text-secondary" />
               </div>
               <p className="text-xs font-medium text-muted-foreground mb-1">Staff Present</p>
               <p className="text-3xl font-bold mb-2">
                  {staffData.presentToday}
                  <span className="text-xl text-muted-foreground">/{staffData.totalStaff}</span>
               </p>
               <ProgressBar value={staffData.attendanceRate} size="sm" color="secondary" showLabel label="Attendance" />
            </CardContent>
         </Card>
      </div>
   );
}
