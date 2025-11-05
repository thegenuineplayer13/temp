import { z } from "zod";

// Icon names from lucide-react
export const iconNameSchema = z.enum([
  "Scissors",
  "Palette",
  "Wrench",
  "Sparkles",
  "Car",
  "Zap",
  "Droplet",
  "Wind",
  "Heart",
  "Star",
  "Circle",
  "Square",
  "Triangle",
  "Home",
  "User",
  "Settings",
]);

// Color options
export const colorSchema = z.enum([
  "blue",
  "green",
  "purple",
  "orange",
  "pink",
  "red",
  "yellow",
  "indigo",
  "teal",
  "cyan",
]);

// Specialization schema
export const specializationSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  icon: iconNameSchema,
  color: colorSchema,
});

// Service schema
export const serviceSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  price: z.number().min(0, "Price must be positive"),
  duration: z.number().min(1, "Duration must be at least 1 minute").optional(),
  icon: iconNameSchema,
  color: colorSchema,
  description: z.string().optional(),
});

// Relationship between specializations and services
export const serviceRelationshipSchema = z.record(z.string(), z.array(z.string()));

// Form data schemas for create/edit
export const specializationFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  icon: iconNameSchema,
  color: colorSchema,
});

export const serviceFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().min(0, "Price must be positive"),
  duration: z.number().min(1, "Duration must be at least 1 minute").optional(),
  icon: iconNameSchema,
  color: colorSchema,
  description: z.string().optional(),
});
