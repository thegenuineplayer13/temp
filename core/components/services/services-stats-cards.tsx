import { Card, CardContent } from "@/components/ui/card";

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
        <CardContent className="pt-6">
          <div className="text-sm text-muted-foreground">Total Specializations</div>
          <div className="text-2xl font-semibold mt-2">{totalSpecializations}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-sm text-muted-foreground">Total Services</div>
          <div className="text-2xl font-semibold mt-2">{totalServices}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-sm text-muted-foreground">Avg Price</div>
          <div className="text-2xl font-semibold mt-2">${avgPrice}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-sm text-muted-foreground">Avg Duration</div>
          <div className="text-2xl font-semibold mt-2">{avgDuration}m</div>
        </CardContent>
      </Card>
    </div>
  );
}
