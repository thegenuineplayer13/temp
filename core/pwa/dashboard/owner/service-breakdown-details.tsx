import { TrendingUp, TrendingDown, Users, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Service } from "@/features/core/types/types.dashboard-owner";
import { ProgressBar } from "./common/progress-bar";
import { getChartColor } from "@/features/core/constants/constants.dashboard-owner";

interface ServiceBreakdownDetailsProps {
   services: Service[];
}

export function ServiceBreakdownDetails({ services }: ServiceBreakdownDetailsProps) {
   const isMobile = useIsMobile();

   if (isMobile) {
      return (
         <div className="p-4 space-y-3">
            {services.map((service, idx) => (
               <div key={service.id} className="p-4 rounded-lg border bg-card space-y-3">
                  <div className="space-y-2">
                     <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-sm">{service.name}</h3>
                        <div
                           className={cn(
                              "flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md",
                              service.growth >= 0
                                 ? "bg-green-500/10 text-green-600 dark:text-green-500"
                                 : "bg-red-500/10 text-red-600 dark:text-red-500"
                           )}
                        >
                           {service.growth >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                           {Math.abs(service.growth)}%
                        </div>
                     </div>

                     <ProgressBar value={service.percentage} size="sm" color="custom" customColor={getChartColor(idx)} />

                     <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{service.percentage}% of revenue</span>
                        <span className="font-bold">${(service.revenue / 1000).toFixed(1)}k</span>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                     <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                           <Users className="h-3.5 w-3.5" />
                           <span className="text-xs">Bookings</span>
                        </div>
                        <p className="text-lg font-bold">{service.bookings}</p>
                        <p className="text-xs text-muted-foreground">{service.popularWith}</p>
                     </div>

                     <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                           <DollarSign className="h-3.5 w-3.5" />
                           <span className="text-xs">Avg Price</span>
                        </div>
                        <p className="text-lg font-bold">${service.avgPrice.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">Per booking</p>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      );
   }

   return (
      <div className="space-y-3 p-2">
         {services.map((service, idx) => (
            <div key={service.id} className="p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
               <div className="flex items-center gap-4">
                  <div className="w-1 h-16 rounded-full" style={{ backgroundColor: getChartColor(idx) }} />

                  <div className="flex-1 grid grid-cols-6 gap-4 items-center">
                     <div className="col-span-2">
                        <h3 className="font-semibold">{service.name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{service.popularWith}</p>
                     </div>

                     <div className="text-center">
                        <p className="text-xs text-muted-foreground mb-1">Revenue</p>
                        <p className="text-xl font-bold">${(service.revenue / 1000).toFixed(1)}k</p>
                        <p className="text-xs text-muted-foreground">{service.percentage}%</p>
                     </div>

                     <div className="text-center">
                        <p className="text-xs text-muted-foreground mb-1">Bookings</p>
                        <p className="text-xl font-bold">{service.bookings}</p>
                     </div>

                     <div className="text-center">
                        <p className="text-xs text-muted-foreground mb-1">Avg Price</p>
                        <p className="text-xl font-bold">${service.avgPrice.toFixed(0)}</p>
                     </div>

                     <div className="text-center">
                        <p className="text-xs text-muted-foreground mb-1">Growth</p>
                        <div
                           className={cn(
                              "inline-flex items-center gap-1 text-sm font-semibold px-2.5 py-1 rounded-md",
                              service.growth >= 0
                                 ? "bg-green-500/10 text-green-600 dark:text-green-500"
                                 : "bg-red-500/10 text-red-600 dark:text-red-500"
                           )}
                        >
                           {service.growth >= 0 ? (
                              <TrendingUp className="h-3.5 w-3.5" />
                           ) : (
                              <TrendingDown className="h-3.5 w-3.5" />
                           )}
                           {Math.abs(service.growth)}%
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         ))}
      </div>
   );
}
