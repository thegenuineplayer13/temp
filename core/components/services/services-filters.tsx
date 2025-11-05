import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BadgeFilters, type BadgeFilter } from "../shared/badge-filters";

interface ServicesFiltersProps {
  totalSpecializations: number;
  totalServices: number;
}

export function ServicesFilters({
  totalSpecializations,
  totalServices,
}: ServicesFiltersProps) {
  const filters: BadgeFilter<string>[] = useMemo(
    () => [
      {
        value: "overview",
        label: "Overview",
        count: totalSpecializations + totalServices,
      },
      {
        value: "specializations",
        label: "Specializations",
        count: totalSpecializations,
        color: "!bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      },
      {
        value: "services",
        label: "Services",
        count: totalServices,
        color: "!bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      },
    ],
    [totalSpecializations, totalServices]
  );

  return (
    <Card>
      <CardContent className="pt-6">
        <BadgeFilters
          filters={filters}
          selectedValue="overview"
          onSelect={() => {}}
        />
      </CardContent>
    </Card>
  );
}
