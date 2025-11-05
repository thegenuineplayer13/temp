import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coffee, Plane, Umbrella, Home, AlertCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CalendarEmployee, CalendarAppointment, TimeOffEntry, WorkingHours } from "@/mock/calendar-viewer-mock";

interface CalendarWeekViewProps {
   weekStart: Date;
   employees: CalendarEmployee[];
   appointments: CalendarAppointment[];
   timeOffEntries: TimeOffEntry[];
   workingHours: WorkingHours[];
   onAppointmentClick: (appointment: CalendarAppointment) => void;
   onEmployeeClick: (employee: CalendarEmployee) => void;
   onDayClick: (date: Date, employee: CalendarEmployee) => void;
   isMobile: boolean;
}

export function CalendarWeekView({
   weekStart,
   employees,
   appointments,
   timeOffEntries,
   workingHours,
   onAppointmentClick,
   onEmployeeClick,
   onDayClick,
   isMobile,
}: CalendarWeekViewProps) {
   const days = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      return day;
   });

   const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
   const today = new Date();

   const isToday = (date: Date) => {
      return date.toDateString() === today.toDateString();
   };

   const getTimeOffForEmployeeOnDate = (employeeId: string, date: Date): TimeOffEntry | undefined => {
      return timeOffEntries.find(
         (entry) => entry.employeeId === employeeId && new Date(entry.startDate) <= date && new Date(entry.endDate) >= date
      );
   };

   const getWorkingHoursForEmployeeOnDate = (employeeId: string, date: Date): WorkingHours | undefined => {
      return workingHours.find((hours) => hours.employeeId === employeeId && hours.dayOfWeek === date.getDay());
   };

   const getAppointmentsForEmployeeOnDate = (employeeId: string, date: Date) => {
      return appointments.filter(
         (apt) => apt.employeeId === employeeId && new Date(apt.startTime).toDateString() === date.toDateString()
      );
   };

   const getStatusColor = (status: CalendarAppointment["status"]) => {
      switch (status) {
         case "confirmed":
            return "bg-blue-500 text-white hover:bg-blue-600";
         case "in-progress":
            return "bg-purple-500 text-white hover:bg-purple-600";
         case "completed":
            return "bg-green-500 text-white hover:bg-green-600";
         case "cancelled":
            return "bg-gray-400 text-white hover:bg-gray-500";
         case "no-show":
            return "bg-red-500 text-white hover:bg-red-600";
      }
   };

   const getTimeOffIcon = (type: TimeOffEntry["type"]) => {
      switch (type) {
         case "vacation":
            return <Plane className="h-3 w-3" />;
         case "sick":
            return <Umbrella className="h-3 w-3" />;
         case "day-off":
            return <Home className="h-3 w-3" />;
         case "holiday":
            return <Coffee className="h-3 w-3" />;
         default:
            return null;
      }
   };

   const getTimeOffColor = (type: TimeOffEntry["type"]) => {
      switch (type) {
         case "vacation":
            return "bg-gradient-to-br from-sky-100 to-sky-50 border-sky-400 text-sky-700 dark:from-sky-950 dark:to-sky-900 dark:border-sky-600 dark:text-sky-300";
         case "sick":
            return "bg-gradient-to-br from-red-100 to-red-50 border-red-400 text-red-700 dark:from-red-950 dark:to-red-900 dark:border-red-600 dark:text-red-300";
         case "day-off":
            return "bg-gradient-to-br from-gray-100 to-gray-50 border-gray-400 text-gray-700 dark:from-gray-800 dark:to-gray-900 dark:border-gray-600 dark:text-gray-300";
         case "holiday":
            return "bg-gradient-to-br from-green-100 to-green-50 border-green-400 text-green-700 dark:from-green-950 dark:to-green-900 dark:border-green-600 dark:text-green-300";
         default:
            return "bg-gradient-to-br from-gray-100 to-gray-50 border-gray-400 text-gray-700 dark:from-gray-800 dark:to-gray-900 dark:border-gray-600 dark:text-gray-300";
      }
   };

   if (isMobile) {
      return (
         <div className="space-y-3">
            {days.map((day) => (
               <Card key={day.toISOString()} className="overflow-hidden shadow-sm">
                  <div
                     className={cn(
                        "p-3 border-b font-semibold bg-gradient-to-r from-muted/50 to-transparent",
                        isToday(day) && "from-primary/10 via-primary/5 to-transparent border-primary/30"
                     )}
                  >
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <span className="text-sm text-muted-foreground">{dayNames[day.getDay()]}</span>
                           <span className={cn("text-lg font-bold", isToday(day) && "text-primary")}>{day.getDate()}</span>
                        </div>
                        {isToday(day) && (
                           <div className="flex items-center gap-1.5">
                              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                              <Badge variant="default" className="text-xs font-semibold">
                                 Today
                              </Badge>
                           </div>
                        )}
                     </div>
                  </div>

                  <CardContent className="p-3 space-y-2">
                     {employees.map((employee) => {
                        const timeOff = getTimeOffForEmployeeOnDate(employee.id, day);
                        const workingHour = getWorkingHoursForEmployeeOnDate(employee.id, day);
                        const empAppointments = getAppointmentsForEmployeeOnDate(employee.id, day);

                        return (
                           <div
                              key={employee.id}
                              className="p-2 border rounded-lg hover:bg-accent/5 transition-colors"
                              style={{
                                 borderLeftWidth: 3,
                                 borderLeftColor: employee.color,
                              }}
                           >
                              <div
                                 className="flex items-center justify-between mb-1.5 cursor-pointer"
                                 onClick={() => onEmployeeClick(employee)}
                              >
                                 <div className="flex items-center gap-2">
                                    <div
                                       className="h-6 w-6 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                                       style={{ backgroundColor: employee.color }}
                                    >
                                       {employee.name
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")}
                                    </div>
                                    <span className="text-sm font-semibold truncate">{employee.name}</span>
                                 </div>
                                 <Badge variant="secondary" className="text-xs">
                                    {empAppointments.length}
                                 </Badge>
                              </div>

                              {timeOff && (
                                 <div
                                    className={cn(
                                       "flex items-center gap-1.5 text-xs p-1.5 rounded border-2 font-medium",
                                       getTimeOffColor(timeOff.type)
                                    )}
                                 >
                                    {getTimeOffIcon(timeOff.type)}
                                    <span className="capitalize">{timeOff.type.replace("-", " ")}</span>
                                 </div>
                              )}

                              {!timeOff && !workingHour?.isWorkingDay && (
                                 <div className="text-xs text-muted-foreground italic p-1.5 bg-muted/30 rounded">Day off</div>
                              )}

                              {!timeOff && workingHour?.isWorkingDay && (
                                 <div className="flex flex-wrap gap-1 mt-1">
                                    {empAppointments.length === 0 ? (
                                       <span className="text-xs text-muted-foreground italic">No appointments</span>
                                    ) : (
                                       empAppointments.slice(0, 3).map((apt) => (
                                          <div
                                             key={apt.id}
                                             onClick={() => onAppointmentClick(apt)}
                                             className={cn(
                                                "text-xs px-2 py-1 rounded cursor-pointer transition-all font-medium shadow-sm",
                                                getStatusColor(apt.status)
                                             )}
                                          >
                                             {new Date(apt.startTime).toLocaleTimeString("en-US", {
                                                hour: "numeric",
                                                minute: "2-digit",
                                             })}
                                          </div>
                                       ))
                                    )}
                                    {empAppointments.length > 3 && (
                                       <span className="text-xs text-muted-foreground px-2 py-1">
                                          +{empAppointments.length - 3}
                                       </span>
                                    )}
                                 </div>
                              )}
                           </div>
                        );
                     })}
                  </CardContent>
               </Card>
            ))}
         </div>
      );
   }

   // Desktop view with legend
   return (
      <div className="flex gap-4">
         {/* Main calendar grid */}
         <div className="flex-1">
            <Card className="overflow-hidden shadow-md">
               {/* Week header */}
               <div className="grid grid-cols-8 border-b bg-muted/30">
                  <div className="p-3 border-r font-semibold bg-muted/50">
                     <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="text-sm">Employee</span>
                     </div>
                  </div>
                  {days.map((day) => (
                     <div
                        key={day.toISOString()}
                        className={cn(
                           "p-3 border-r text-center transition-colors",
                           isToday(day) && "bg-primary/10 border-primary/30"
                        )}
                     >
                        <div className="text-xs text-muted-foreground font-medium">{dayNames[day.getDay()]}</div>
                        <div className={cn("text-2xl font-bold mt-1", isToday(day) && "text-primary")}>{day.getDate()}</div>
                        {isToday(day) && (
                           <div className="flex items-center justify-center gap-1 mt-1">
                              <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                              <span className="text-xs font-semibold text-primary">Today</span>
                           </div>
                        )}
                     </div>
                  ))}
               </div>

               {/* Employee rows */}
               <div>
                  {employees.map((employee, empIndex) => (
                     <div
                        key={employee.id}
                        className={cn(
                           "grid grid-cols-8 hover:bg-accent/5 transition-colors",
                           empIndex !== employees.length - 1 && "border-b"
                        )}
                     >
                        {/* Employee cell */}
                        <div
                           className="p-3 border-r cursor-pointer bg-gradient-to-r from-muted/20 to-transparent hover:from-muted/40 transition-colors"
                           onClick={() => onEmployeeClick(employee)}
                           style={{ borderLeftWidth: 4, borderLeftColor: employee.color }}
                        >
                           <div className="flex items-center gap-2">
                              <div
                                 className="h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                                 style={{ backgroundColor: employee.color }}
                              >
                                 {employee.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                              </div>
                              <div className="min-w-0">
                                 <p className="font-semibold text-sm truncate">{employee.name}</p>
                                 <p className="text-xs text-muted-foreground truncate">{employee.role}</p>
                              </div>
                           </div>
                        </div>

                        {/* Day cells */}
                        {days.map((day, dayIndex) => {
                           const timeOff = getTimeOffForEmployeeOnDate(employee.id, day);
                           const workingHour = getWorkingHoursForEmployeeOnDate(employee.id, day);
                           const dayAppointments = getAppointmentsForEmployeeOnDate(employee.id, day);

                           return (
                              <div
                                 key={day.toISOString()}
                                 className={cn(
                                    "p-2 border-r min-h-[120px] cursor-pointer hover:bg-accent/5 transition-colors relative",
                                    isToday(day) && "bg-primary/5"
                                 )}
                                 onClick={() => onDayClick(day, employee)}
                              >
                                 {/* Current day indicator bar */}
                                 {isToday(day) && (
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary/50" />
                                 )}

                                 {/* Time off */}
                                 {timeOff && (
                                    <div
                                       className={cn(
                                          "absolute inset-2 flex flex-col items-center justify-center border-2 rounded-lg backdrop-blur-sm",
                                          getTimeOffColor(timeOff.type)
                                       )}
                                    >
                                       <div className="flex flex-col items-center gap-1">
                                          {getTimeOffIcon(timeOff.type)}
                                          <span className="text-xs font-semibold capitalize text-center">
                                             {timeOff.type.replace("-", " ")}
                                          </span>
                                       </div>
                                    </div>
                                 )}

                                 {/* Not working */}
                                 {!timeOff && !workingHour?.isWorkingDay && (
                                    <div className="absolute inset-2 flex items-center justify-center bg-muted/30 rounded-lg backdrop-blur-sm">
                                       <span className="text-xs text-muted-foreground italic">Off</span>
                                    </div>
                                 )}

                                 {/* Appointments */}
                                 {!timeOff && workingHour?.isWorkingDay && (
                                    <div className="space-y-1">
                                       {dayAppointments.length === 0 ? (
                                          <div className="text-xs text-muted-foreground text-center py-6 italic">
                                             No appointments
                                          </div>
                                       ) : (
                                          <>
                                             {dayAppointments
                                                .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                                                .slice(0, 4)
                                                .map((apt) => (
                                                   <div
                                                      key={apt.id}
                                                      onClick={(e) => {
                                                         e.stopPropagation();
                                                         onAppointmentClick(apt);
                                                      }}
                                                      className={cn(
                                                         "px-2 py-1.5 rounded text-xs cursor-pointer transition-all shadow-sm",
                                                         getStatusColor(apt.status)
                                                      )}
                                                   >
                                                      <div className="flex items-center justify-between gap-1 mb-0.5">
                                                         <span className="font-bold">
                                                            {new Date(apt.startTime).toLocaleTimeString("en-US", {
                                                               hour: "numeric",
                                                               minute: "2-digit",
                                                            })}
                                                         </span>
                                                         {apt.isUrgent && (
                                                            <AlertCircle className="h-3 w-3 flex-shrink-0 animate-pulse" />
                                                         )}
                                                      </div>
                                                      <p className="truncate font-medium opacity-90">{apt.clientName}</p>
                                                   </div>
                                                ))}
                                             {dayAppointments.length > 4 && (
                                                <div className="text-xs text-center text-muted-foreground font-medium pt-1">
                                                   +{dayAppointments.length - 4} more
                                                </div>
                                             )}
                                          </>
                                       )}
                                    </div>
                                 )}
                              </div>
                           );
                        })}
                     </div>
                  ))}
               </div>
            </Card>
         </div>

         {/* Subtle Legend */}
         <div className="w-48 flex-shrink-0">
            <Card className="sticky top-4 shadow-sm">
               <CardContent className="p-4 space-y-4">
                  <div>
                     <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <div className="h-1 w-6 bg-gradient-to-r from-primary to-transparent rounded-full" />
                        Status
                     </h3>
                     <div className="space-y-2">
                        <div className="flex items-center gap-2">
                           <div className="w-3 h-3 rounded-sm bg-blue-500 shadow-sm" />
                           <span className="text-xs">Confirmed</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <div className="w-3 h-3 rounded-sm bg-purple-500 shadow-sm" />
                           <span className="text-xs">In Progress</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <div className="w-3 h-3 rounded-sm bg-green-500 shadow-sm" />
                           <span className="text-xs">Completed</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <div className="w-3 h-3 rounded-sm bg-red-500 shadow-sm" />
                           <span className="text-xs">No Show</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <div className="w-3 h-3 rounded-sm bg-gray-400 shadow-sm" />
                           <span className="text-xs">Cancelled</span>
                        </div>
                     </div>
                  </div>

                  <div className="border-t pt-4">
                     <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <div className="h-1 w-6 bg-gradient-to-r from-amber-500 to-transparent rounded-full" />
                        Time Off
                     </h3>
                     <div className="space-y-2">
                        <div className="flex items-center gap-2">
                           <Plane className="h-3 w-3 text-sky-600" />
                           <span className="text-xs">Vacation</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <Umbrella className="h-3 w-3 text-red-600" />
                           <span className="text-xs">Sick</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <Home className="h-3 w-3 text-gray-600" />
                           <span className="text-xs">Day Off</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <Coffee className="h-3 w-3 text-green-600" />
                           <span className="text-xs">Holiday</span>
                        </div>
                     </div>
                  </div>

                  <div className="border-t pt-4">
                     <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <div className="h-1 w-6 bg-gradient-to-r from-primary to-transparent rounded-full" />
                        Today
                     </h3>
                     <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                        <span>Current day highlighted</span>
                     </div>
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>
   );
}
