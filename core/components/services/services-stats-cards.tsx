import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Clock } from "lucide-react";

interface ServicesStatsCardsProps {
  totalSpecializations: number;
  totalServices: number;
  avgPrice: number;
  avgDuration: number;
}

export function ServicesStatsCards({
  totalSpecializations,
  totalServices,
  avgPrice,
  avgDuration,
}: ServicesStatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="pb-3">
          <CardDescription>Total Specializations</CardDescription>
          <CardTitle className="text-3xl">{totalSpecializations}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardDescription>Total Services</CardDescription>
          <CardTitle className="text-3xl">{totalServices}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardDescription className="flex items-center gap-1">
            <DollarSign className="h-3 w-3" />
            Avg Price
          </CardDescription>
          <CardTitle className="text-3xl">${avgPrice}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardDescription className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Avg Duration
          </CardDescription>
          <CardTitle className="text-3xl">{avgDuration}m</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
