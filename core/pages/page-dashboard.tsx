import { useDocumentTitle } from "@/hooks/use-route";
import { OwnerDashboard } from "@/features/core/pwa/dashboard/dashboard-owner";
import EmployeeDashboard from "../pwa/dashboard/dashboard-employee";
import FrontDeskDashboard from "../pwa/dashboard/dashboard-front-desk";
import ManagerDashboard from "../pwa/dashboard/dashboard-manager";
import { useAuthStore } from "@/stores/useAuthStore";

export default function Dashboard() {
   useDocumentTitle();

   const role = useAuthStore((state) => state.user?.role);

   if (role === "owner") return <OwnerDashboard />;
   if (role === "admin") return <ManagerDashboard />;
   if (role === "staff") return <FrontDeskDashboard />;
   return <EmployeeDashboard />;
}
