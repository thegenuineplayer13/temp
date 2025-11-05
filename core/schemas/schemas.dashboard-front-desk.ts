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
   serviceId: z.string().optional(), // Reference to service in services collection
   startTime: z.string(),
   endTime: z.string(),
   duration: z.number(),
   price: z.number().optional(), // Service price at time of booking
   status: appointmentStatusSchema,
   paymentStatus: paymentStatusSchema,
   isNewClient: z.boolean().optional(),
   notes: z.string().optional(),
   bookingGroupId: z.string().optional(), // Links multiple appointments from same booking
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

// Booking wizard schemas
export const serviceCartItemSchema = z.object({
   serviceId: z.string(),
   serviceName: z.string(),
   duration: z.number(),
   price: z.number(),
   color: z.string(),
   icon: z.string(),
});

export const staffAssignmentModeSchema = z.enum(["single", "multiple", "auto"]);

export const serviceStaffAssignmentSchema = z.object({
   serviceId: z.string(),
   serviceName: z.string(),
   duration: z.number(),
   staffId: z.string().nullable(), // null means not yet assigned
   staffName: z.string().nullable(),
   startTime: z.string().nullable(), // ISO format, for parallel appointments
});

export const bookingDataSchema = z.object({
   // Step 1: Client
   clientId: z.string().nullable(),
   clientName: z.string().nullable(),
   clientPhone: z.string().nullable(),

   // Step 2: Services
   serviceCart: z.array(serviceCartItemSchema),
   totalDuration: z.number(),
   totalPrice: z.number(),

   // Step 3: Staff assignment mode
   assignmentMode: staffAssignmentModeSchema,
   singleStaffId: z.string().nullable(), // For single-employee mode
   singleStaffName: z.string().nullable(),
   serviceAssignments: z.array(serviceStaffAssignmentSchema), // For multiple-employee mode

   // Step 4: Date/Time
   selectedDate: z.string().nullable(), // ISO date string
   startTime: z.string().nullable(), // HH:MM format for sequential, or first appointment time

   // Step 5: Review
   notes: z.string().optional(),
   bookingGroupId: z.string(), // Pre-generated UUID for linking appointments
});
