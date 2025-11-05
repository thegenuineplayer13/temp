import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, User, Briefcase, Calendar, AlertCircle, CheckCircle, XCircle, Play, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CalendarAppointment, CalendarEmployee } from "@/mock/calendar-viewer-mock";

interface AppointmentDetailProps {
   appointment: CalendarAppointment | null;
   employee: CalendarEmployee | undefined;
   open: boolean;
   onOpenChange: (open: boolean) => void;
   isMobile: boolean;
}

export function AppointmentDetail({ appointment, employee, open, onOpenChange, isMobile }: AppointmentDetailProps) {
   if (!appointment) return null;

   const getStatusColor = () => {
      switch (appointment.status) {
         case "confirmed":
            return "bg-blue-500/10 text-blue-600 dark:text-blue-500 border-blue-500/20";
         case "in-progress":
            return "bg-purple-500/10 text-purple-600 dark:text-purple-500 border-purple-500/20";
         case "completed":
            return "bg-green-500/10 text-green-600 dark:text-green-500 border-green-500/20";
         case "cancelled":
            return "bg-gray-500/10 text-gray-600 dark:text-gray-500 border-gray-500/20";
         case "no-show":
            return "bg-red-500/10 text-red-600 dark:text-red-500 border-red-500/20";
      }
   };

   const getStatusIcon = () => {
      switch (appointment.status) {
         case "confirmed":
            return <Calendar className="h-4 w-4" />;
         case "in-progress":
            return <Play className="h-4 w-4" />;
         case "completed":
            return <CheckCircle className="h-4 w-4" />;
         case "cancelled":
            return <XCircle className="h-4 w-4" />;
         case "no-show":
            return <AlertCircle className="h-4 w-4" />;
      }
   };

   const getStatusText = () => {
      switch (appointment.status) {
         case "confirmed":
            return "Confirmed";
         case "in-progress":
            return "In Progress";
         case "completed":
            return "Completed";
         case "cancelled":
            return "Cancelled";
         case "no-show":
            return "No Show";
      }
   };

   const startTime = new Date(appointment.startTime);
   const endTime = new Date(appointment.endTime);

   const content = (
      <div className="space-y-6">
         {/* Status Badge */}
         <div className="flex items-center justify-between">
            <Badge className={cn("font-semibold", getStatusColor())}>
               {getStatusIcon()}
               <span className="ml-2">{getStatusText()}</span>
            </Badge>
            {appointment.isUrgent && (
               <Badge variant="destructive" className="font-semibold">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Urgent
               </Badge>
            )}
         </div>

         {/* Client Info */}
         <div className="space-y-4">
            <div>
               <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                  <User className="h-4 w-4" />
                  Client
               </div>
               <p className="text-2xl font-bold">{appointment.clientName}</p>
            </div>

            {/* Service */}
            <div>
               <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                  <Briefcase className="h-4 w-4" />
                  Service
               </div>
               <p className="text-lg font-semibold">{appointment.service}</p>
            </div>

            {/* Employee */}
            {employee && (
               <div>
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                     <User className="h-4 w-4" />
                     Staff Member
                  </div>
                  <div className="flex items-center gap-2">
                     <div
                        className="h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                        style={{ backgroundColor: employee.color }}
                     >
                        {employee.name
                           .split(" ")
                           .map((n) => n[0])
                           .join("")}
                     </div>
                     <div>
                        <p className="font-semibold">{employee.name}</p>
                        <p className="text-sm text-muted-foreground">{employee.role}</p>
                     </div>
                  </div>
               </div>
            )}
         </div>

         {/* Time Details */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-muted/50">
               <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                  <Calendar className="h-3.5 w-3.5" />
                  Date
               </div>
               <p className="text-sm font-semibold">
                  {startTime.toLocaleDateString("en-US", {
                     weekday: "long",
                     month: "long",
                     day: "numeric",
                  })}
               </p>
            </div>

            <div className="p-4 rounded-lg bg-muted/50">
               <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                  <Clock className="h-3.5 w-3.5" />
                  Time
               </div>
               <p className="text-sm font-semibold">
                  {startTime.toLocaleTimeString("en-US", {
                     hour: "numeric",
                     minute: "2-digit",
                  })}{" "}
                  -{" "}
                  {endTime.toLocaleTimeString("en-US", {
                     hour: "numeric",
                     minute: "2-digit",
                  })}
               </p>
            </div>

            <div className="p-4 rounded-lg bg-muted/50">
               <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                  <Clock className="h-3.5 w-3.5" />
                  Duration
               </div>
               <p className="text-sm font-semibold">{appointment.duration} minutes</p>
            </div>
         </div>

         {/* Notes */}
         {appointment.notes && (
            <div className="p-4 rounded-lg bg-muted/30 border border-border">
               <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                  <FileText className="h-4 w-4" />
                  Notes
               </div>
               <p className="text-sm">{appointment.notes}</p>
            </div>
         )}

         {/* Actions */}
         <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
               Close
            </Button>
            {appointment.status === "confirmed" && (
               <Button className="flex-1">
                  <Play className="h-4 w-4 mr-2" />
                  Start Appointment
               </Button>
            )}
            {appointment.status === "in-progress" && (
               <Button className="flex-1 bg-green-600 hover:bg-green-700">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark Complete
               </Button>
            )}
         </div>
      </div>
   );

   if (isMobile) {
      return (
         <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent>
               <DrawerHeader>
                  <DrawerTitle>Appointment Details</DrawerTitle>
               </DrawerHeader>
               <div className="px-4 pb-6">{content}</div>
            </DrawerContent>
         </Drawer>
      );
   }

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent className="max-w-2xl">
            <DialogHeader>
               <DialogTitle>Appointment Details</DialogTitle>
            </DialogHeader>
            {content}
         </DialogContent>
      </Dialog>
   );
}
