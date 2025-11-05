import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { SearchWithBadgeFilters, type BadgeFilter } from "../shared/badge-filters";
import { useClientsStore } from "@/features/core/store/store.clients";

interface ClientsFiltersProps {
  totalClients: number;
  registeredCount: number;
  walkInCount: number;
}

export function ClientsFilters({
  totalClients,
  registeredCount,
  walkInCount,
}: ClientsFiltersProps) {
  const store = useClientsStore();

  const filters: BadgeFilter<"all" | "registered" | "walk-in">[] = useMemo(
    () => [
      {
        value: "all",
        label: "All",
        count: totalClients,
      },
      {
        value: "registered",
        label: "Registered",
        count: registeredCount,
        color: "!bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
      },
      {
        value: "walk-in",
        label: "Walk-in",
        count: walkInCount,
        color: "!bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      },
    ],
    [totalClients, registeredCount, walkInCount]
  );

  return (
    <Card>
      <CardContent className="pt-6">
        <SearchWithBadgeFilters
          searchPlaceholder="Search by name, phone, or email..."
          searchValue={store.searchQuery}
          onSearchChange={(value) => {
            store.setSearchQuery(value);
            store.setCurrentPage(1);
          }}
          filters={filters}
          selectedValue={store.filterType}
          onFilterSelect={(value) => {
            store.setFilterType(value);
            store.setCurrentPage(1);
          }}
        />
      </CardContent>
    </Card>
  );
}
