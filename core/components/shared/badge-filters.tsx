import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export interface BadgeFilter<T extends string = string> {
  value: T;
  label: string;
  count?: number;
  color?: string;
}

interface BadgeFiltersProps<T extends string> {
  filters: BadgeFilter<T>[];
  selectedValue: T;
  onSelect: (value: T) => void;
  className?: string;
}

export function BadgeFilters<T extends string>({
  filters,
  selectedValue,
  onSelect,
  className,
}: BadgeFiltersProps<T>) {
  const getFilterColor = (filter: BadgeFilter<T>) => {
    if (!filter.color) return "";
    return filter.color;
  };

  return (
    <div className={cn("flex items-center gap-1.5 flex-wrap", className)}>
      {filters.map((filter) => (
        <Button
          key={filter.value}
          variant={selectedValue === filter.value ? "default" : "outline"}
          size="sm"
          onClick={() => onSelect(filter.value)}
          className={cn(
            "h-8 text-xs border-2",
            selectedValue !== filter.value && getFilterColor(filter)
          )}
        >
          {filter.label}
          {filter.count !== undefined && ` (${filter.count})`}
        </Button>
      ))}
    </div>
  );
}

interface SearchWithBadgeFiltersProps<T extends string> {
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filters: BadgeFilter<T>[];
  selectedValue: T;
  onFilterSelect: (value: T) => void;
  className?: string;
}

export function SearchWithBadgeFilters<T extends string>({
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
  filters,
  selectedValue,
  onFilterSelect,
  className,
}: SearchWithBadgeFiltersProps<T>) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <BadgeFilters
        filters={filters}
        selectedValue={selectedValue}
        onSelect={onFilterSelect}
      />
    </div>
  );
}
