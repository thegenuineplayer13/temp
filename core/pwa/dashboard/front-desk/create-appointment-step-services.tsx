import { useFrontDeskStore } from "@/features/core/store/store.front-desk";
import { useServices } from "@/features/core/hooks/queries/queries.services";
import { Checkbox } from "@/components/ui/checkbox";
import { IconBadge } from "@/features/core/components/shared/icon-badge";
import { cn } from "@/lib/utils";
import type { ServiceCartItem } from "@/features/core/types/types.dashboard-front-desk";

export function CreateAppointmentStepServices() {
   const { bookingData, addServiceToCart, removeServiceFromCart } = useFrontDeskStore();
   const { data: services = [] } = useServices();

   const handleToggleService = (service: typeof services[0]) => {
      const selected = isServiceSelected(service.id);
      if (!selected) {
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

   return (
      <div className="space-y-4">
         <div className="max-h-[450px] overflow-y-auto -mx-6 px-6">
            <div className="space-y-1.5">
               {services.map((service) => {
                  const selected = isServiceSelected(service.id);

                  return (
                     <div
                        key={service.id}
                        className={cn(
                           "group relative flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition-all cursor-pointer",
                           selected
                              ? "bg-accent border-foreground/20 shadow-sm"
                              : "hover:bg-accent/50 border-transparent"
                        )}
                        onClick={() => handleToggleService(service)}
                     >
                        <Checkbox
                           checked={selected}
                           onCheckedChange={() => handleToggleService(service)}
                           onClick={(e) => e.stopPropagation()}
                        />

                        <IconBadge icon={service.icon} color={service.color} size="md" />

                        <div className="flex-1 min-w-0">
                           <p className="font-medium leading-none">{service.name}</p>
                           <p className="text-xs text-muted-foreground mt-1">
                              ${service.price.toFixed(2)}
                              {service.duration && ` • ${service.duration}min`}
                           </p>
                        </div>
                     </div>
                  );
               })}
            </div>
         </div>

         {bookingData.serviceCart.length > 0 && (
            <div className="text-sm text-center text-muted-foreground">
               {bookingData.serviceCart.length} service{bookingData.serviceCart.length > 1 ? "s" : ""} selected
            </div>
         )}
      </div>
   );
}
