import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CalendarEmployee, CalendarAppointment, TimeOffEntry, WorkingHours } from "@/mock/calendar-viewer-mock";

interface CalendarDayViewProps {
   date: Date;
   employees: CalendarEmployee[];
   appointments: CalendarAppointment[];
   timeOffEntries: TimeOffEntry[];
   workingHours: WorkingHours[];
   onAppointmentClick: (appointment: CalendarAppointment) => void;
   onEmployeeClick: (employee: CalendarEmployee) => void;
   isMobile: boolean;
}

export function CalendarDayView({
   date,
   employees,
   appointments,
   timeOffEntries,
   workingHours,
   onAppointmentClick,
   onEmployeeClick,
   isMobile,
}: CalendarDayViewProps) {
   const currentTime = new Date();
   const isToday = date.toDateString() === currentTime.toDateString();

   // Generate time slots from 8 AM to 8 PM (every 2 hours for header)
   const generateTimeSlots = () => {
      const slots = [];
      const start = new Date(date);
      start.setHours(8, 0, 0, 0);

      for (let i = 0; i <= 6; i++) {
         const time = new Date(start.getTime() + i * 2 * 60 * 60000);
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

   const getCurrentTimePosition = () => {
      if (!isToday) return -1;

      const startHour = 8;
      const endHour = 24;
      const currentHour = currentTime.getHours();
      const currentMinutes = currentTime.getMinutes();

      if (currentHour < startHour || currentHour > endHour) return -1;

      const totalMinutes = (currentHour - startHour) * 60 + currentMinutes;
      const totalDayMinutes = (endHour - startHour) * 60;
      return (totalMinutes / totalDayMinutes) * 100;
   };

   const getAppointmentPosition = (appointment: CalendarAppointment) => {
      const startTime = new Date(appointment.startTime);
      const startHour = startTime.getHours();
      const startMinute = startTime.getMinutes();

      const totalMinutes = (startHour - 8) * 60 + startMinute;
      const left = (totalMinutes / (12 * 60)) * 100;
      const width = (appointment.duration / (12 * 60)) * 100;

      return { left, width };
   };

   const getStatusColor = (status: CalendarAppointment["status"]) => {
      switch (status) {
         case "confirmed":
            return "bg-blue-500/20 border-blue-500 text-blue-700 dark:text-blue-400";
         case "in-progress":
            return "bg-orange-500/20 border-orange-500 text-orange-700 dark:text-orange-400";
         case "completed":
            return "bg-green-500/20 border-green-500 text-green-700 dark:text-green-400";
         case "cancelled":
            return "bg-muted border-muted-foreground/20 text-muted-foreground";
         case "no-show":
            return "bg-red-500/20 border-red-500 text-red-700 dark:text-red-400";
      }
   };

   const getStatusIcon = (status: CalendarAppointment["status"]) => {
      switch (status) {
         case "completed":
            return <CheckCircle className="h-3 w-3" />;
         case "in-progress":
            return <AlertCircle className="h-3 w-3" />;
         case "no-show":
            return <AlertCircle className="h-3 w-3" />;
         default:
            return null;
      }
   };

   const getTimeOffForEmployee = (employeeId: string): TimeOffEntry | undefined => {
      return timeOffEntries.find(
         (entry) => entry.employeeId === employeeId && new Date(entry.startDate) <= date && new Date(entry.endDate) >= date
      );
   };

   const getWorkingHoursForEmployee = (employeeId: string): WorkingHours | undefined => {
      return workingHours.find((hours) => hours.employeeId === employeeId && hours.dayOfWeek === date.getDay());
   };

   const getAppointmentsForEmployee = (employeeId: string) => {
      return appointments.filter(
         (apt) => apt.employeeId === employeeId && new Date(apt.startTime).toDateString() === date.toDateString()
      );
   };

   const currentTimePosition = getCurrentTimePosition();

   if (isMobile) {
      return (
         <Card className="overflow-hidden">
            <CardHeader className="pb-3">
               <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                     <Clock className="h-4 w-4 text-primary" />
                     Day Schedule
                  </CardTitle>
                  {isToday && (
                     <Badge variant="outline" className="font-semibold">
                        Live
                     </Badge>
                  )}
               </div>
            </CardHeader>
            <CardContent className="space-y-4">
               {/* Current Time Indicator */}
               {isToday && currentTimePosition >= 0 && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-lg border border-primary/20">
                     <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                     <span className="text-sm font-semibold text-primary">Now: {formatTime(currentTime)}</span>
                  </div>
               )}

               {/* Staff Schedule List */}
               <div className="space-y-3">
                  {employees.map((employee) => {
                     const employeeAppointments = getAppointmentsForEmployee(employee.id);

                     return (
                        <div key={employee.id} className="space-y-2 p-3 bg-card/50 rounded-lg border border-border">
                           <div
                              className="flex items-center justify-between cursor-pointer"
                              onClick={() => onEmployeeClick(employee)}
                           >
                              <div className="flex items-center gap-2">
                                 <div className="h-2 w-2 rounded-full" style={{ backgroundColor: employee.color }} />
                                 <span className="text-sm font-semibold">{employee.name}</span>
                              </div>
                              <span className="text-xs text-muted-foreground">{employeeAppointments.length} apts</span>
                           </div>

                           {employeeAppointments.length === 0 ? (
                              <div className="text-xs text-muted-foreground italic pl-4">No appointments scheduled</div>
                           ) : (
                              <div className="space-y-2 pl-4">
                                 {employeeAppointments
                                    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                                    .map((apt) => (
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
                                                <p className="text-xs font-semibold">
                                                   {new Date(apt.startTime).toLocaleTimeString("en-US", {
                                                      hour: "numeric",
                                                      minute: "2-digit",
                                                   })}
                                                </p>
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

   // Desktop - EXACTLY like Live Schedule Timeline
   return (
      <Card className="overflow-hidden">
         <CardHeader>
            <div className="flex items-center justify-between">
               <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Day Schedule
               </CardTitle>
               {isToday && (
                  <Badge variant="outline" className="font-semibold">
                     Live
                  </Badge>
               )}
            </div>
         </CardHeader>
         <CardContent>
            {/* Time Header */}
            <div className="relative mb-4">
               <div className="flex border-b border-border pb-2">
                  <div className="w-32 flex-shrink-0" />
                  <div className="flex-1 relative">
                     <div className="flex justify-between text-xs font-medium text-muted-foreground">
                        {timeSlots.map((slot, idx) => (
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
               {employees.map((employee) => {
                  const timeOff = getTimeOffForEmployee(employee.id);
                  const workingHour = getWorkingHoursForEmployee(employee.id);
                  const employeeAppointments = getAppointmentsForEmployee(employee.id);

                  return (
                     <div key={employee.id} className="flex items-stretch group hover:bg-accent/5 rounded-lg transition-colors">
                        {/* Staff Name */}
                        <div
                           className="w-32 flex-shrink-0 flex items-center gap-2 px-3 py-2 cursor-pointer"
                           onClick={() => onEmployeeClick(employee)}
                        >
                           <div className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: employee.color }} />
                           <div className="min-w-0">
                              <p className="text-sm font-semibold truncate">{employee.name}</p>
                              <p className="text-xs text-muted-foreground truncate">{employee.role}</p>
                           </div>
                        </div>

                        {/* Timeline */}
                        <div className="flex-1 relative min-h-[60px] border-l border-border">
                           {/* Time Grid - vertical lines every 2 hours */}
                           <div className="absolute inset-0 flex">
                              {timeSlots.slice(0, -1).map((_, idx) => (
                                 <div key={idx} className="flex-1 border-r border-border/30" />
                              ))}
                           </div>

                           {/* Current Time Line */}
                           {isToday && currentTimePosition >= 0 && (
                              <div
                                 className="absolute top-0 bottom-0 w-0.5 bg-primary z-20"
                                 style={{ left: `${currentTimePosition}%` }}
                              >
                                 <div className="absolute -top-1 -left-1.5 h-3 w-3 rounded-full bg-primary animate-pulse" />
                              </div>
                           )}

                           {/* Time-off overlay */}
                           {timeOff && (
                              <div className="absolute inset-0 flex items-center justify-center bg-muted/30">
                                 <span className="text-sm text-muted-foreground italic">{timeOff.type.replace("-", " ")}</span>
                              </div>
                           )}

                           {/* Not working overlay */}
                           {!timeOff && workingHour && !workingHour.isWorkingDay && (
                              <div className="absolute inset-0 flex items-center justify-center bg-muted/30">
                                 <span className="text-sm text-muted-foreground italic">Not working</span>
                              </div>
                           )}

                           {/* Appointments */}
                           {!timeOff &&
                              workingHour?.isWorkingDay &&
                              employeeAppointments.map((apt) => {
                                 const { left, width } = getAppointmentPosition(apt);

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
                           {!timeOff && workingHour?.isWorkingDay && employeeAppointments.length === 0 && (
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
            {isToday && currentTimePosition >= 0 && (
               <div className="mt-4 pt-4 border-t flex items-center justify-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-sm font-semibold text-primary">Current Time: {formatTime(currentTime)}</span>
               </div>
            )}
         </CardContent>
      </Card>
   );
}
