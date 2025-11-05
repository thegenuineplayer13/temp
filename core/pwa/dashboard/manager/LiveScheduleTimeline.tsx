import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Appointment, StaffMember } from "@/mock/manager-dashboard-mock";

interface LiveScheduleTimelineProps {
   staff: StaffMember[];
   appointments: Appointment[];
   currentTime: Date;
   onAppointmentClick: (appointment: Appointment) => void;
   onStaffClick: (staff: StaffMember) => void;
   isMobile: boolean;
}

export function LiveScheduleTimeline({
   staff,
   appointments,
   currentTime,
   onAppointmentClick,
   onStaffClick,
   isMobile,
}: LiveScheduleTimelineProps) {
   // Generate time slots for next 4 hours (30-minute intervals)
   const generateTimeSlots = () => {
      const slots = [];
      const start = new Date(currentTime);
      start.setMinutes(0, 0, 0);

      for (let i = 0; i < 9; i++) {
         const time = new Date(start.getTime() + i * 30 * 60000);
         slots.push(time);
      }
      return slots;
   };

   const timeSlots = generateTimeSlots();

   const formatTime = (date: Date) => {
      return date.toLocaleTimeString("en-US", {
         hour: "numeric",
         minute: "2-digit",
         hour12: true,
      });
   };

   const parseTimeString = (timeStr: string) => {
      const [hours, minutes] = timeStr.split(":").map(Number);
      const date = new Date(currentTime);
      date.setHours(hours, minutes, 0, 0);
      return date;
   };

   const getCurrentTimePosition = () => {
      const startHour = timeSlots[0].getHours();
      const currentHour = currentTime.getHours();
      const currentMinutes = currentTime.getMinutes();

      const totalMinutes = (currentHour - startHour) * 60 + currentMinutes;
      const percentage = (totalMinutes / 240) * 100; // 240 minutes = 4 hours

      return Math.min(Math.max(percentage, 0), 100);
   };

   const getAppointmentPosition = (appointment: Appointment) => {
      const startTime = parseTimeString(appointment.startTime);
      const startHour = timeSlots[0].getHours();
      const aptHour = startTime.getHours();
      const aptMinutes = startTime.getMinutes();

      const totalMinutes = (aptHour - startHour) * 60 + aptMinutes;
      const left = (totalMinutes / 240) * 100;
      const width = (appointment.duration / 240) * 100;

      return { left, width };
   };

   const getStatusColor = (status: Appointment["status"]) => {
      switch (status) {
         case "on-time":
            return "bg-green-500/20 border-green-500 text-green-700 dark:text-green-400";
         case "running-late":
            return "bg-orange-500/20 border-orange-500 text-orange-700 dark:text-orange-400";
         case "upcoming":
            return "bg-primary/20 border-primary text-primary";
         case "no-show":
            return "bg-red-500/20 border-red-500 text-red-700 dark:text-red-400";
         case "completed":
            return "bg-muted border-muted-foreground/20 text-muted-foreground";
         default:
            return "bg-muted border-muted-foreground/20 text-foreground";
      }
   };

   const getStatusIcon = (status: Appointment["status"]) => {
      switch (status) {
         case "on-time":
            return <CheckCircle className="h-3 w-3" />;
         case "running-late":
            return <AlertCircle className="h-3 w-3" />;
         case "no-show":
            return <AlertCircle className="h-3 w-3" />;
         default:
            return null;
      }
   };

   const workingStaff = staff.filter((s) => s.status === "working" || s.status === "break" || s.status === "late");

   if (isMobile) {
      return (
         <Card className="overflow-hidden">
            <CardHeader className="pb-3">
               <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                     <Clock className="h-4 w-4 text-primary" />
                     Live Schedule
                  </CardTitle>
                  <Badge variant="outline" className="font-semibold">
                     Next 4 Hours
                  </Badge>
               </div>
            </CardHeader>
            <CardContent className="space-y-4">
               {/* Current Time Indicator */}
               <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-sm font-semibold text-primary">Now: {formatTime(currentTime)}</span>
               </div>

               {/* Staff Schedule List */}
               <div className="space-y-3">
                  {workingStaff.map((staffMember) => {
                     const staffAppointments = appointments.filter((apt) => apt.staffId === staffMember.id);

                     return (
                        <div key={staffMember.id} className="space-y-2 p-3 bg-card/50 rounded-lg border border-border">
                           <div
                              className="flex items-center justify-between cursor-pointer"
                              onClick={() => onStaffClick(staffMember)}
                           >
                              <div className="flex items-center gap-2">
                                 <div
                                    className={cn(
                                       "h-2 w-2 rounded-full",
                                       staffMember.status === "working" && "bg-green-500",
                                       staffMember.status === "break" && "bg-yellow-500",
                                       staffMember.status === "late" && "bg-red-500"
                                    )}
                                 />
                                 <span className="text-sm font-semibold">{staffMember.name}</span>
                              </div>
                              <span className="text-xs text-muted-foreground">{staffAppointments.length} apts</span>
                           </div>

                           {staffAppointments.length === 0 ? (
                              <div className="text-xs text-muted-foreground italic pl-4">No appointments scheduled</div>
                           ) : (
                              <div className="space-y-2 pl-4">
                                 {staffAppointments.map((apt) => (
                                    <div
                                       key={apt.id}
                                       onClick={() => onAppointmentClick(apt)}
                                       className={cn(
                                          "p-2 rounded border cursor-pointer hover:shadow-sm transition-all",
                                          getStatusColor(apt.status)
                                       )}
                                    >
                                       <div className="flex items-start justify-between gap-2">
                                          <div className="flex-1 min-w-0">
                                             <div className="flex items-center gap-1.5">
                                                {getStatusIcon(apt.status)}
                                                <span className="text-xs font-semibold truncate">{apt.clientName}</span>
                                             </div>
                                             <p className="text-xs mt-0.5 truncate">{apt.service}</p>
                                          </div>
                                          <div className="text-right flex-shrink-0">
                                             <p className="text-xs font-semibold">{apt.startTime}</p>
                                             <p className="text-xs opacity-75">{apt.duration}m</p>
                                          </div>
                                       </div>
                                       {apt.isUrgent && (
                                          <Badge variant="destructive" className="mt-1 text-xs h-4">
                                             Urgent
                                          </Badge>
                                       )}
                                    </div>
                                 ))}
                              </div>
                           )}
                        </div>
                     );
                  })}
               </div>
            </CardContent>
         </Card>
      );
   }

   return (
      <Card className="overflow-hidden">
         <CardHeader>
            <div className="flex items-center justify-between">
               <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Live Schedule Timeline
               </CardTitle>
               <Badge variant="outline" className="font-semibold">
                  Next 4 Hours
               </Badge>
            </div>
         </CardHeader>
         <CardContent>
            {/* Time Header */}
            <div className="relative mb-4">
               <div className="flex border-b border-border pb-2">
                  <div className="w-32 flex-shrink-0" />
                  <div className="flex-1 relative">
                     <div className="flex justify-between text-xs font-medium text-muted-foreground">
                        {timeSlots
                           .filter((_, i) => i % 2 === 0)
                           .map((slot, idx) => (
                              <div key={idx} className="flex-1 text-center">
                                 {formatTime(slot)}
                              </div>
                           ))}
                     </div>
                  </div>
               </div>
            </div>

            {/* Staff Rows */}
            <div className="space-y-3">
               {workingStaff.map((staffMember) => {
                  const staffAppointments = appointments.filter((apt) => apt.staffId === staffMember.id);

                  return (
                     <div
                        key={staffMember.id}
                        className="flex items-stretch group hover:bg-accent/5 rounded-lg transition-colors"
                     >
                        {/* Staff Name */}
                        <div
                           className="w-32 flex-shrink-0 flex items-center gap-2 px-3 py-2 cursor-pointer"
                           onClick={() => onStaffClick(staffMember)}
                        >
                           <div
                              className={cn(
                                 "h-2 w-2 rounded-full flex-shrink-0",
                                 staffMember.status === "working" && "bg-green-500",
                                 staffMember.status === "break" && "bg-yellow-500",
                                 staffMember.status === "late" && "bg-red-500"
                              )}
                           />
                           <div className="min-w-0">
                              <p className="text-sm font-semibold truncate">{staffMember.name}</p>
                              <p className="text-xs text-muted-foreground truncate">{staffMember.role}</p>
                           </div>
                        </div>

                        {/* Timeline */}
                        <div className="flex-1 relative min-h-[60px] border-l border-border">
                           {/* Time Grid */}
                           <div className="absolute inset-0 flex">
                              {timeSlots.slice(0, -1).map((_, idx) => (
                                 <div key={idx} className="flex-1 border-r border-border/30" />
                              ))}
                           </div>

                           {/* Current Time Line */}
                           <div
                              className="absolute top-0 bottom-0 w-0.5 bg-primary z-20"
                              style={{ left: `${getCurrentTimePosition()}%` }}
                           >
                              <div className="absolute -top-1 -left-1.5 h-3 w-3 rounded-full bg-primary animate-pulse" />
                           </div>

                           {/* Appointments */}
                           {staffAppointments.map((apt) => {
                              const { left, width } = getAppointmentPosition(apt);

                              // Only show if within the 4-hour window
                              if (left < 0 || left > 100) return null;

                              return (
                                 <div
                                    key={apt.id}
                                    className={cn(
                                       "absolute top-1 bottom-1 rounded border-2 px-2 py-1 cursor-pointer hover:shadow-md transition-all z-10 overflow-hidden",
                                       getStatusColor(apt.status)
                                    )}
                                    style={{
                                       left: `${Math.max(left, 0)}%`,
                                       width: `${Math.min(width, 100 - left)}%`,
                                    }}
                                    onClick={() => onAppointmentClick(apt)}
                                 >
                                    <div className="flex items-center gap-1 h-full">
                                       {getStatusIcon(apt.status)}
                                       <div className="min-w-0 flex-1">
                                          <p className="text-xs font-semibold truncate leading-tight">{apt.clientName}</p>
                                          <p className="text-xs truncate leading-tight opacity-90">{apt.service}</p>
                                       </div>
                                       {apt.isUrgent && (
                                          <AlertCircle className="h-3 w-3 text-red-600 dark:text-red-500 flex-shrink-0" />
                                       )}
                                    </div>
                                 </div>
                              );
                           })}

                           {/* Empty State */}
                           {staffAppointments.length === 0 && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                 <span className="text-xs text-muted-foreground italic">No appointments</span>
                              </div>
                           )}
                        </div>
                     </div>
                  );
               })}
            </div>

            {/* Current Time Display */}
            <div className="mt-4 pt-4 border-t flex items-center justify-center gap-2">
               <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
               <span className="text-sm font-semibold text-primary">Current Time: {formatTime(currentTime)}</span>
            </div>
         </CardContent>
      </Card>
   );
}
