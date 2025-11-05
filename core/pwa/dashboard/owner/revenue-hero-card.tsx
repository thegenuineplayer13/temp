import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
import type { RevenueData } from "@/features/core/types/types.dashboard-owner";
import { TrendIndicator } from "./common/trend-indicator";

interface RevenueHeroCardProps {
   data: RevenueData;
}

export function RevenueHeroCard({ data }: RevenueHeroCardProps) {
   const isMobile = useIsMobile();

   if (isMobile) {
      return (
         <Card className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-background">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />
            <CardHeader className="pb-3 relative">
               <div className="flex items-center justify-between mb-4">
                  <div className="rounded-full bg-primary/10 p-2.5">
                     <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <Badge variant="secondary" className="font-semibold">
                     Today
                  </Badge>
               </div>
               <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Revenue</p>
                  <div className="flex items-end gap-3">
                     <p className="text-5xl font-bold tracking-tight">${(data.today / 1000).toFixed(1)}k</p>
                     <div className="mb-1">
                        <TrendIndicator trend={data.trend} value={data.percentageChange} />
                     </div>
                  </div>
               </div>
            </CardHeader>
            <CardContent className="relative">
               <div className="h-20 -mx-6 -mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={data.chartData}>
                        <defs>
                           <linearGradient id="mobileRevenue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                           </linearGradient>
                        </defs>
                        <Area
                           type="monotone"
                           dataKey="revenue"
                           stroke="var(--primary)"
                           strokeWidth={3}
                           fill="url(#mobileRevenue)"
                        />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
               <div className="grid grid-cols-3 gap-4 pt-4 mt-2 border-t">
                  <div>
                     <p className="text-xs text-muted-foreground">Yesterday</p>
                     <p className="text-sm font-bold">${(data.yesterday / 1000).toFixed(1)}k</p>
                  </div>
                  <div>
                     <p className="text-xs text-muted-foreground">This Week</p>
                     <p className="text-sm font-bold">${(data.thisWeek / 1000).toFixed(1)}k</p>
                  </div>
                  <div>
                     <p className="text-xs text-muted-foreground">Avg/Day</p>
                     <p className="text-sm font-bold">${(data.weekAverage / 1000).toFixed(1)}k</p>
                  </div>
               </div>
            </CardContent>
         </Card>
      );
   }

   return (
      <Card className="col-span-5 relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-background">
         <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32" />
         <CardHeader className="relative">
            <div className="flex items-center justify-between mb-2">
               <div className="rounded-lg bg-primary/10 p-3">
                  <DollarSign className="h-6 w-6 text-primary" />
               </div>
               <Badge variant="secondary" className="font-semibold">
                  Live
               </Badge>
            </div>
            <p className="text-sm font-medium text-muted-foreground">Revenue Today</p>
            <div className="flex items-end gap-4 mt-2">
               <p className="text-6xl font-bold tracking-tight">${(data.today / 1000).toFixed(1)}k</p>
               <div className="mb-2">
                  <TrendIndicator trend={data.trend} value={data.percentageChange} size="lg" />
               </div>
            </div>
         </CardHeader>
         <CardContent className="relative">
            <div className="h-32 -mx-6 -mb-6">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.chartData}>
                     {/* chartData.slice(-DISPLAY_LIMITS.MOBILE_CHART_DAYS) */}
                     <defs>
                        <linearGradient id="desktopRevenue" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                           <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                        </linearGradient>
                     </defs>
                     <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="var(--primary)"
                        strokeWidth={3}
                        fill="url(#desktopRevenue)"
                     />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </CardContent>
      </Card>
   );
}
