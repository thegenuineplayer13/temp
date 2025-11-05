import type z from "zod";
import type {
  employeeStatusSchema,
  employeeRoleSchema,
  employeeSchema,
  employeeFormSchema,
} from "../schemas/schemas.staff";

export type EmployeeStatus = z.infer<typeof employeeStatusSchema>;
export type EmployeeRole = z.infer<typeof employeeRoleSchema>;
export type Employee = z.infer<typeof employeeSchema>;
export type EmployeeForm = z.infer<typeof employeeFormSchema>;
