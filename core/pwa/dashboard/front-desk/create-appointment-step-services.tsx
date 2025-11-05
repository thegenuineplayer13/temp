import { useState } from "react";
import { useFrontDeskStore } from "@/features/core/store/store.front-desk";
import { useServices } from "@/features/core/hooks/queries/queries.services";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Trash2, Clock, DollarSign, ShoppingCart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import * as LucideIcons from "lucide-react";
import type { ServiceCartItem } from "@/features/core/types/types.dashboard-front-desk";

export function CreateAppointmentStepServices() {
   const { bookingData, addServiceToCart, removeServiceFromCart } = useFrontDeskStore();
   const { data: services = [] } = useServices();
   const [searchQuery, setSearchQuery] = useState("");

   const filteredServices = services.filter((service) =>
      service.name.toLowerCase().includes(searchQuery.toLowerCase()),
   );

   const handleAddService = (service: typeof services[0]) => {
      // Check if service is already in cart
      if (bookingData.serviceCart.some((item) => item.serviceId === service.id)) {
         return; // Don't add duplicates
      }

      const cartItem: ServiceCartItem = {
         serviceId: service.id,
         serviceName: service.name,
         duration: service.duration || 30,
         price: service.price,
         color: service.color,
         icon: service.icon,
      };

      addServiceToCart(cartItem);
   };

   const handleRemoveService = (serviceId: string) => {
      removeServiceFromCart(serviceId);
   };

   const getIcon = (iconName: string) => {
      const Icon = (LucideIcons as any)[iconName];
      return Icon ? <Icon className="h-4 w-4" /> : null;
   };

   return (
      <div className="space-y-4">
         {/* Search bar */}
         <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
               placeholder="Search services..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="pl-10"
            />
         </div>

         {/* Service Cart */}
         {bookingData.serviceCart.length > 0 && (
            <Card className="p-4 bg-primary/5 border-primary/20">
               <div className="space-y-3">
                  <div className="flex items-center gap-2">
                     <ShoppingCart className="h-4 w-4 text-primary" />
                     <span className="font-semibold">Selected Services ({bookingData.serviceCart.length})</span>
                  </div>

                  <div className="space-y-2">
                     {bookingData.serviceCart.map((item) => (
                        <div key={item.serviceId} className="flex items-center gap-2 p-2 bg-background rounded-md">
                           <div className={`p-2 rounded-md bg-${item.color}-500/10`}>{getIcon(item.icon)}</div>
                           <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{item.serviceName}</p>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                 <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {item.duration}min
                                 </span>
                                 <span className="flex items-center gap-1">
                                    <DollarSign className="h-3 w-3" />
                                    {item.price}
                                 </span>
                              </div>
                           </div>
                           <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveService(item.serviceId)}
                              className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                           >
                              <Trash2 className="h-4 w-4" />
                           </Button>
                        </div>
                     ))}
                  </div>

                  <Separator />

                  {/* Cart summary */}
                  <div className="flex items-center justify-between text-sm font-semibold">
                     <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Total: {bookingData.totalDuration} min</span>
                     </div>
                     <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span>Total: ${bookingData.totalPrice}</span>
                     </div>
                  </div>
               </div>
            </Card>
         )}

         {/* Available services list */}
         <ScrollArea className="h-[300px] border rounded-md">
            <div className="p-2 space-y-2">
               {filteredServices.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                     <p>No services found</p>
                     <p className="text-sm mt-1">Try adjusting your search</p>
                  </div>
               ) : (
                  filteredServices.map((service) => {
                     const isInCart = bookingData.serviceCart.some((item) => item.serviceId === service.id);

                     return (
                        <Card
                           key={service.id}
                           className={`p-3 transition-colors ${
                              isInCart ? "bg-muted/50 opacity-60" : "hover:bg-accent cursor-pointer"
                           }`}
                        >
                           <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-md bg-${service.color}-500/10`}>{getIcon(service.icon)}</div>
                              <div className="flex-1 min-w-0">
                                 <div className="flex items-center gap-2">
                                    <span className="font-medium">{service.name}</span>
                                    {isInCart && (
                                       <Badge variant="secondary" className="text-xs">
                                          Added
                                       </Badge>
                                    )}
                                 </div>
                                 <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                       <Clock className="h-3 w-3" />
                                       {service.duration || 30}min
                                    </span>
                                    <span className="flex items-center gap-1">
                                       <DollarSign className="h-3 w-3" />
                                       {service.price}
                                    </span>
                                 </div>
                                 {service.description && (
                                    <p className="text-xs text-muted-foreground mt-1 truncate">{service.description}</p>
                                 )}
                              </div>
                              {!isInCart && (
                                 <Button size="sm" onClick={() => handleAddService(service)} className="shrink-0">
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add
                                 </Button>
                              )}
                           </div>
                        </Card>
                     );
                  })
               )}
            </div>
         </ScrollArea>

         {/* Help text */}
         <p className="text-xs text-muted-foreground text-center">
            {bookingData.serviceCart.length === 0
               ? "Add at least one service to continue"
               : "Add more services or click Next to continue"}
         </p>
      </div>
   );
}
