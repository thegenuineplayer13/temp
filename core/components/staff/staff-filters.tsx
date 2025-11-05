import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BadgeFilters, type BadgeFilter } from "../shared/badge-filters";
import type { EmployeeStatus } from "@/features/core/types/types.staff";

interface StaffFiltersProps {
  selectedStatus: EmployeeStatus | "all";
  onStatusChange: (status: EmployeeStatus | "all") => void;
  totalEmployees: number;
  activeCount: number;
  onLeaveCount: number;
  inactiveCount: number;
}

export function StaffFilters({
  selectedStatus,
  onStatusChange,
  totalEmployees,
  activeCount,
  onLeaveCount,
  inactiveCount,
}: StaffFiltersProps) {
  const filters: BadgeFilter<EmployeeStatus | "all">[] = useMemo(
    () => [
      {
        value: "all",
        label: "All",
        count: totalEmployees,
      },
      {
        value: "active",
        label: "Active",
        count: activeCount,
        color: "!bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
      },
      {
        value: "on-leave",
        label: "On Leave",
        count: onLeaveCount,
        color: "!bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
      },
      {
        value: "inactive",
        label: "Inactive",
        count: inactiveCount,
        color: "!bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20",
      },
    ],
    [totalEmployees, activeCount, onLeaveCount, inactiveCount]
  );

  return (
    <Card>
      <CardContent className="pt-6">
        <BadgeFilters
          filters={filters}
          selectedValue={selectedStatus}
          onSelect={onStatusChange}
        />
      </CardContent>
    </Card>
  );
}
