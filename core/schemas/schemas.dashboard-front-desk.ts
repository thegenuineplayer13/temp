import { z } from "zod";

export const appointmentStatusSchema = z.enum(["booked", "checked-in", "in-progress", "completed", "no-show", "cancelled"]);

export const paymentStatusSchema = z.enum(["pending", "paid", "partial"]);

export const staffStatusSchema = z.enum(["available", "busy", "break", "unavailable"]);

export const appointmentSchema = z.object({
   id: z.string(),
   customerId: z.string(),
   customerName: z.string(),
   customerPhone: z.string(),
   staffId: z.string(),
   staffName: z.string(),
   service: z.string(),
   startTime: z.string(),
   endTime: z.string(),
   duration: z.number(),
   status: appointmentStatusSchema,
   paymentStatus: paymentStatusSchema,
   isNewClient: z.boolean().optional(),
   notes: z.string().optional(),
});

export const customerSchema = z.object({
   id: z.string(),
   name: z.string(),
   phone: z.string(),
   email: z.string(),
   totalVisits: z.number(),
   lastVisit: z.string(),
   averageRating: z.number().min(0).max(5),
   preferredStaff: z.string().optional(),
   notes: z.string().optional(),
});

export const staffSchema = z.object({
   id: z.string(),
   name: z.string(),
   color: z.string(),
   status: staffStatusSchema,
   currentClient: z.string().optional(),
   currentService: z.string().optional(),
   finishesAt: z.string().optional(),
   nextAppointment: z.string().optional(),
});

export const walkInSchema = z.object({
   id: z.string(),
   customerName: z.string(),
   customerPhone: z.string(),
   requestedService: z.string(),
   arrivedAt: z.string(),
   estimatedWait: z.number(),
   preferredStaff: z.string().optional(),
   isNewClient: z.boolean().optional(),
});

export const newCustomerSchema = z.object({
   name: z.string().min(1, "Name is required"),
   phone: z
      .string()
      .min(1, "Phone is required")
      .regex(/^[\d\s\-\(\)]+$/, "Invalid phone format"),
   email: z.string().min(1, "Email is required").email("Invalid email format"),
   notes: z.string().optional(),
});
