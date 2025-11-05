import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useModal } from "@/hooks/use-modal";
import { ResponsiveModal } from "@/components/ui/modal";
import { ServiceBreakdownDetails } from "./service-breakdown-details";
import { useIsMobile } from "@/hooks/use-mobile";
import { useDetailedServices } from "@/features/core/hooks/queries/queries.dashboard-owner";
import { ProgressBar } from "./common/progress-bar";
import { getChartColor } from "@/features/core/constants/constants.dashboard-owner";

interface ServiceBreakdownItem {
   service: string;
   revenue: number;
   percentage: number;
   color: string;
}

interface ServiceBreakdownProps {
   services: ServiceBreakdownItem[];
}

export function ServiceBreakdown({ services }: ServiceBreakdownProps) {
   const isMobile = useIsMobile();
   const modal = useModal();
   const { data: detailedServices } = useDetailedServices();

   const CardWrapper = isMobile ? "button" : "div";
   const cardProps = isMobile
      ? {
           onClick: modal.open,
           className: "w-full text-left active:scale-[0.98] transition-transform",
        }
      : {};

   if (isMobile) {
      return (
         <>
            <CardWrapper {...cardProps}>
               <Card className="relative">
                  <ChevronRight className="absolute top-4 right-4 h-4 w-4 text-muted-foreground" />
                  <CardHeader className="pb-3">
                     <CardTitle className="text-sm font-semibold">Revenue by Service</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                     {services.map((service, idx) => (
                        <div key={service.service} className="space-y-1.5">
                           <div className="flex items-center justify-between text-xs">
                              <span className="font-medium truncate">{service.service}</span>
                              <div className="flex items-center gap-2">
                                 <span className="text-muted-foreground">${(service.revenue / 1000).toFixed(1)}k</span>
                                 <span className="font-bold">{service.percentage}%</span>
                              </div>
                           </div>
                           <ProgressBar value={service.percentage} size="sm" color="custom" customColor={getChartColor(idx)} />
                        </div>
                     ))}
                  </CardContent>
               </Card>
            </CardWrapper>

            <ResponsiveModal open={modal.isOpen} onOpenChange={modal.setIsOpen} title="Revenue by Service">
               {detailedServices && <ServiceBreakdownDetails services={detailedServices} />}
            </ResponsiveModal>
         </>
      );
   }

   return (
      <>
         <Card>
            <CardHeader>
               <CardTitle className="text-base font-semibold">Top Services</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                  {services.map((service, idx) => (
                     <div key={service.service}>
                        <div className="flex items-center justify-between mb-2">
                           <span className="text-sm font-medium truncate">{service.service}</span>
                           <span className="text-sm font-bold">{service.percentage}%</span>
                        </div>
                        <ProgressBar value={service.percentage} size="md" color="custom" customColor={getChartColor(idx)} />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                           <span>${(service.revenue / 1000).toFixed(1)}k revenue</span>
                        </div>
                     </div>
                  ))}
               </div>
            </CardContent>
            <div className="px-6 pb-4">
               <Button variant="outline" size="sm" className="w-full" onClick={modal.open}>
                  View All Services
                  <ChevronRight className="h-4 w-4 ml-1" />
               </Button>
            </div>
         </Card>

         <ResponsiveModal open={modal.isOpen} onOpenChange={modal.setIsOpen} title="Revenue by Service">
            {detailedServices && <ServiceBreakdownDetails services={detailedServices} />}
         </ResponsiveModal>
      </>
   );
}
