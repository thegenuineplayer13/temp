import { z } from "zod";

// Client type
export const clientTypeSchema = z.enum(["registered", "walk-in"]);

// Visit history entry
export const visitHistorySchema = z.object({
  id: z.string(),
  date: z.string(),
  serviceId: z.string(), // ID of service
  serviceName: z.string(),
  staffId: z.string().optional(),
  staffName: z.string().optional(),
  amount: z.number().min(0),
  duration: z.number().min(0),
  rating: z.number().min(0).max(5).optional(),
  notes: z.string().optional(),
});

// Client schema
export const clientSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  phone: z.string().min(1, "Phone is required"),
  type: clientTypeSchema,
  totalVisits: z.number().min(0),
  lastVisit: z.string().optional(),
  lastServiceId: z.string().optional(), // ID of last service
  lastServiceName: z.string().optional(),
  totalSpent: z.number().min(0),
  averageRating: z.number().min(0).max(5),
  preferences: z.array(z.string()),
  specialNotes: z.array(z.string()),
  pastIssues: z.array(z.string()),
  visitHistory: z.array(visitHistorySchema).optional(),
  registeredDate: z.string().optional(),
  birthday: z.string().optional(),
  address: z.string().optional(),
});

// Form data schema for create/edit
export const clientFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  phone: z.string().min(1, "Phone is required"),
  type: clientTypeSchema,
  preferences: z.array(z.string()),
  specialNotes: z.array(z.string()),
  birthday: z.string().optional(),
  address: z.string().optional(),
});
