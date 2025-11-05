import type z from "zod";
import type {
   themeSchema,
   languageSchema,
   businessTypeSchema,
   workingHoursSchema,
   notificationsSchema,
   appearanceSchema,
   securitySchema,
   profileSchema,
   businessTypeOptionSchema,
} from "../schemas/schemas.settings";

export type Theme = z.infer<typeof themeSchema>;
export type Language = z.infer<typeof languageSchema>;
export type BusinessType = z.infer<typeof businessTypeSchema>;
export type WorkingHours = z.infer<typeof workingHoursSchema>;
export type Notifications = z.infer<typeof notificationsSchema>;
export type Appearance = z.infer<typeof appearanceSchema>;
export type Security = z.infer<typeof securitySchema>;
export type Profile = z.infer<typeof profileSchema>;
export type BusinessTypeOption = z.infer<typeof businessTypeOptionSchema>;
