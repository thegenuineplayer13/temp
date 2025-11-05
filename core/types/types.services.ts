import type z from "zod";
import type {
  iconNameSchema,
  colorSchema,
  specializationSchema,
  serviceSchema,
  serviceRelationshipSchema,
  specializationFormSchema,
  serviceFormSchema,
} from "../schemas/schemas.services";

export type IconName = z.infer<typeof iconNameSchema>;
export type Color = z.infer<typeof colorSchema>;
export type Specialization = z.infer<typeof specializationSchema>;
export type Service = z.infer<typeof serviceSchema>;
export type ServiceRelationship = z.infer<typeof serviceRelationshipSchema>;
export type SpecializationForm = z.infer<typeof specializationFormSchema>;
export type ServiceForm = z.infer<typeof serviceFormSchema>;
