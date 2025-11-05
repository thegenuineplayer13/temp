import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePullToRefresh } from "@/hooks/use-pull-to-refresh";
import { useOwnerStore } from "@/features/core/store/store.owner";
import {
   useRevenueData,
   useJobsData,
   useStaffData,
   useAlertsData,
   useReviewsData,
} from "@/features/core/hooks/queries/queries.dashboard-owner";
import { CriticalAlertsBanner } from "./owner/critical-alerts-banner";
import { RevenueHeroCard } from "./owner/revenue-hero-card";
import { QuickStatsGrid } from "./owner/quick-stats-grid";
import { MetricsCards } from "./owner/metrics-cards";
import { TopPerformers } from "./owner/top-performers";
import { ServiceBreakdown } from "./owner/service-breakdown";
import { CustomerFeedback } from "./owner/customer-feedback";
import { RevenueTrendChart } from "./owner/revenue-trend-chart";
import { StaffPerformanceTable } from "./owner/staff-performance-table";
import { FloatingActionButtons } from "./owner/floating-action-buttons";
import { DISPLAY_LIMITS } from "../../constants/constants.dashboard-owner";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export function OwnerDashboard() {
   const isMobile = useIsMobile();
   const navigate = useNavigate();
   const { dismissedAlerts, dismissAlert } = useOwnerStore();

   // Queries
   const { data: revenueData, refetch: refetchRevenue } = useRevenueData();
   const { data: jobsData, refetch: refetchJobs } = useJobsData();
   const { data: staffData, refetch: refetchStaff } = useStaffData();
   const { data: alertsData, refetch: refetchAlerts } = useAlertsData();
   const { data: reviewsData, refetch: refetchReviews } = useReviewsData();

   const handleRefresh = useCallback(async () => {
      await Promise.all([refetchRevenue(), refetchJobs(), refetchStaff(), refetchAlerts(), refetchReviews()]);
   }, [refetchRevenue, refetchJobs, refetchStaff, refetchAlerts, refetchReviews]);

   usePullToRefresh({
      onRefresh: handleRefresh,
      enabled: isMobile,
   });

   const handleViewAlerts = useCallback(() => {
      navigate("/alerts");
   }, [navigate]);

   const handleSendAnnouncement = useCallback(() => {
      console.log("Send announcement");
   }, []);

   const handleGenerateReport = useCallback(() => {
      console.log("Generate and share report");
   }, []);

   if (!revenueData || !jobsData || !staffData || !alertsData || !reviewsData) {
      return (
         <div className="flex items-center justify-center h-screen">
            <LoadingSpinner size="lg" type="dual-ring" />
         </div>
      );
   }

   const criticalAlerts = alertsData.alerts.filter(
      (a) => a.type === "critical" && !a.resolved && !dismissedAlerts.includes(a.id)
   );

   if (isMobile) {
      return (
         <>
            <CriticalAlertsBanner alerts={criticalAlerts} onDismiss={dismissAlert} onViewAll={handleViewAlerts} />

            <div className="pb-6">
               <div className="p-4 space-y-4">
                  <RevenueHeroCard data={revenueData} />

                  <QuickStatsGrid jobsData={jobsData} staffData={staffData} revenueData={revenueData} />

                  <MetricsCards jobsData={jobsData} reviewsData={reviewsData} />

                  <TopPerformers performers={staffData.topPerformers} />

                  <ServiceBreakdown services={revenueData.serviceBreakdown.slice(0, DISPLAY_LIMITS.MOBILE_SERVICES)} />

                  <CustomerFeedback
                     reviews={reviewsData.recentReviews.slice(0, DISPLAY_LIMITS.MOBILE_REVIEWS)}
                     averageRating={reviewsData.averageRating}
                  />
               </div>
            </div>

            <FloatingActionButtons onAnnouncement={handleSendAnnouncement} onReport={handleGenerateReport} />
         </>
      );
   }

   return (
      <>
         <CriticalAlertsBanner alerts={criticalAlerts} onDismiss={dismissAlert} onViewAll={handleViewAlerts} />

         <div className="relative">
            <div className="p-6">
               <div className="grid grid-cols-12 gap-6 mb-6">
                  <RevenueHeroCard data={revenueData} />

                  <div className="col-span-7 space-y-4">
                     <QuickStatsGrid jobsData={jobsData} staffData={staffData} revenueData={revenueData} />

                     <MetricsCards jobsData={jobsData} reviewsData={reviewsData} />
                  </div>
               </div>

               <div className="grid grid-cols-3 gap-6 mb-6">
                  <RevenueTrendChart chartData={revenueData.chartData} />
                  <ServiceBreakdown services={revenueData.serviceBreakdown.slice(0, DISPLAY_LIMITS.DESKTOP_SERVICES)} />
               </div>

               <StaffPerformanceTable staff={staffData.staff} />

               <CustomerFeedback
                  reviews={reviewsData.recentReviews.slice(0, DISPLAY_LIMITS.DESKTOP_REVIEWS)}
                  averageRating={reviewsData.averageRating}
               />
            </div>

            <FloatingActionButtons onAnnouncement={handleSendAnnouncement} onReport={handleGenerateReport} />
         </div>
      </>
   );
}
