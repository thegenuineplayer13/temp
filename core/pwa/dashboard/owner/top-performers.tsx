import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, ChevronRight } from "lucide-react";
import { useModal } from "@/hooks/use-modal";
import { ResponsiveModal } from "@/components/ui/modal";
import { StaffPerformanceDetails } from "./staff-performance-details";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Performer } from "@/features/core/types/types.dashboard-owner";
import { useDetailedStaff } from "@/features/core/hooks/queries/queries.dashboard-owner";
import { AvatarWithBadge } from "./common/avatar-with-badge";

interface TopPerformersProps {
   performers: Performer[];
}

export function TopPerformers({ performers }: TopPerformersProps) {
   const isMobile = useIsMobile();
   const modal = useModal();
   const { data: detailedStaff } = useDetailedStaff();

   const CardWrapper = isMobile ? "button" : "div";
   const cardProps = isMobile
      ? {
           onClick: modal.open,
           className: "w-full text-left active:scale-[0.98] transition-transform",
        }
      : {};

   return (
      <>
         <CardWrapper {...cardProps}>
            <Card className={isMobile ? "relative" : ""}>
               {isMobile && <ChevronRight className="absolute top-4 right-4 h-4 w-4 text-muted-foreground" />}
               <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-primary" />
                        <CardTitle className="text-sm font-semibold">Top Performers</CardTitle>
                     </div>
                     <Badge variant="secondary" className="text-xs">
                        Today
                     </Badge>
                  </div>
               </CardHeader>
               <CardContent className="space-y-3">
                  {performers.map((performer, idx) => (
                     <div key={idx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors">
                        <AvatarWithBadge initials={performer.avatar} size="md" showBadge={idx === 0} />
                        <div className="flex-1 min-w-0">
                           <p className="text-sm font-semibold truncate">{performer.name}</p>
                           <p className="text-xs text-muted-foreground">{performer.metric}</p>
                        </div>
                        <p className="text-sm font-bold text-primary">{performer.value}</p>
                     </div>
                  ))}
               </CardContent>
               {!isMobile && (
                  <div className="px-6 pb-4">
                     <Button variant="outline" size="sm" className="w-full" onClick={modal.open}>
                        View All Staff
                        <ChevronRight className="h-4 w-4 ml-1" />
                     </Button>
                  </div>
               )}
            </Card>
         </CardWrapper>

         <ResponsiveModal open={modal.isOpen} onOpenChange={modal.setIsOpen} title="Staff Performance">
            {detailedStaff && <StaffPerformanceDetails staff={detailedStaff} />}
         </ResponsiveModal>
      </>
   );
}
