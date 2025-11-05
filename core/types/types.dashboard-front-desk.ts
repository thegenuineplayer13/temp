import type z from "zod";
import type {
   appointmentSchema,
   appointmentStatusSchema,
   paymentStatusSchema,
   staffStatusSchema,
   customerSchema,
   staffSchema,
   walkInSchema,
   newCustomerSchema,
   serviceCartItemSchema,
   staffAssignmentModeSchema,
   serviceStaffAssignmentSchema,
   bookingDataSchema,
} from "../schemas/schemas.dashboard-front-desk";

export type AppointmentStatus = z.infer<typeof appointmentStatusSchema>;
export type PaymentStatus = z.infer<typeof paymentStatusSchema>;
export type StaffStatus = z.infer<typeof staffStatusSchema>;
export type Appointment = z.infer<typeof appointmentSchema>;
export type Customer = z.infer<typeof customerSchema>;
export type Staff = z.infer<typeof staffSchema>;
export type WalkIn = z.infer<typeof walkInSchema>;
export type NewCustomer = z.infer<typeof newCustomerSchema>;

// Booking wizard types
export type ServiceCartItem = z.infer<typeof serviceCartItemSchema>;
export type StaffAssignmentMode = z.infer<typeof staffAssignmentModeSchema>;
export type ServiceStaffAssignment = z.infer<typeof serviceStaffAssignmentSchema>;
export type BookingData = z.infer<typeof bookingDataSchema>;
