import type z from "zod";
import type {
  clientTypeSchema,
  visitHistorySchema,
  clientSchema,
  clientFormSchema,
} from "../schemas/schemas.clients";

export type ClientType = z.infer<typeof clientTypeSchema>;
export type VisitHistory = z.infer<typeof visitHistorySchema>;
export type Client = z.infer<typeof clientSchema>;
export type ClientForm = z.infer<typeof clientFormSchema>;
