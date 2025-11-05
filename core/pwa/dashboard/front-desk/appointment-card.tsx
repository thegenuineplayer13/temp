import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, User, Phone, CheckCircle2, XCircle, DollarSign, MoreHorizontal, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Appointment } from "@/features/core/types/types.dashboard-front-desk";

interface AppointmentCardProps {
   appointment: Appointment;
   staffColor: string;
   onCheckIn: (appointmentId: string) => void;
   onCancel: (appointmentId: string) => void;
   onProcessPayment: (appointmentId: string) => void;
   onViewDetails: (appointmentId: string) => void;
}

function getStatusConfig(status: Appointment["status"]) {
   switch (status) {
      case "booked":
         return {
            badge: (
               <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-500 hover:bg-blue-500/20 border-blue-500/20">
                  Booked
               </Badge>
            ),
            bgClass: "bg-blue-500/5 border-blue-500/20",
         };
      case "checked-in":
         return {
            badge: (
               <Badge className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 hover:bg-yellow-500/20 border-yellow-500/20">
                  Checked In
               </Badge>
            ),
            bgClass: "bg-yellow-500/5 border-yellow-500/20",
         };
      case "in-progress":
         return {
            badge: (
               <Badge className="bg-purple-500/10 text-purple-600 dark:text-purple-500 hover:bg-purple-500/20 border-purple-500/20">
                  In Progress
               </Badge>
            ),
            bgClass: "bg-purple-500/5 border-purple-500/20",
         };
      case "completed":
         return {
            badge: (
               <Badge className="bg-green-500/10 text-green-600 dark:text-green-500 hover:bg-green-500/20 border-green-500/20">
                  Completed
               </Badge>
            ),
            bgClass: "bg-green-500/5 border-green-500/20",
         };
      case "no-show":
         return {
            badge: (
               <Badge className="bg-red-500/10 text-red-600 dark:text-red-500 hover:bg-red-500/20 border-red-500/20">
                  No Show
               </Badge>
            ),
            bgClass: "bg-red-500/5 border-red-500/20",
         };
      case "cancelled":
         return {
            badge: (
               <Badge variant="outline" className="text-muted-foreground">
                  Cancelled
               </Badge>
            ),
            bgClass: "bg-muted/5 border-border",
         };
   }
}

export function AppointmentCard({
   appointment,
   staffColor,
   onCheckIn,
   onCancel,
   onProcessPayment,
   onViewDetails,
}: AppointmentCardProps) {
   const statusConfig = getStatusConfig(appointment.status);

   return (
      <div className={cn("relative p-4 rounded-sm border transition-all hover:shadow-md", statusConfig.bgClass)}>
         <div className="absolute top-0 left-0 w-1 h-full rounded-l-lg" style={{ backgroundColor: staffColor }} />

         <div className="flex flex-col justify-between h-full space-y-2 pl-3">
            <div className="flex items-start justify-between gap-2">
               <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                     <h4 className="font-semibold text-sm truncate">{appointment.customerName}</h4>
                     {appointment.isNewClient && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5">
                           NEW
                        </Badge>
                     )}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                     <Phone className="h-3 w-3" />
                     <span>{appointment.customerPhone}</span>
                  </div>
               </div>
               {statusConfig.badge}
            </div>

            <div className="space-y-1.5">
               <div className="flex items-center gap-2">
                  <Star className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                  <p className="text-xs font-medium">{appointment.service}</p>
                  <span className="text-xs text-muted-foreground">({appointment.duration} min)</span>
               </div>
               <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                  <p className="text-xs text-muted-foreground">
                     {appointment.startTime} - {appointment.endTime}
                  </p>
               </div>
               <div className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                  <p className="text-xs text-muted-foreground">{appointment.staffName}</p>
               </div>
            </div>

            {appointment.notes && (
               <div className="px-2 py-1.5 bg-accent/30 rounded text-xs text-foreground">{appointment.notes}</div>
            )}

            <div className="flex items-center gap-2 pt-2 border-t border-border/50">
               {appointment.status === "booked" && (
                  <>
                     <Button
                        size="sm"
                        onClick={() => onCheckIn(appointment.id)}
                        className="flex-1 h-8 text-xs bg-green-500 hover:bg-green-600 text-white"
                     >
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                        Check In
                     </Button>
                     <Button size="sm" variant="outline" onClick={() => onCancel(appointment.id)} className="h-8 px-3">
                        <XCircle className="h-3.5 w-3.5" />
                     </Button>
                  </>
               )}

               {appointment.status === "checked-in" && (
                  <>
                     <Button size="sm" onClick={() => onProcessPayment(appointment.id)} className="flex-1 h-8 text-xs">
                        <DollarSign className="h-3.5 w-3.5 mr-1.5" />
                        Checkout
                     </Button>
                     <Button size="sm" variant="outline" onClick={() => onViewDetails(appointment.id)} className="h-8 px-3">
                        <MoreHorizontal className="h-3.5 w-3.5" />
                     </Button>
                  </>
               )}

               {(appointment.status === "completed" || appointment.status === "in-progress") && (
                  <>
                     {appointment.paymentStatus === "pending" && (
                        <Button size="sm" onClick={() => onProcessPayment(appointment.id)} className="flex-1 h-8 text-xs">
                           <DollarSign className="h-3.5 w-3.5 mr-1.5" />
                           Checkout
                        </Button>
                     )}
                     <Button size="sm" variant="outline" onClick={() => onViewDetails(appointment.id)} className="h-8 px-3">
                        Details
                     </Button>
                  </>
               )}

               {appointment.status === "no-show" && (
                  <Button
                     size="sm"
                     variant="outline"
                     onClick={() => onViewDetails(appointment.id)}
                     className="flex-1 h-8 text-xs"
                  >
                     View Details
                  </Button>
               )}

               {appointment.status === "cancelled" && (
                  <Button
                     size="sm"
                     variant="outline"
                     onClick={() => onViewDetails(appointment.id)}
                     className="flex-1 h-8 text-xs"
                     disabled
                  >
                     Cancelled
                  </Button>
               )}
            </div>
         </div>
      </div>
   );
}
