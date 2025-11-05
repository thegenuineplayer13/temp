import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCalendarStore } from "@/features/core/store/store.calendar";
import {
   useCalendarEmployees,
   useCalendarAppointments,
   useTimeOffEntries,
   useWorkingHours,
} from "@/features/core/hooks/queries/queries.calendar";
import type { CalendarAppointment } from "@/features/core/types/types.calendar";

export function CalendarDayView() {
   const isMobile = useIsMobile();
   const { currentDate, shiftStart, shiftEnd, setSelectedAppointment, setDetailOpen } = useCalendarStore();
   const { data: employees = [] } = useCalendarEmployees();
   const { data: allAppointments = [] } = useCalendarAppointments();
   const { data: timeOffEntries = [] } = useTimeOffEntries();
   const { data: workingHours = [] } = useWorkingHours();

   const [currentTime, setCurrentTime] = useState(new Date());

   useEffect(() => {
      const timer = setInterval(() => {
         setCurrentTime(new Date());
      }, 1000);
      return () => clearInterval(timer);
   }, []);

   const isToday = currentDate.toDateString() === currentTime.toDateString();

   const appointments = allAppointments.filter((apt) => {
      const aptDate = new Date(apt.startTime);
      return aptDate.toDateString() === currentDate.toDateString();
   });

   const generateTimeSlots = () => {
      const slots = [];
      for (let hour = shiftStart; hour <= shiftEnd; hour += 1) {
         const time = new Date(currentDate);
         time.setHours(hour, 0, 0, 0);
         slots.push(time);
      }
      return slots;
   };

   const timeSlots = generateTimeSlots();

   const formatTime = (date: Date) => {
      return date.toLocaleTimeString("en-US", {
         hour: "numeric",
         minute: "2-digit",
         second: "2-digit",
         hour12: true,
      });
   };

   const getCurrentTimePosition = () => {
      if (!isToday) return -1;

      const currentHour = currentTime.getHours();
      const currentMinutes = currentTime.getMinutes();

      if (currentHour < shiftStart || currentHour > shiftEnd) return -1;

      const totalMinutes = (currentHour - shiftStart) * 60 + currentMinutes;
      const totalDayMinutes = (shiftEnd - shiftStart) * 60;
      return (totalMinutes / totalDayMinutes) * 100;
   };

   const getAppointmentPosition = (appointment: CalendarAppointment) => {
      const startTime = new Date(appointment.startTime);
      const startHour = startTime.getHours();
      const startMinute = startTime.getMinutes();

      const totalMinutes = (startHour - shiftStart) * 60 + startMinute;
      const totalShiftMinutes = (shiftEnd - shiftStart) * 60;
      const left = (totalMinutes / totalShiftMinutes) * 100;
      const width = (appointment.duration / totalShiftMinutes) * 100;

      return { left, width };
   };

   const getStatusColor = (status: CalendarAppointment["status"]) => {
      switch (status) {
         case "confirmed":
            return "bg-blue-500/20 border-blue-500 text-blue-700 dark:text-blue-400";
         case "running-late":
            return "bg-yellow-500/20 border-yellow-500 text-yellow-700 dark:text-yellow-400";
         case "in-progress":
            return "bg-purple-500/20 border-purple-500 text-purple-700 dark:text-purple-400";
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
         case "running-late":
            return <AlertCircle className="h-3 w-3" />;
         case "no-show":
            return <AlertCircle className="h-3 w-3" />;
         default:
            return null;
      }
   };

   const getTimeOffForEmployee = (employeeId: string) => {
      return timeOffEntries.find(
         (entry) =>
            entry.employeeId === employeeId && new Date(entry.startDate) <= currentDate && new Date(entry.endDate) >= currentDate
      );
   };

   const getWorkingHoursForEmployee = (employeeId: string) => {
      return workingHours.find((hours) => hours.employeeId === employeeId && hours.dayOfWeek === currentDate.getDay());
   };

   const getAppointmentsForEmployee = (employeeId: string) => {
      return appointments.filter((apt) => apt.employeeId === employeeId);
   };

   const handleAppointmentClick = (appointment: CalendarAppointment) => {
      setSelectedAppointment(appointment);
      setDetailOpen(true);
   };

   const currentTimePosition = getCurrentTimePosition();

   if (isMobile) {
      return (
         <Card>
            <CardHeader className="pb-3">
               <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  Day Schedule
               </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               {isToday && currentTimePosition >= 0 && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-lg border border-primary/20">
                     <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                     <span className="text-sm font-semibold text-primary">{formatTime(currentTime)}</span>
                  </div>
               )}

               <div className="space-y-3">
                  {employees.map((employee) => {
                     const employeeAppointments = getAppointmentsForEmployee(employee.id);

                     return (
                        <div key={employee.id} className="space-y-2 p-3 bg-card/50 rounded-lg border border-border">
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                 <div className="h-2 w-2 rounded-full" style={{ backgroundColor: employee.color }} />
                                 <span className="text-sm font-semibold">{employee.name}</span>
                              </div>
                              <span className="text-xs text-muted-foreground">{employeeAppointments.length} apts</span>
                           </div>

                           {employeeAppointments.length === 0 ? (
                              <div className="text-xs text-muted-foreground italic pl-4">No appointments</div>
                           ) : (
                              <div className="space-y-2 pl-4">
                                 {employeeAppointments
                                    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                                    .map((apt) => (
                                       <div
                                          key={apt.id}
                                          onClick={() => handleAppointmentClick(apt)}
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
      <Card>
         <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
               <Clock className="h-5 w-5 text-primary" />
               Day Schedule
            </CardTitle>
         </CardHeader>
         <CardContent>
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

            <div className="space-y-3 relative">
               {employees.map((employee) => {
                  const timeOff = getTimeOffForEmployee(employee.id);
                  const workingHour = getWorkingHoursForEmployee(employee.id);
                  const employeeAppointments = getAppointmentsForEmployee(employee.id);

                  return (
                     <div key={employee.id} className="flex items-stretch group hover:bg-accent/5 rounded-lg transition-colors">
                        <div className="w-32 flex-shrink-0 flex items-center gap-2 px-3 py-2">
                           <div className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: employee.color }} />
                           <div className="min-w-0">
                              <p className="text-sm font-semibold truncate">{employee.name}</p>
                              <p className="text-xs text-muted-foreground truncate">{employee.role}</p>
                           </div>
                        </div>

                        <div className="flex-1 relative min-h-[60px] border-l border-border">
                           <div className="absolute inset-0 flex">
                              {timeSlots.slice(0, -1).map((_, idx) => (
                                 <div key={idx} className="flex-1 border-r border-border/30" />
                              ))}
                           </div>

                           {timeOff && (
                              <div className="absolute inset-0 flex items-center justify-center bg-muted/30">
                                 <span className="text-sm text-muted-foreground italic">{timeOff.type.replace("-", " ")}</span>
                              </div>
                           )}

                           {!timeOff && workingHour && !workingHour.isWorkingDay && (
                              <div className="absolute inset-0 flex items-center justify-center bg-muted/30">
                                 <span className="text-sm text-muted-foreground italic">Not working</span>
                              </div>
                           )}

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
                                       onClick={() => handleAppointmentClick(apt)}
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

                           {!timeOff && workingHour?.isWorkingDay && employeeAppointments.length === 0 && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                 <span className="text-xs text-muted-foreground italic">No appointments</span>
                              </div>
                           )}
                        </div>
                     </div>
                  );
               })}

               {isToday && currentTimePosition >= 0 && (
                  <div
                     className="absolute top-0 z-20 pointer-events-none"
                     style={{
                        left: `${currentTimePosition}%`,
                        height: `${employees.length * 60 + (employees.length - 1) * 12}px`,
                     }}
                  >
                     <div className="relative h-full">
                        <div className="absolute inset-y-0 left-0 w-0.5 bg-primary" />
                     </div>
                     <div className="flex items-center gap-2 px-3 py-2 bg-primary/5 border-l-2 border-primary">
                        <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
                        <span className="text-sm font-semibold text-primary">{formatTime(currentTime)}</span>
                     </div>
                  </div>
               )}
            </div>
         </CardContent>
      </Card>
   );
}
