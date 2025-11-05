import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserPlus, DollarSign } from "lucide-react";

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
        <CardHeader className="pb-3">
          <CardDescription className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            Total Clients
          </CardDescription>
          <CardTitle className="text-3xl">{totalClients}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardDescription className="flex items-center gap-1">
            <UserCheck className="h-3 w-3" />
            Registered
          </CardDescription>
          <CardTitle className="text-3xl">{registeredClients}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardDescription className="flex items-center gap-1">
            <UserPlus className="h-3 w-3" />
            Walk-in
          </CardDescription>
          <CardTitle className="text-3xl">{walkInClients}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardDescription className="flex items-center gap-1">
            <DollarSign className="h-3 w-3" />
            Avg Spending
          </CardDescription>
          <CardTitle className="text-3xl">{formatCurrency(averageSpending)}</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
