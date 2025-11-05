import { useQuery } from "@/mock/mock-react-query";
import { employeeSchema } from "@/features/core/schemas/schemas.staff";
import type { Employee } from "@/features/core/types/types.staff";
import { mockEmployees } from "@/mock/staff-mock";

export const QUERY_KEYS = {
  employees: ["employees"],
  employee: (id: string) => ["employee", id],
} satisfies Record<string, readonly string[] | ((id: string) => readonly string[])>;

export function useEmployees() {
  return useQuery<Employee[]>({
    queryKey: QUERY_KEYS.employees,
    queryFn: () => {
      const validated = mockEmployees.map((employee) => employeeSchema.parse(employee));
      return validated;
    },
  });
}

export function useEmployee(id: string) {
  const { data: employees } = useEmployees();

  return useQuery<Employee | undefined>({
    queryKey: QUERY_KEYS.employee(id),
    queryFn: () => {
      if (!employees) return undefined;
      return employees.find((emp) => emp.id === id);
    },
    enabled: !!employees && !!id,
  });
}
