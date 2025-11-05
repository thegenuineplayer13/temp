import { z } from "zod";

export const themeSchema = z.enum(["light", "dark", "system"]);

export const languageSchema = z.enum(["en", "es", "fr", "de"]);

export const businessTypeSchema = z.enum(["salon", "barbershop", "spa", "clinic", "gym", "restaurant", "other"]);

export const workingHoursSchema = z.object({
   start: z.string(),
   end: z.string(),
});

export const notificationsSchema = z.object({
   email: z.boolean(),
   sms: z.boolean(),
   push: z.boolean(),
   marketing: z.boolean(),
});

export const appearanceSchema = z.object({
   theme: themeSchema,
   language: languageSchema,
});

export const securitySchema = z.object({
   twoFactor: z.boolean(),
});

export const profileSchema = z.object({
   firstName: z.string().min(1, "First name is required"),
   lastName: z.string().min(1, "Last name is required"),
   email: z.string().email("Invalid email format"),
   phone: z.string().min(1, "Phone is required"),
   bio: z.string().optional(),
   businessName: z.string().min(1, "Business name is required"),
   businessType: businessTypeSchema,
   address: z.string().min(1, "Address is required"),
   workingHours: workingHoursSchema,
   businessDescription: z.string().optional(),
   notifications: notificationsSchema,
   appearance: appearanceSchema,
   security: securitySchema,
});

export const businessTypeOptionSchema = z.object({
   value: z.string(),
   label: z.string(),
});
