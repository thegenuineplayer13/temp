import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
   User,
   Phone,
   Mail,
   Calendar,
   Star,
   FileText,
   Clock,
   CheckCircle2,
   XCircle,
   DollarSign,
   CalendarPlus,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useFrontDeskStore } from "@/features/core/store/store.front-desk";
import { useAppointments, useStaff } from "@/features/core/hooks/queries/queries.dashboard-front-desk";
import type { Appointment } from "@/features/core/types/types.dashboard-front-desk";

interface CustomerQuickViewProps {
   onBookAppointment?: (customerId: string) => void;
   onAddToWalkIn?: (customerId: string) => void;
   onCheckIn?: (appointmentId: string) => void;
   onCancel?: (appointmentId: string) => void;
   onProcessPayment?: (appointmentId: string) => void;
}

export function CustomerQuickView({
   onBookAppointment,
   onAddToWalkIn,
   onCheckIn,
   onCancel,
   onProcessPayment,
}: CustomerQuickViewProps) {
   const isMobile = useIsMobile();
   const { selectedCustomer, isCustomerViewOpen, closeCustomerView } = useFrontDeskStore();
   const { data: appointments = [] } = useAppointments();
   const { data: staff = [] } = useStaff();

   if (!selectedCustomer) return null;

   const todayAppointments = appointments.filter(
      (apt) => apt.customerId === selectedCustomer.id || apt.customerName === selectedCustomer.name
   );

   const getStatusBadge = (status: Appointment["status"]) => {
      switch (status) {
         case "booked":
            return <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-500 border-blue-500/20 text-xs">Booked</Badge>;
         case "checked-in":
            return (
               <Badge className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border-yellow-500/20 text-xs">
                  Checked In
               </Badge>
            );
         case "in-progress":
            return (
               <Badge className="bg-purple-500/10 text-purple-600 dark:text-purple-500 border-purple-500/20 text-xs">
                  In Progress
               </Badge>
            );
         case "completed":
            return (
               <Badge className="bg-green-500/10 text-green-600 dark:text-green-500 border-green-500/20 text-xs">Completed</Badge>
            );
         default:
            return null;
      }
   };

   const getAppointmentActions = (appointment: Appointment) => {
      switch (appointment.status) {
         case "booked":
            return (
               <div className="flex gap-2">
                  <Button
                     size="sm"
                     onClick={() => onCheckIn?.(appointment.id)}
                     className="flex-1 h-8 text-xs bg-green-500 hover:bg-green-600"
                  >
                     <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                     Check In
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => onCancel?.(appointment.id)} className="h-8 px-3">
                     <XCircle className="h-3.5 w-3.5" />
                  </Button>
               </div>
            );
         case "checked-in":
         case "in-progress":
            return (
               <Button size="sm" onClick={() => onProcessPayment?.(appointment.id)} className="w-full h-8 text-xs">
                  <DollarSign className="h-3.5 w-3.5 mr-1.5" />
                  Process Payment
               </Button>
            );
         case "completed":
            if (appointment.paymentStatus === "pending") {
               return (
                  <Button size="sm" onClick={() => onProcessPayment?.(appointment.id)} className="w-full h-8 text-xs">
                     <DollarSign className="h-3.5 w-3.5 mr-1.5" />
                     Process Payment
                  </Button>
               );
            }
            return null;
         default:
            return null;
      }
   };

   const getPreferredStaffName = () => {
      if (!selectedCustomer.preferredStaff) return null;
      return staff.find((s) => s.id === selectedCustomer.preferredStaff)?.name;
   };

   const content = (
      <div className="space-y-4 py-4">
         <div className="flex items-start justify-between">
            <div>
               <h3 className="text-lg font-semibold">{selectedCustomer.name}</h3>
               <p className="text-sm text-muted-foreground">Customer ID: {selectedCustomer.id}</p>
            </div>
            <Badge variant="secondary" className="flex items-center gap-1">
               <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
               {selectedCustomer.averageRating}
            </Badge>
         </div>

         <div className="space-y-3 p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-3">
               <Phone className="h-4 w-4 text-muted-foreground" />
               <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium">{selectedCustomer.phone}</p>
               </div>
            </div>
            <div className="flex items-center gap-3">
               <Mail className="h-4 w-4 text-muted-foreground" />
               <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">{selectedCustomer.email}</p>
               </div>
            </div>
         </div>

         <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
               <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-4 w-4 text-primary" />
                  <p className="text-xs font-medium text-muted-foreground">Total Visits</p>
               </div>
               <p className="text-2xl font-bold">{selectedCustomer.totalVisits}</p>
            </div>
            <div className="p-3 bg-accent/5 border border-accent/20 rounded-lg">
               <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-accent" />
                  <p className="text-xs font-medium text-muted-foreground">Last Visit</p>
               </div>
               <p className="text-sm font-semibold">{selectedCustomer.lastVisit}</p>
            </div>
         </div>

         {todayAppointments.length > 0 && (
            <>
               <Separator />
               <div className="space-y-3">
                  <div className="flex items-center gap-2">
                     <CalendarPlus className="h-4 w-4 text-primary" />
                     <h4 className="font-semibold text-sm">Today's Appointments</h4>
                     <Badge variant="secondary" className="ml-auto">
                        {todayAppointments.length}
                     </Badge>
                  </div>
                  <div className="space-y-2">
                     {todayAppointments.map((appointment) => (
                        <div
                           key={appointment.id}
                           className={cn(
                              "p-3 rounded-lg border space-y-3",
                              appointment.status === "booked" && "bg-blue-500/5 border-blue-500/20",
                              appointment.status === "checked-in" && "bg-yellow-500/5 border-yellow-500/20",
                              appointment.status === "in-progress" && "bg-purple-500/5 border-purple-500/20",
                              appointment.status === "completed" && "bg-green-500/5 border-green-500/20"
                           )}
                        >
                           <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                 <div className="flex items-center gap-2 mb-1">
                                    <Star className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                                    <p className="text-sm font-medium truncate">{appointment.service}</p>
                                 </div>
                                 <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    <span>
                                       {appointment.startTime} - {appointment.endTime}
                                    </span>
                                    <span>•</span>
                                    <span>{appointment.staffName}</span>
                                 </div>
                              </div>
                              {getStatusBadge(appointment.status)}
                           </div>
                           {getAppointmentActions(appointment)}
                        </div>
                     ))}
                  </div>
               </div>
            </>
         )}

         {selectedCustomer.preferredStaff && getPreferredStaffName() && (
            <div className="p-3 bg-muted/30 rounded-lg">
               <div className="flex items-center gap-2 mb-1">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <p className="text-xs font-medium text-muted-foreground">Preferred Staff</p>
               </div>
               <p className="text-sm font-semibold">{getPreferredStaffName()}</p>
            </div>
         )}

         {selectedCustomer.notes && (
            <div className="p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
               <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
                  <p className="text-xs font-medium text-yellow-700 dark:text-yellow-400">Important Notes</p>
               </div>
               <p className="text-sm text-foreground">{selectedCustomer.notes}</p>
            </div>
         )}

         <div className="flex gap-2 pt-2">
            <Button onClick={() => onBookAppointment?.(selectedCustomer.id)} className="flex-1">
               <Calendar className="h-4 w-4 mr-2" />
               Book Appointment
            </Button>
            <Button onClick={() => onAddToWalkIn?.(selectedCustomer.id)} variant="outline" className="flex-1">
               <CalendarPlus className="h-4 w-4 mr-2" />
               Add to Queue
            </Button>
         </div>
      </div>
   );

   if (isMobile) {
      return (
         <Drawer open={isCustomerViewOpen} onOpenChange={closeCustomerView}>
            <DrawerContent className="max-h-[90vh]">
               <DrawerHeader>
                  <DrawerTitle className="flex items-center gap-2">
                     <User className="h-5 w-5 text-primary" />
                     Customer Profile
                  </DrawerTitle>
               </DrawerHeader>
               <div className="overflow-y-auto px-4 pb-8">{content}</div>
            </DrawerContent>
         </Drawer>
      );
   }

   return (
      <Dialog open={isCustomerViewOpen} onOpenChange={closeCustomerView}>
         <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
               <DialogTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Customer Profile
               </DialogTitle>
            </DialogHeader>
            {content}
         </DialogContent>
      </Dialog>
   );
}
