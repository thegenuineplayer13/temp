import { useFrontDeskStore } from "@/features/core/store/store.front-desk";
import { useServices } from "@/features/core/hooks/queries/queries.services";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, DollarSign } from "lucide-react";
import * as LucideIcons from "lucide-react";
import type { ServiceCartItem } from "@/features/core/types/types.dashboard-front-desk";

export function CreateAppointmentStepServices() {
   const { bookingData, addServiceToCart, removeServiceFromCart } = useFrontDeskStore();
   const { data: services = [] } = useServices();

   const handleToggleService = (service: typeof services[0], checked: boolean) => {
      if (checked) {
         const cartItem: ServiceCartItem = {
            serviceId: service.id,
            serviceName: service.name,
            duration: service.duration || 30,
            price: service.price,
            color: service.color,
            icon: service.icon,
         };
         addServiceToCart(cartItem);
      } else {
         removeServiceFromCart(service.id);
      }
   };

   const isServiceSelected = (serviceId: string) => {
      return bookingData.serviceCart.some((item) => item.serviceId === serviceId);
   };

   const getIcon = (iconName: string) => {
      const Icon = (LucideIcons as any)[iconName];
      return Icon ? <Icon className="h-5 w-5" /> : null;
   };

   return (
      <div className="space-y-3">
         <p className="text-sm text-muted-foreground">
            Select one or more services for this appointment
         </p>

         <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-2">
               {services.map((service) => {
                  const selected = isServiceSelected(service.id);

                  return (
                     <label
                        key={service.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all hover:bg-accent ${
                           selected ? "border-primary bg-primary/5" : "border-border"
                        }`}
                     >
                        <Checkbox
                           checked={selected}
                           onCheckedChange={(checked) => handleToggleService(service, checked as boolean)}
                        />

                        <div className={`p-2 rounded-md bg-${service.color}-500/10 shrink-0`}>
                           {getIcon(service.icon)}
                        </div>

                        <div className="flex-1 min-w-0">
                           <div className="font-medium">{service.name}</div>
                           {service.description && (
                              <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                 {service.description}
                              </div>
                           )}
                        </div>

                        <div className="flex flex-col items-end gap-1 shrink-0 text-sm">
                           <div className="flex items-center gap-1 font-medium">
                              <DollarSign className="h-3.5 w-3.5" />
                              {service.price}
                           </div>
                           <div className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="h-3.5 w-3.5" />
                              {service.duration || 30}min
                           </div>
                        </div>
                     </label>
                  );
               })}
            </div>
         </ScrollArea>

         {bookingData.serviceCart.length > 0 && (
            <div className="text-sm text-center text-muted-foreground pt-2">
               {bookingData.serviceCart.length} service{bookingData.serviceCart.length > 1 ? "s" : ""} selected
            </div>
         )}
      </div>
   );
}
