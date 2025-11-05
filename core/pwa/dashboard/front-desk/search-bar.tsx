import { useState, useEffect, useRef } from "react";
import { Search, User, Phone, UserPlus, CalendarPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCustomers } from "@/features/core/hooks/queries/queries.dashboard-front-desk";
import type { Customer } from "@/features/core/types/types.dashboard-front-desk";

interface SearchBarProps {
   onSelectCustomer: (customer: Customer) => void;
   onRegisterClick: () => void;
   onBookAppointmentClick: () => void;
}

export function SearchBar({ onSelectCustomer, onRegisterClick, onBookAppointmentClick }: SearchBarProps) {
   const { data: customers = [] } = useCustomers();
   const [searchQuery, setSearchQuery] = useState("");
   const [suggestions, setSuggestions] = useState<Customer[]>([]);
   const [showSuggestions, setShowSuggestions] = useState(false);
   const [highlightedIndex, setHighlightedIndex] = useState(-1);
   const searchRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      if (searchQuery.trim().length > 0) {
         const filtered = customers.filter(
            (customer) => customer.name.toLowerCase().includes(searchQuery.toLowerCase()) || customer.phone.includes(searchQuery)
         );
         setSuggestions(filtered);
         setShowSuggestions(true);
         setHighlightedIndex(-1);
      } else {
         setSuggestions([]);
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
         handleSelectCustomer(suggestions[highlightedIndex]);
      } else if (e.key === "Escape") {
         setShowSuggestions(false);
      }
   };

   const handleSelectCustomer = (customer: Customer) => {
      onSelectCustomer(customer);
      setSearchQuery("");
      setShowSuggestions(false);
   };

   return (
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
         <div className="container mx-auto px-4 md:px-6 py-4">
            <div className="flex items-center gap-3 max-w-3xl mx-auto">
               <div ref={searchRef} className="relative flex-1">
                  <div className="relative">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                     <Input
                        type="text"
                        placeholder="Search customers by name or phone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => searchQuery && setShowSuggestions(true)}
                        className="pl-10 pr-4 h-11 md:h-12 text-base shadow-md"
                     />
                  </div>

                  {showSuggestions && suggestions.length > 0 && (
                     <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-xl max-h-96 overflow-y-auto">
                        {suggestions.map((customer, index) => (
                           <button
                              key={customer.id}
                              onClick={() => handleSelectCustomer(customer)}
                              className={cn(
                                 "w-full px-4 py-3 flex items-center gap-3 hover:bg-accent transition-colors",
                                 index === highlightedIndex && "bg-accent",
                                 index !== 0 && "border-t border-border"
                              )}
                           >
                              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                 <User className="h-5 w-5 text-primary" />
                              </div>
                              <div className="flex-1 text-left">
                                 <p className="font-semibold text-sm">{customer.name}</p>
                                 <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                                    <Phone className="h-3 w-3" />
                                    <span>{customer.phone}</span>
                                    <span className="text-[10px]">•</span>
                                    <span>{customer.totalVisits} visits</span>
                                 </div>
                              </div>
                              {customer.preferredStaff && <div className="text-xs text-muted-foreground">Preferred staff</div>}
                           </button>
                        ))}
                     </div>
                  )}

                  {showSuggestions && suggestions.length === 0 && searchQuery && (
                     <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-xl p-4">
                        <p className="text-sm text-muted-foreground text-center">
                           No customers found. Try a different search term.
                        </p>
                     </div>
                  )}
               </div>

               <Button
                  onClick={onBookAppointmentClick}
                  className="h-11 md:h-12 px-4 shadow-md flex-shrink-0 bg-primary hover:bg-primary/90"
               >
                  <CalendarPlus className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Book</span>
               </Button>

               <Button
                  onClick={onRegisterClick}
                  variant="outline"
                  className="h-11 md:h-12 px-4 shadow-md flex-shrink-0"
               >
                  <UserPlus className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Register</span>
               </Button>
            </div>
         </div>
      </div>
   );
}
