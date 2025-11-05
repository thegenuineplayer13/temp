import { useQuery } from "@/mock/mock-react-query";
import {
   revenueDataSchema,
   jobsDataSchema,
   staffDataSchema,
   alertsDataSchema,
   reviewsDataSchema,
   serviceSchema,
   staffMemberSchema,
   reviewSchema,
} from "@/features/core/schemas/schemas.dashboard-owner";

import type {
   RevenueData,
   JobsData,
   StaffData,
   AlertsData,
   ReviewsData,
   Service,
   StaffMember,
   Review,
} from "@/features/core/types/types.dashboard-owner";

import { mockRevenueData } from "@/mock/mock-revenue";
import { mockJobsData } from "@/mock/mock-jobs";
import { mockStaffData } from "@/mock/mock-staff";
import { mockAlertsData } from "@/mock/mock-alerts";
import { mockReviewsData } from "@/mock/mock-reviews";
import { mockDetailedServices } from "@/mock/mock-detailed-data";
import { mockDetailedStaff } from "@/mock/mock-detailed-data";
import { mockDetailedFeedback } from "@/mock/mock-detailed-data";

export const QUERY_KEYS = {
   revenue: ["revenue"],
   jobs: ["jobs"],
   staff: ["staff"],
   alerts: ["alerts"],
   reviews: ["reviews"],
   services: ["services"],
   detailedServices: ["services", "detailed"],
   detailedStaff: ["staff", "detailed"],
   detailedFeedback: ["feedback", "detailed"],
} satisfies Record<string, readonly string[]>;

export function useRevenueData() {
   return useQuery<RevenueData>({
      queryKey: QUERY_KEYS.revenue,
      queryFn: () => {
         const validated = revenueDataSchema.parse(mockRevenueData);
         return validated;
      },
   });
}

export function useJobsData() {
   return useQuery<JobsData>({
      queryKey: QUERY_KEYS.jobs,
      queryFn: () => {
         const validated = jobsDataSchema.parse(mockJobsData);
         return validated;
      },
   });
}

export function useStaffData() {
   return useQuery<StaffData>({
      queryKey: QUERY_KEYS.staff,
      queryFn: () => {
         const validated = staffDataSchema.parse(mockStaffData);
         return validated;
      },
   });
}

export function useAlertsData() {
   return useQuery<AlertsData>({
      queryKey: QUERY_KEYS.alerts,
      queryFn: () => {
         const validated = alertsDataSchema.parse(mockAlertsData);
         return validated;
      },
   });
}

export function useReviewsData() {
   return useQuery<ReviewsData>({
      queryKey: QUERY_KEYS.reviews,
      queryFn: () => {
         const validated = reviewsDataSchema.parse(mockReviewsData);
         return validated;
      },
   });
}

export function useDetailedServices() {
   return useQuery<Service[]>({
      queryKey: QUERY_KEYS.detailedServices,
      queryFn: () => {
         const validated = mockDetailedServices.map((service) => serviceSchema.parse(service));
         return validated;
      },
   });
}

export function useDetailedStaff() {
   return useQuery<StaffMember[]>({
      queryKey: QUERY_KEYS.detailedStaff,
      queryFn: () => {
         const validated = mockDetailedStaff.map((staff) => staffMemberSchema.parse(staff));
         return validated;
      },
   });
}

export function useDetailedFeedback() {
   return useQuery<Review[]>({
      queryKey: QUERY_KEYS.detailedFeedback,
      queryFn: () => {
         const validated = mockDetailedFeedback.map((review) => reviewSchema.parse(review));
         return validated;
      },
   });
}
