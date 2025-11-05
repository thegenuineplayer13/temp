import { useCallback } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useModal } from "@/hooks/use-modal";
import { CurrentJobCard } from "./employee/current-job-card";
import { JobActionsPanel } from "./employee/job-actions-panel";
import { TodayStats } from "./employee/today-stats";
import { ClientInfoCard } from "./employee/client-info-card";
import { ClientProfileDrawer } from "./employee/client-profile-drawer";
import { useEmployeeDashboard } from "../../hooks/queries/queries.dashboard-employee";
import { useEmployeeStore } from "../../store/store.employee";

export default function EmployeeDashboard() {
   const isMobile = useIsMobile();
   const clientDrawer = useModal();

   const { data: dashboardData } = useEmployeeDashboard();
   const { currentJob, updateJobStatus, setIsTimerRunning, setCurrentJob, resetTimer } = useEmployeeStore();

   const handleStartTimer = useCallback(() => {
      setIsTimerRunning(true);
      updateJobStatus("in-progress");
   }, [setIsTimerRunning, updateJobStatus]);

   const handleCompleteJob = useCallback(() => {
      setIsTimerRunning(false);
      updateJobStatus("completed");
      resetTimer();
   }, [setIsTimerRunning, updateJobStatus, resetTimer]);

   const handleStartNextJob = useCallback(() => {
      if (dashboardData?.upcomingAppointments[0]) {
         const nextAppointment = dashboardData.upcomingAppointments[0];
         setCurrentJob({
            clientName: nextAppointment.clientName,
            serviceType: nextAppointment.serviceType,
            estimatedDuration: nextAppointment.estimatedDuration,
            status: "pending",
            scheduledTime: nextAppointment.time,
         });
         resetTimer();
      }
   }, [dashboardData, setCurrentJob, resetTimer]);

   if (!currentJob && dashboardData?.currentJob) {
      setCurrentJob(dashboardData.currentJob);
   }

   if (!dashboardData || !currentJob) {
      return (
         <div className="flex items-center justify-center h-screen">
            <p className="text-muted-foreground">Loading dashboard...</p>
         </div>
      );
   }

   const nextJob = dashboardData.upcomingAppointments[0] || null;

   if (isMobile) {
      return (
         <div className="bg-background">
            <div className="p-4 space-y-4">
               <CurrentJobCard
                  job={currentJob}
                  nextJob={nextJob}
                  onStartTimer={handleStartTimer}
                  onCompleteJob={handleCompleteJob}
                  onStartNextJob={handleStartNextJob}
                  onViewClientProfile={clientDrawer.open}
               />
            </div>

            <TodayStats stats={dashboardData.todayStats} />

            <JobActionsPanel />

            <ClientProfileDrawer
               open={clientDrawer.isOpen}
               onOpenChange={clientDrawer.setIsOpen}
               clientHistory={dashboardData.clientHistory}
            />
         </div>
      );
   }

   // Desktop View
   return (
      <div className="bg-background">
         <div className="mx-auto p-8 space-y-6">
            <TodayStats stats={dashboardData.todayStats} />

            <div className="grid grid-cols-3 gap-6">
               <div className="col-span-2 space-y-6">
                  <CurrentJobCard
                     job={currentJob}
                     nextJob={nextJob}
                     onStartTimer={handleStartTimer}
                     onCompleteJob={handleCompleteJob}
                     onStartNextJob={handleStartNextJob}
                  />

                  <JobActionsPanel />
               </div>

               <div className="col-span-1">
                  <ClientInfoCard clientHistory={dashboardData.clientHistory} />
               </div>
            </div>
         </div>
      </div>
   );
}
