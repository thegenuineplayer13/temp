import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, User, Briefcase, Play, CheckCircle, ArrowRight, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Appointment, CurrentJob } from "@/features/core/types/types.dashboard-employee";
import { useJobTimer } from "@/features/core/hooks/use-job-timer";

interface CurrentJobCardProps {
   job: CurrentJob;
   nextJob: Appointment | null;
   onStartTimer: () => void;
   onCompleteJob: () => void;
   onStartNextJob: () => void;
   onViewClientProfile?: () => void;
}

export function CurrentJobCard({
   job,
   nextJob,
   onStartTimer,
   onCompleteJob,
   onStartNextJob,
   onViewClientProfile,
}: CurrentJobCardProps) {
   const isMobile = useIsMobile();
   const { elapsedTime, formattedTime } = useJobTimer();

   const getStatusColor = () => {
      if (job.status === "completed") return "bg-green-500/10 text-green-600 dark:text-green-500 border-green-500/20";
      if (job.status === "in-progress") return "bg-blue-500/10 text-blue-600 dark:text-blue-500 border-blue-500/20";
      return "bg-muted text-muted-foreground";
   };

   const getStatusText = () => {
      if (job.status === "completed") return "Completed";
      if (job.status === "in-progress") return "In Progress";
      return "Ready";
   };

   const progress = Math.min((elapsedTime / (job.estimatedDuration * 60)) * 100, 100);
   const timeRemaining = Math.max(0, job.estimatedDuration - Math.floor(elapsedTime / 60));

   if (isMobile) {
      return (
         <Card className="relative overflow-hidden border-2 border-primary/20 shadow-lg bg-gradient-to-br from-primary/10 via-primary/5 to-background">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />

            <CardHeader className="relative">
               <div className="space-y-4">
                  <div className="flex justify-between">
                     <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-primary" />
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Current Job</span>
                     </div>
                     <Badge className={cn("font-semibold", getStatusColor())}>
                        {job.status === "in-progress" && <div className="w-2 h-2 rounded-full bg-current mr-2 animate-pulse" />}
                        {getStatusText()}
                     </Badge>
                  </div>
                  <button
                     onClick={onViewClientProfile}
                     className="border-1 border-primary flex items-center gap-2 group w-full text-left p-3 rounded-lg hover:bg-accent/10 transition-colors"
                  >
                     <div className="rounded-full bg-primary/15 p-2 group-hover:bg-primary/25 group-hover:scale-110 transition-all">
                        <User className="h-4 w-4 text-primary" />
                     </div>
                     <div className="flex-1 min-w-0">
                        <h2 className="text-2xl font-bold tracking-tight truncate group-hover:text-primary transition-colors">
                           {job.clientName}
                        </h2>
                        <div className="flex items-center gap-1.5 text-muted-foreground mt-0.5">
                           <Briefcase className="h-3.5 w-3.5" />
                           <span className="text-sm font-medium truncate">{job.serviceType}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground mt-1">
                           <Clock className="h-3.5 w-3.5" />
                           <span className="text-xs">Scheduled: {job.scheduledTime}</span>
                        </div>
                     </div>
                     <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </button>
               </div>
            </CardHeader>

            <CardContent className="relative space-y-4">
               <div className="bg-background/80 backdrop-blur-md rounded-xl p-4 border-2 border-border shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                     <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Time Elapsed</span>
                     </div>
                     <span className="text-xs font-medium text-muted-foreground">Est. {job.estimatedDuration}m</span>
                  </div>

                  <div className="space-y-3">
                     <div className="text-5xl font-bold tracking-tighter tabular-nums">{formattedTime}</div>

                     <div className="space-y-2">
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                           <div
                              className={cn(
                                 "h-full transition-all duration-300 rounded-full",
                                 progress >= 100
                                    ? "bg-gradient-to-r from-green-500 to-green-600"
                                    : "bg-gradient-to-r from-primary to-primary/80"
                              )}
                              style={{ width: `${progress}%` }}
                           />
                        </div>
                        <div className="flex items-center justify-between text-xs">
                           <span className="font-semibold text-muted-foreground">{Math.round(progress)}% Complete</span>
                           <span className="font-medium text-muted-foreground">{timeRemaining}m left</span>
                        </div>
                     </div>
                  </div>
               </div>

               <div>
                  {job.status === "pending" && (
                     <Button
                        onClick={onStartTimer}
                        size="lg"
                        className="w-full h-14 text-base font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                     >
                        <Play className="mr-2 h-5 w-5 fill-current" />
                        Start Job Now
                     </Button>
                  )}

                  {job.status === "in-progress" && (
                     <Button
                        onClick={onCompleteJob}
                        size="lg"
                        className="w-full h-14 text-base font-semibold bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg shadow-green-600/20"
                     >
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Mark as Complete
                     </Button>
                  )}

                  {job.status === "completed" && (
                     <Button
                        onClick={onStartNextJob}
                        size="lg"
                        className="w-full h-14 text-base font-semibold shadow-lg"
                        variant="default"
                     >
                        Start Next Job
                     </Button>
                  )}
               </div>

               <div className="pt-4 border-t border-border/50">
                  {nextJob ? (
                     <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <div className="rounded-md bg-muted p-2 mt-0.5">
                           <Clock className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                           <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                 Next Up
                              </span>
                              <Badge variant="outline" className="text-xs">
                                 {nextJob.time}
                              </Badge>
                           </div>
                           <p className="text-sm font-semibold truncate">{nextJob.clientName}</p>
                           <p className="text-xs text-muted-foreground truncate">{nextJob.serviceType}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground mt-3" />
                     </div>
                  ) : (
                     <div className="flex items-center justify-center p-4 rounded-lg bg-muted/20 border border-dashed">
                        <p className="text-sm text-muted-foreground">No more appointments scheduled</p>
                     </div>
                  )}
               </div>
            </CardContent>
         </Card>
      );
   }

   // Desktop version
   return (
      <Card className="relative overflow-hidden border-2 border-primary/20 shadow-xl bg-gradient-to-br from-primary/10 via-primary/5 to-background">
         <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32" />

         <div className="absolute top-6 right-6 z-10">
            <Badge className={cn("font-semibold", getStatusColor())}>
               {job.status === "in-progress" && <div className="w-2 h-2 rounded-full bg-current mr-2 animate-pulse" />}
               {getStatusText()}
            </Badge>
         </div>

         <CardHeader className="relative">
            <div className="space-y-4">
               <div>
                  <div className="flex items-center gap-2 mb-2">
                     <div className="rounded-lg bg-primary/10 p-3">
                        <Briefcase className="h-6 w-6 text-primary" />
                     </div>
                     <span className="text-lg font-medium text-muted-foreground uppercase tracking-wider">Current Job</span>
                  </div>
                  <h2 className="text-4xl font-bold tracking-tight">{job.clientName}</h2>
               </div>

               <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                     <Briefcase className="h-4 w-4" />
                     <span className="font-medium">{job.serviceType}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                     <Clock className="h-4 w-4" />
                     <span>Scheduled: {job.scheduledTime}</span>
                  </div>
               </div>
            </div>
         </CardHeader>

         <CardContent className="relative">
            <div className="grid grid-cols-3 gap-6">
               <div
                  className={cn(
                     "col-span-2 bg-background/80 backdrop-blur-md rounded-xl p-6 border-2 border-border shadow-sm",
                     job.status === "pending"
                        ? "bg-primary/13 border-primary shadow-lg"
                        : "bg-muted/30 hover:bg-muted/50 border-border"
                  )}
               >
                  <div className="flex items-center justify-between mb-4">
                     <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-primary" />
                        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Time Elapsed</span>
                     </div>
                     <span className="text-sm font-medium text-muted-foreground">Est. {job.estimatedDuration} minutes</span>
                  </div>

                  <div className="space-y-4">
                     <div
                        className={cn(
                           "text-7xl font-bold tracking-tighter tabular-nums",
                           job.status === "in-progress" ? "text-foreground" : "text-muted-foreground"
                        )}
                     >
                        {formattedTime}
                     </div>

                     <div className="space-y-2">
                        <div className="h-4 bg-muted rounded-full overflow-hidden">
                           <div
                              className={cn(
                                 "h-full transition-all duration-300 rounded-full",
                                 progress >= 100
                                    ? "bg-gradient-to-r from-green-500 to-green-600"
                                    : "bg-gradient-to-r from-primary to-primary/80"
                              )}
                              style={{ width: `${progress}%` }}
                           />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                           <span className="font-semibold text-muted-foreground">{Math.round(progress)}% Complete</span>
                           <span className="font-medium text-muted-foreground">{timeRemaining} minutes remaining</span>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="flex flex-col gap-6">
                  {job.status === "pending" && (
                     <Button
                        onClick={onStartTimer}
                        size="lg"
                        className="w-full text-base font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                     >
                        <Play className="mr-2 h-5 w-5 fill-current" />
                        Start Job
                     </Button>
                  )}

                  {job.status === "in-progress" && (
                     <Button
                        onClick={onCompleteJob}
                        size="lg"
                        className="w-full text-base font-semibold bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg shadow-green-600/20"
                     >
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Complete
                     </Button>
                  )}

                  {job.status === "completed" && (
                     <Button
                        onClick={onStartNextJob}
                        size="lg"
                        className="w-full text-base font-semibold shadow-lg"
                        variant="default"
                     >
                        <ArrowRight className="mr-2 h-5 w-5" />
                        Start Next
                     </Button>
                  )}

                  {nextJob ? (
                     <div
                        className={cn(
                           "h-full flex justify-center flex-col gap-3 p-3 rounded-xl transition-all cursor-pointer group border-2",
                           job.status === "completed"
                              ? "bg-primary/13 border-primary shadow-lg"
                              : "bg-muted/30 hover:bg-muted/50 border-border"
                        )}
                     >
                        <div className="flex items-center gap-2">
                           <Clock className="h-4 w-4 text-muted-foreground" />
                           <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Next Up</span>
                           <Badge variant="outline" className="ml-auto text-xs">
                              {nextJob.time}
                           </Badge>
                        </div>
                        <div>
                           <p className="font-semibold truncate mb-1">{nextJob.clientName}</p>
                           <p className="text-sm text-muted-foreground truncate">{nextJob.serviceType}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors self-end -mb-1" />
                     </div>
                  ) : (
                     <div className="h-full flex items-center justify-center p-6 rounded-xl bg-muted/20 border-2 border-dashed">
                        <p className="text-sm text-muted-foreground text-center leading-relaxed">
                           No more appointments
                           <br />
                           scheduled today
                        </p>
                     </div>
                  )}
               </div>
            </div>
         </CardContent>
      </Card>
   );
}
