import { useQuery } from "@/mock/mock-react-query";
import { employeeDashboardMock } from "@/mock/employee-dashboard-mock";
import type { EmployeeDashboardData } from "../../types/types.dashboard-employee";
import { employeeDashboardDataSchema } from "../../schemas/schemas.dashboard-employee";

export const EMPLOYEE_QUERY_KEYS = {
   dashboard: ["employee", "dashboard"],
   currentJob: ["employee", "currentJob"],
   appointments: ["employee", "appointments"],
   clientHistory: ["employee", "clientHistory"],
   todayStats: ["employee", "todayStats"],
} satisfies Record<string, readonly string[]>;

export function useEmployeeDashboard() {
   return useQuery<EmployeeDashboardData>({
      queryKey: EMPLOYEE_QUERY_KEYS.dashboard,
      queryFn: () => {
         const validated = employeeDashboardDataSchema.parse(employeeDashboardMock);
         return validated;
      },
   });
}
