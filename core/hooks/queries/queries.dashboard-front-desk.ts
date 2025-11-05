import { useQuery } from "@/mock/mock-react-query";
import {
   customerSchema,
   staffSchema,
   appointmentSchema,
   walkInSchema,
} from "@/features/core/schemas/schemas.dashboard-front-desk";

import type { Customer, Staff, Appointment, WalkIn } from "@/features/core/types/types.dashboard-front-desk";

import { mockCustomers, mockStaff, mockAppointments, mockWalkIns } from "@/mock/front-desk-dashboard-mock";

export const QUERY_KEYS = {
   customers: ["customers"],
   staff: ["staff"],
   appointments: ["appointments"],
   walkIns: ["walk-ins"],
   customerAppointments: (customerId: string) => ["customer-appointments", customerId],
} satisfies Record<string, readonly string[] | ((id: string) => readonly string[])>;

export function useCustomers() {
   return useQuery<Customer[]>({
      queryKey: QUERY_KEYS.customers,
      queryFn: () => {
         const validated = mockCustomers.map((customer) => customerSchema.parse(customer));
         return validated;
      },
   });
}

export function useStaff() {
   return useQuery<Staff[]>({
      queryKey: QUERY_KEYS.staff,
      queryFn: () => {
         const validated = mockStaff.map((staff) => staffSchema.parse(staff));
         return validated;
      },
   });
}

export function useAppointments() {
   return useQuery<Appointment[]>({
      queryKey: QUERY_KEYS.appointments,
      queryFn: () => {
         const validated = mockAppointments.map((appointment) => appointmentSchema.parse(appointment));
         return validated;
      },
   });
}

export function useWalkIns() {
   return useQuery<WalkIn[]>({
      queryKey: QUERY_KEYS.walkIns,
      queryFn: () => {
         const validated = mockWalkIns.map((walkIn) => walkInSchema.parse(walkIn));
         return validated;
      },
   });
}

export function useCustomerAppointments(customerId: string) {
   const { data: appointments } = useAppointments();

   return useQuery<Appointment[]>({
      queryKey: QUERY_KEYS.customerAppointments(customerId),
      queryFn: () => {
         if (!appointments) return [];
         return appointments.filter((apt) => apt.customerId === customerId || apt.customerName === customerId);
      },
      enabled: !!appointments && !!customerId,
   });
}
