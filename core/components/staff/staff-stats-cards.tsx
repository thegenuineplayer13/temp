import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, Coffee, UserX } from "lucide-react";

interface StaffStatsCardsProps {
  totalEmployees: number;
  activeEmployees: number;
  onLeaveEmployees: number;
  inactiveEmployees: number;
}

export function StaffStatsCards({
  totalEmployees,
  activeEmployees,
  onLeaveEmployees,
  inactiveEmployees,
}: StaffStatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="pb-3">
          <CardDescription className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            Total Employees
          </CardDescription>
          <CardTitle className="text-3xl">{totalEmployees}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardDescription className="flex items-center gap-1">
            <UserCheck className="h-3 w-3" />
            Active
          </CardDescription>
          <CardTitle className="text-3xl">{activeEmployees}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardDescription className="flex items-center gap-1">
            <Coffee className="h-3 w-3" />
            On Leave
          </CardDescription>
          <CardTitle className="text-3xl">{onLeaveEmployees}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardDescription className="flex items-center gap-1">
            <UserX className="h-3 w-3" />
            Inactive
          </CardDescription>
          <CardTitle className="text-3xl">{inactiveEmployees}</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
