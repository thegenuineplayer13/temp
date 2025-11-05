import { Button } from "@/components/ui/button";
import type { Alert } from "@/features/core/types/types.dashboard-owner";
import { AlertTriangle, X, ChevronRight } from "lucide-react";

interface CriticalAlertsBannerProps {
   alerts: Alert[];
   onDismiss: (alertId: string) => void;
   onViewAll: () => void;
}

export function CriticalAlertsBanner({ alerts, onDismiss, onViewAll }: CriticalAlertsBannerProps) {
   if (alerts.length === 0) return null;

   const firstAlert = alerts[0];

   return (
      <div className="sticky top-0 z-50 bg-gradient-to-r from-destructive/10 via-destructive/5 to-transparent border-b border-destructive/20 backdrop-blur-sm">
         <button
            onClick={onViewAll}
            className="w-full px-4 md:px-6 py-3 md:py-4 flex items-center gap-3 md:gap-4 hover:bg-destructive/5 transition-colors text-left"
         >
            <div className="rounded-full bg-destructive/10 p-1.5 md:p-2 flex-shrink-0">
               <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-destructive" />
            </div>
            <div className="flex-1 min-w-0">
               <p className="text-xs md:text-sm font-semibold text-destructive">
                  {alerts.length} Critical Alert{alerts.length > 1 ? "s" : ""} Require Attention
               </p>
               <p className="text-xs text-destructive/80 mt-0.5 line-clamp-1">{firstAlert.message}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
               <ChevronRight className="h-4 w-4 md:h-5 md:w-5 text-destructive" />
               <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                     e.stopPropagation();
                     onDismiss(firstAlert.id);
                  }}
                  className="h-8 w-8 p-0 hover:bg-destructive/10 text-destructive"
               >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Dismiss alert</span>
               </Button>
            </div>
         </button>
      </div>
   );
}
