import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, Briefcase, ChevronDown, ChevronUp, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Appointment } from "@/features/core/types/types.dashboard-employee";

interface NextAppointmentsProps {
   appointments: Appointment[];
}

export function NextAppointments({ appointments }: NextAppointmentsProps) {
   const isMobile = useIsMobile();
   const [expandedId, setExpandedId] = useState<string | null>(null);

   const toggleExpand = (id: string) => {
      setExpandedId(expandedId === id ? null : id);
   };

   if (isMobile) {
      return (
         <Card>
            <CardHeader className="pb-3">
               <CardTitle className="text-base font-semibold flex items-center justify-between">
                  <span>Next Appointments</span>
                  <Badge variant="outline">{appointments.length}</Badge>
               </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
               {appointments.map((appointment) => (
                  <div
                     key={appointment.id}
                     className={cn(
                        "border rounded-lg overflow-hidden transition-all",
                        expandedId === appointment.id && "border-primary"
                     )}
                  >
                     <button
                        onClick={() => toggleExpand(appointment.id)}
                        className="w-full p-3 text-left hover:bg-accent/5 transition-colors"
                     >
                        <div className="flex items-start justify-between gap-3">
                           <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                 <Clock className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                                 <span className="text-sm font-bold">{appointment.time}</span>
                                 {appointment.isUrgent && (
                                    <Badge variant="destructive" className="text-xs">
                                       Urgent
                                    </Badge>
                                 )}
                              </div>
                              <p className="text-sm font-semibold truncate">{appointment.clientName}</p>
                              <p className="text-xs text-muted-foreground truncate">{appointment.serviceType}</p>
                           </div>
                           <div className="flex-shrink-0 flex flex-col items-end gap-1">
                              <Badge variant="secondary" className="text-xs">
                                 {appointment.estimatedDuration} min
                              </Badge>
                              {expandedId === appointment.id ? (
                                 <ChevronUp className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                 <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              )}
                           </div>
                        </div>
                     </button>

                     {expandedId === appointment.id && (
                        <div className="px-3 pb-3 pt-1 border-t bg-accent/5 space-y-2">
                           {appointment.location && (
                              <div className="flex items-start gap-2">
                                 <MapPin className="h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                                 <p className="text-xs text-muted-foreground">{appointment.location}</p>
                              </div>
                           )}
                           {appointment.specialNotes && (
                              <div className="p-2 bg-yellow-500/10 border border-yellow-500/20 rounded">
                                 <p className="text-xs text-foreground">
                                    <span className="font-medium">Note:</span> {appointment.specialNotes}
                                 </p>
                              </div>
                           )}
                        </div>
                     )}
                  </div>
               ))}
            </CardContent>
         </Card>
      );
   }

   return (
      <Card>
         <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center justify-between">
               <span>Upcoming Appointments</span>
               <Badge variant="outline">{appointments.length}</Badge>
            </CardTitle>
         </CardHeader>
         <CardContent className="space-y-3">
            {appointments.map((appointment) => (
               <div
                  key={appointment.id}
                  className={cn(
                     "border rounded-lg overflow-hidden transition-all",
                     expandedId === appointment.id && "border-primary"
                  )}
               >
                  <button
                     onClick={() => toggleExpand(appointment.id)}
                     className="w-full p-4 text-left hover:bg-accent/5 transition-colors"
                  >
                     <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                           <div className="flex items-center gap-3 mb-2">
                              <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                              <span className="text-base font-bold">{appointment.time}</span>
                              {appointment.isUrgent && <Badge variant="destructive">Urgent</Badge>}
                           </div>
                           <div className="flex items-center gap-2 mb-1">
                              <User className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                              <p className="text-sm font-semibold truncate">{appointment.clientName}</p>
                           </div>
                           <div className="flex items-center gap-2">
                              <Briefcase className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                              <p className="text-sm text-muted-foreground truncate">{appointment.serviceType}</p>
                           </div>
                        </div>
                        <div className="flex-shrink-0 flex flex-col items-end gap-2">
                           <Badge variant="secondary">{appointment.estimatedDuration} min</Badge>
                           {expandedId === appointment.id ? (
                              <ChevronUp className="h-4 w-4 text-muted-foreground" />
                           ) : (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                           )}
                        </div>
                     </div>
                  </button>

                  {expandedId === appointment.id && (
                     <div className="px-4 pb-4 pt-2 border-t bg-accent/5 space-y-3">
                        {appointment.location && (
                           <div className="flex items-start gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-muted-foreground">{appointment.location}</p>
                           </div>
                        )}
                        {appointment.specialNotes && (
                           <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                              <p className="text-sm text-foreground">
                                 <span className="font-medium">Special Note:</span> {appointment.specialNotes}
                              </p>
                           </div>
                        )}
                     </div>
                  )}
               </div>
            ))}
         </CardContent>
      </Card>
   );
}
