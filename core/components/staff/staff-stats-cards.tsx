import { Card, CardContent } from "@/components/ui/card";

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
        <CardContent className="pt-6">
          <div className="text-sm text-muted-foreground">Total Employees</div>
          <div className="text-2xl font-semibold mt-2">{totalEmployees}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-sm text-muted-foreground">Active</div>
          <div className="text-2xl font-semibold mt-2">{activeEmployees}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-sm text-muted-foreground">On Leave</div>
          <div className="text-2xl font-semibold mt-2">{onLeaveEmployees}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-sm text-muted-foreground">Inactive</div>
          <div className="text-2xl font-semibold mt-2">{inactiveEmployees}</div>
        </CardContent>
      </Card>
    </div>
  );
}
