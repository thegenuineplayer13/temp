import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ChartDataPoint } from "@/features/core/types/types.dashboard-owner";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface RevenueTrendChartProps {
   chartData: ChartDataPoint[];
}

export function RevenueTrendChart({ chartData }: RevenueTrendChartProps) {
   return (
      <Card className="col-span-2">
         <CardHeader>
            <CardTitle className="text-base font-semibold">Revenue Trend (7 Days)</CardTitle>
         </CardHeader>
         <CardContent>
            <ResponsiveContainer width="100%" height={280}>
               <AreaChart data={chartData}>
                  <defs>
                     <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                     </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
                  <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} />
                  <Tooltip
                     contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                     }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={3} fill="url(#chartGradient)" />
               </AreaChart>
            </ResponsiveContainer>
         </CardContent>
      </Card>
   );
}
