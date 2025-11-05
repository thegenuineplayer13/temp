import { z } from "zod";

// Employee status
export const employeeStatusSchema = z.enum(["active", "inactive", "on-leave"]);

// Employee role
export const employeeRoleSchema = z.enum(["owner", "admin", "staff", "employee"]);

// Employee schema
export const employeeSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(1, "Phone is required"),
  role: employeeRoleSchema,
  status: employeeStatusSchema,
  specializationIds: z.array(z.string()), // IDs of specializations
  avatar: z.string().optional(),
  hireDate: z.string(),
  salary: z.number().min(0).optional(),
  notes: z.string().optional(),
});

// Form data schema for create/edit
export const employeeFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(1, "Phone is required"),
  role: employeeRoleSchema,
  status: employeeStatusSchema,
  specializationIds: z.array(z.string()),
  avatar: z.string().optional(),
  hireDate: z.string(),
  salary: z.number().min(0).optional(),
  notes: z.string().optional(),
});
