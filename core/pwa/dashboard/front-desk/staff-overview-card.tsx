import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, Coffee } from "lucide-react";
import { useStaff } from "@/features/core/hooks/queries/queries.dashboard-front-desk";
import type { Staff } from "@/features/core/types/types.dashboard-front-desk";

function getStatusBadge(status: Staff["status"]) {
   switch (status) {
      case "busy":
         return (
            <Badge className="bg-red-500/10 text-red-600 dark:text-red-500 hover:bg-red-500/20 border-red-500/20">Busy</Badge>
         );
      case "available":
         return (
            <Badge className="bg-green-500/10 text-green-600 dark:text-green-500 hover:bg-green-500/20 border-green-500/20">
               Available
            </Badge>
         );
      case "break":
         return (
            <Badge className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 hover:bg-yellow-500/20 border-yellow-500/20">
               On Break
            </Badge>
         );
      case "unavailable":
         return <Badge className="bg-muted text-muted-foreground hover:bg-muted">Unavailable</Badge>;
   }
}

export function StaffOverviewCard() {
   const { data: staff = [] } = useStaff();

   const busyStaff = staff.filter((s) => s.status === "busy");
   const availableStaff = staff.filter((s) => s.status === "available");
   const onBreakStaff = staff.filter((s) => s.status === "break");

   return (
      <Card>
         <CardHeader>
            <div className="flex items-center justify-between">
               <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Staff Overview
               </CardTitle>
               <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                     <div className="w-2 h-2 rounded-full bg-green-500" />
                     <span className="text-sm font-semibold text-green-600 dark:text-green-500">{availableStaff.length}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                     <div className="w-2 h-2 rounded-full bg-red-500" />
                     <span className="text-sm font-semibold text-red-600 dark:text-red-500">{busyStaff.length}</span>
                  </div>
                  {onBreakStaff.length > 0 && (
                     <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-yellow-500" />
                        <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-500">{onBreakStaff.length}</span>
                     </div>
                  )}
               </div>
            </div>
         </CardHeader>
         <CardContent>
            <div className="space-y-3">
               {staff.map((member) => (
                  <div
                     key={member.id}
                     className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent/5 transition-colors"
                  >
                     <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: member.color }} />
                     <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                           <p className="font-semibold text-sm truncate">{member.name}</p>
                           {getStatusBadge(member.status)}
                        </div>
                        {member.status === "busy" && member.currentClient && (
                           <div className="space-y-0.5">
                              <p className="text-xs text-muted-foreground truncate">
                                 With: <span className="text-foreground font-medium">{member.currentClient}</span>
                              </p>
                              <p className="text-xs text-muted-foreground">{member.currentService}</p>
                           </div>
                        )}
                        {member.status === "available" && (
                           <p className="text-xs text-green-600 dark:text-green-500 font-medium">Ready for walk-ins</p>
                        )}
                        {member.status === "break" && (
                           <p className="text-xs text-yellow-600 dark:text-yellow-500 font-medium flex items-center gap-1">
                              <Coffee className="h-3 w-3" />
                              Returns at {member.finishesAt}
                           </p>
                        )}
                     </div>
                     {member.finishesAt && member.status === "busy" && (
                        <div className="flex-shrink-0 text-right">
                           <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>Finishes {member.finishesAt}</span>
                           </div>
                           {member.nextAppointment && (
                              <p className="text-[10px] text-muted-foreground mt-0.5">Next: {member.nextAppointment}</p>
                           )}
                        </div>
                     )}
                  </div>
               ))}
            </div>
         </CardContent>
      </Card>
   );
}
