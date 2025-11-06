import { useState } from "react";
import { CalendarPlus, UserPlus, Users, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface FrontDeskActionsPanelProps {
   onBookAppointment: () => void;
   onRegisterCustomer: () => void;
   onAddToWalkIn: () => void;
}

export function FrontDeskActionsPanel({
   onBookAppointment,
   onRegisterCustomer,
   onAddToWalkIn,
}: FrontDeskActionsPanelProps) {
   const isMobile = useIsMobile();
   const [fabOpen, setFabOpen] = useState(false);

   const actions = [
      {
         icon: CalendarPlus,
         label: "Book",
         fullLabel: "Book Appointment",
         color: "text-primary-foreground",
         bgColor: "bg-primary hover:bg-primary/90",
         onClick: () => {
            onBookAppointment();
            setFabOpen(false);
         },
      },
      {
         icon: UserPlus,
         label: "Register",
         fullLabel: "Register Customer",
         color: "text-foreground",
         bgColor: "bg-secondary hover:bg-secondary/90",
         onClick: () => {
            onRegisterCustomer();
            setFabOpen(false);
         },
      },
      {
         icon: Users,
         label: "Walk-in",
         fullLabel: "Add to Walk-in Queue",
         color: "text-foreground",
         bgColor: "bg-accent hover:bg-accent/90",
         onClick: () => {
            onAddToWalkIn();
            setFabOpen(false);
         },
      },
   ];

   // Only render on mobile
   if (!isMobile) {
      return null;
   }

   return (
      <>
         <div className="fixed bottom-6 right-6 z-50">
            <div
               className={cn(
                  "absolute bottom-16 right-0 space-y-3 transition-all duration-300",
                  fabOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"
               )}
            >
               {actions.map((action, index) => (
                  <div
                     key={action.label}
                     className="flex items-center gap-3 justify-end"
                     style={{
                        transitionDelay: fabOpen ? `${index * 50}ms` : "0ms",
                     }}
                  >
                     <span
                        className={cn(
                           "text-sm font-medium bg-background px-3 py-1.5 rounded-full shadow-lg border whitespace-nowrap transition-all",
                           fabOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                        )}
                     >
                        {action.fullLabel}
                     </span>
                     <button
                        onClick={action.onClick}
                        className={cn(
                           "rounded-full p-3 shadow-lg transition-all hover:scale-110",
                           action.bgColor,
                           "border-2 border-background"
                        )}
                     >
                        <action.icon className={cn("h-5 w-5", action.color)} />
                     </button>
                  </div>
               ))}
            </div>

            <button
               onClick={() => setFabOpen(!fabOpen)}
               className={cn(
                  "rounded-full p-4 shadow-2xl transition-all hover:scale-110 border-2 border-background",
                  fabOpen ? "bg-muted rotate-45" : "bg-primary hover:bg-primary/90"
               )}
            >
               {fabOpen ? <X className="h-6 w-6 text-foreground" /> : <Plus className="h-6 w-6 text-primary-foreground" />}
            </button>
         </div>

         {fabOpen && <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40" onClick={() => setFabOpen(false)} />}
      </>
   );
}
