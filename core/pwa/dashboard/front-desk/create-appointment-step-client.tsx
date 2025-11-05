import { useState } from "react";
import { useFrontDeskStore } from "@/features/core/store/store.front-desk";
import { useCustomers } from "@/features/core/hooks/queries/queries.dashboard-front-desk";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserPlus, Phone, Mail, User, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export function CreateAppointmentStepClient() {
   const { bookingData, updateBookingData } = useFrontDeskStore();
   const { data: customers = [] } = useCustomers();
   const [searchQuery, setSearchQuery] = useState("");

   const filteredCustomers = customers.filter(
      (customer) =>
         customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         customer.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
         customer.email.toLowerCase().includes(searchQuery.toLowerCase()),
   );

   const handleSelectClient = (clientId: string, clientName: string, clientPhone: string) => {
      updateBookingData({ clientId, clientName, clientPhone });
   };

   const selectedClient = customers.find((c) => c.id === bookingData.clientId);

   return (
      <div className="space-y-4">
         {/* Search bar */}
         <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
               placeholder="Search by name, phone, or email..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="pl-10"
            />
         </div>

         {/* Quick action - Register new client */}
         <Button variant="outline" className="w-full" onClick={() => {/* TODO: Open registration dialog */}}>
            <UserPlus className="h-4 w-4 mr-2" />
            Register New Client
         </Button>

         {/* Selected client preview */}
         {selectedClient && (
            <Card className="p-4 bg-primary/5 border-primary/20">
               <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                     <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-primary" />
                        <span className="font-semibold">{selectedClient.name}</span>
                        {selectedClient.totalVisits === 0 && (
                           <Badge variant="secondary" className="text-xs">
                              New Client
                           </Badge>
                        )}
                     </div>
                     <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                           <Phone className="h-3 w-3" />
                           {selectedClient.phone}
                        </div>
                        <div className="flex items-center gap-1">
                           <Mail className="h-3 w-3" />
                           {selectedClient.email}
                        </div>
                     </div>
                     <div className="flex items-center gap-1 text-sm">
                        <TrendingUp className="h-3 w-3 text-green-600" />
                        <span className="text-muted-foreground">{selectedClient.totalVisits} visits</span>
                     </div>
                  </div>
                  <Button
                     variant="ghost"
                     size="sm"
                     onClick={() => updateBookingData({ clientId: null, clientName: null, clientPhone: null })}
                  >
                     Change
                  </Button>
               </div>
            </Card>
         )}

         {/* Client list */}
         <ScrollArea className="h-[300px] border rounded-md">
            <div className="p-2 space-y-2">
               {filteredCustomers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                     <p>No clients found</p>
                     <p className="text-sm mt-1">Try adjusting your search or register a new client</p>
                  </div>
               ) : (
                  filteredCustomers.map((customer) => (
                     <Card
                        key={customer.id}
                        className={`p-3 cursor-pointer transition-colors hover:bg-accent ${
                           bookingData.clientId === customer.id ? "bg-primary/10 border-primary" : ""
                        }`}
                        onClick={() => handleSelectClient(customer.id, customer.name, customer.phone)}
                     >
                        <div className="flex items-start justify-between">
                           <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-2">
                                 <span className="font-medium">{customer.name}</span>
                                 {customer.totalVisits === 0 && (
                                    <Badge variant="secondary" className="text-xs">
                                       New
                                    </Badge>
                                 )}
                              </div>
                              <div className="text-sm text-muted-foreground flex items-center gap-3">
                                 <span className="flex items-center gap-1">
                                    <Phone className="h-3 w-3" />
                                    {customer.phone}
                                 </span>
                                 <span className="text-xs">{customer.totalVisits} visits</span>
                              </div>
                              {customer.notes && (
                                 <p className="text-xs text-muted-foreground italic truncate">{customer.notes}</p>
                              )}
                           </div>
                        </div>
                     </Card>
                  ))
               )}
            </div>
         </ScrollArea>

         {/* Help text */}
         <p className="text-xs text-muted-foreground text-center">
            Select a client to continue with the appointment booking
         </p>
      </div>
   );
}
