import { Card, CardContent } from "@/components/ui/card";

interface ClientsStatsCardsProps {
  totalClients: number;
  registeredClients: number;
  walkInClients: number;
  averageSpending: number;
  formatCurrency: (amount: number) => string;
}

export function ClientsStatsCards({
  totalClients,
  registeredClients,
  walkInClients,
  averageSpending,
  formatCurrency,
}: ClientsStatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardContent className="pt-6">
          <div className="text-sm text-muted-foreground">Total Clients</div>
          <div className="text-2xl font-semibold mt-2">{totalClients}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-sm text-muted-foreground">Registered</div>
          <div className="text-2xl font-semibold mt-2">{registeredClients}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-sm text-muted-foreground">Walk-in</div>
          <div className="text-2xl font-semibold mt-2">{walkInClients}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-sm text-muted-foreground">Avg Spending</div>
          <div className="text-2xl font-semibold mt-2">{formatCurrency(averageSpending)}</div>
        </CardContent>
      </Card>
    </div>
  );
}
