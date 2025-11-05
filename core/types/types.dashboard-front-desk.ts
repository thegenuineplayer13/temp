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
} from "../schemas/schemas.dashboard-front-desk";

export type AppointmentStatus = z.infer<typeof appointmentStatusSchema>;
export type PaymentStatus = z.infer<typeof paymentStatusSchema>;
export type StaffStatus = z.infer<typeof staffStatusSchema>;
export type Appointment = z.infer<typeof appointmentSchema>;
export type Customer = z.infer<typeof customerSchema>;
export type Staff = z.infer<typeof staffSchema>;
export type WalkIn = z.infer<typeof walkInSchema>;
export type NewCustomer = z.infer<typeof newCustomerSchema>;
