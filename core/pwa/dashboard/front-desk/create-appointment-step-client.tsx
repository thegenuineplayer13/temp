import { useState, useEffect, useRef } from "react";
import { useFrontDeskStore } from "@/features/core/store/store.front-desk";
import { useCustomers } from "@/features/core/hooks/queries/queries.dashboard-front-desk";
import { Input } from "@/components/ui/input";
import { Search, User, Phone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function CreateAppointmentStepClient() {
   const { bookingData, updateBookingData } = useFrontDeskStore();
   const { data: customers = [] } = useCustomers();
   const [searchQuery, setSearchQuery] = useState("");
   const [suggestions, setSuggestions] = useState(customers);
   const [showSuggestions, setShowSuggestions] = useState(false);
   const [highlightedIndex, setHighlightedIndex] = useState(-1);
   const searchRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      if (searchQuery.trim().length > 0) {
         const filtered = customers.filter(
            (customer) =>
               customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
               customer.phone.includes(searchQuery) ||
               customer.email.toLowerCase().includes(searchQuery.toLowerCase())
         );
         setSuggestions(filtered);
         setShowSuggestions(true);
         setHighlightedIndex(-1);
      } else {
         setSuggestions(customers);
         setShowSuggestions(false);
      }
   }, [searchQuery, customers]);

   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
            setShowSuggestions(false);
         }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
   }, []);

   const handleKeyDown = (e: React.KeyboardEvent) => {
      if (!showSuggestions || suggestions.length === 0) return;

      if (e.key === "ArrowDown") {
         e.preventDefault();
         setHighlightedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
      } else if (e.key === "ArrowUp") {
         e.preventDefault();
         setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
      } else if (e.key === "Enter" && highlightedIndex >= 0) {
         e.preventDefault();
         handleSelectClient(suggestions[highlightedIndex]);
      } else if (e.key === "Escape") {
         setShowSuggestions(false);
      }
   };

   const handleSelectClient = (customer: typeof customers[0]) => {
      updateBookingData({ clientId: customer.id, clientName: customer.name, clientPhone: customer.phone });
      setSearchQuery("");
      setShowSuggestions(false);
   };

   const selectedClient = customers.find((c) => c.id === bookingData.clientId);

   return (
      <div className="space-y-4 flex flex-col h-full">
         <div className="text-center space-y-2">
            <h3 className="font-semibold text-lg">Who is this appointment for?</h3>
            <p className="text-sm text-muted-foreground">Search for an existing client or register a new one</p>
         </div>

         {/* Selected client - always on top if selected */}
         {selectedClient && (
            <Card className="p-4 bg-primary/5 border-primary/20">
               <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                     <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                           <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                           <div className="flex items-center gap-2">
                              <span className="font-semibold">{selectedClient.name}</span>
                              {selectedClient.totalVisits === 0 && (
                                 <Badge variant="secondary" className="text-xs">
                                    New Client
                                 </Badge>
                              )}
                           </div>
                           <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                              <Phone className="h-3 w-3" />
                              <span>{selectedClient.phone}</span>
                              <span className="text-[10px]">•</span>
                              <span>{selectedClient.totalVisits} visits</span>
                           </div>
                        </div>
                     </div>
                  </div>
                  <button
                     onClick={() => {
                        updateBookingData({ clientId: null, clientName: null, clientPhone: null });
                        setSearchQuery("");
                     }}
                     className="text-sm text-primary hover:underline flex-shrink-0"
                  >
                     Change
                  </button>
               </div>
            </Card>
         )}

         {/* Search bar - always visible */}
         <div ref={searchRef} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
            <Input
               type="text"
               placeholder="Search by name, phone, or email..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               onKeyDown={handleKeyDown}
               onFocus={() => setShowSuggestions(true)}
               className="pl-10 pr-4 h-12 text-base"
               autoFocus={!selectedClient}
            />
         </div>

         {/* Scrollable results list */}
         {showSuggestions && suggestions.length > 0 && (
            <div className="flex-1 min-h-0 border border-border rounded-lg overflow-hidden">
               <div className="overflow-y-auto h-full max-h-[400px]">
                  {suggestions.map((customer, index) => (
                     <button
                        key={customer.id}
                        onClick={() => handleSelectClient(customer)}
                        className={cn(
                           "w-full px-4 py-3 flex items-center gap-3 hover:bg-accent transition-colors text-left",
                           index === highlightedIndex && "bg-accent",
                           index !== 0 && "border-t border-border"
                        )}
                     >
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                           <User className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                           <p className="font-semibold text-sm truncate">{customer.name}</p>
                           <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                              <Phone className="h-3 w-3" />
                              <span className="truncate">{customer.phone}</span>
                              <span className="text-[10px]">•</span>
                              <span className="whitespace-nowrap">{customer.totalVisits} visits</span>
                           </div>
                        </div>
                        {customer.totalVisits === 0 && (
                           <Badge variant="secondary" className="text-xs flex-shrink-0">
                              New
                           </Badge>
                        )}
                     </button>
                  ))}
               </div>
            </div>
         )}

         {showSuggestions && suggestions.length === 0 && searchQuery && (
            <div className="p-8 text-center border border-border rounded-lg">
               <p className="text-sm text-muted-foreground">No clients found. Try a different search term.</p>
            </div>
         )}
      </div>
   );
}

