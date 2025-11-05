import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Coffee, Plane, Umbrella, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCalendarStore } from "@/features/core/store/store.calendar";
import {
   useCalendarEmployees,
   useCalendarAppointments,
   useTimeOffEntries,
   useWorkingHours,
} from "@/features/core/hooks/queries/queries.calendar";
import type { TimeOffEntry } from "@/features/core/types/types.calendar";

function getWeekStart(date: Date) {
   const d = new Date(date);
   const day = d.getDay();
   const diff = d.getDate() - day;
   return new Date(d.setDate(diff));
}

function getTimeOffIcon(type: TimeOffEntry["type"]) {
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
}

export function CalendarWeekView() {
   const isMobile = useIsMobile();
   const { currentDate, setCurrentDate, setViewMode } = useCalendarStore();
   const { data: employees = [] } = useCalendarEmployees();
   const { data: allAppointments = [] } = useCalendarAppointments();
   const { data: timeOffEntries = [] } = useTimeOffEntries();
   const { data: workingHours = [] } = useWorkingHours();

   const weekStart = getWeekStart(currentDate);
   const days = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      return day;
   });

   const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
   const today = new Date();

   const isToday = (date: Date) => date.toDateString() === today.toDateString();

   const getAppointmentsForEmployeeOnDate = (employeeId: string, date: Date) => {
      return allAppointments.filter(
         (apt) => apt.employeeId === employeeId && new Date(apt.startTime).toDateString() === date.toDateString()
      );
   };

   const getTimeOffForEmployeeOnDate = (employeeId: string, date: Date) => {
      return timeOffEntries.find(
         (entry) => entry.employeeId === employeeId && new Date(entry.startDate) <= date && new Date(entry.endDate) >= date
      );
   };

   const getWorkingHoursForEmployeeOnDate = (employeeId: string, date: Date) => {
      return workingHours.find((hours) => hours.employeeId === employeeId && hours.dayOfWeek === date.getDay());
   };

   const handleDayClick = (date: Date) => {
      setCurrentDate(date);
      setViewMode("day");
   };

   if (isMobile) {
      return (
         <div className="space-y-3">
            {days.map((day) => (
               <Card key={day.toISOString()} className="overflow-hidden">
                  <div
                     className={cn(
                        "p-3 border-b font-semibold bg-gradient-to-r from-muted/50 to-transparent cursor-pointer hover:bg-muted/80 transition-colors",
                        isToday(day) && "from-primary/10 via-primary/5 to-transparent border-primary/30"
                     )}
                     onClick={() => handleDayClick(day)}
                  >
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <span className="text-sm text-muted-foreground">{dayNames[day.getDay()]}</span>
                           <span className={cn("text-lg font-bold", isToday(day) && "text-primary")}>{day.getDate()}</span>
                        </div>
                        {isToday(day) && (
                           <Badge variant="default" className="text-xs">
                              Today
                           </Badge>
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
                              className="flex items-center justify-between p-2 border rounded-lg hover:bg-accent/5 transition-colors"
                              style={{ borderLeftWidth: 3, borderLeftColor: employee.color }}
                           >
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                 <span className="text-sm font-medium truncate">{employee.name}</span>
                              </div>

                              {timeOff ? (
                                 <div className="flex items-center gap-1 text-xs text-amber-600">
                                    {getTimeOffIcon(timeOff.type)}
                                    <span className="capitalize">{timeOff.type.replace("-", " ")}</span>
                                 </div>
                              ) : !workingHour?.isWorkingDay ? (
                                 <span className="text-xs text-muted-foreground italic">Off</span>
                              ) : (
                                 <Badge variant={empAppointments.length > 0 ? "default" : "outline"}>
                                    {empAppointments.length}
                                 </Badge>
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

   return (
      <Card>
         <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
               <CalendarIcon className="h-5 w-5 text-primary" />
               Week View
            </CardTitle>
         </CardHeader>
         <CardContent>
            <div className="grid grid-cols-8 border rounded-lg overflow-hidden">
               <div className="h-full flex justify-center items-center p-3 border-r bg-muted/30 font-semibold text-sm">
                  Employee
               </div>
               {days.map((day) => (
                  <div
                     key={day.toISOString()}
                     className={cn(
                        "p-3 border-r text-center cursor-pointer hover:bg-accent/5 transition-colors",
                        isToday(day) && "bg-primary/10"
                     )}
                     onClick={() => handleDayClick(day)}
                  >
                     <div className="text-xs text-muted-foreground font-medium">{dayNames[day.getDay()]}</div>
                     <div className={cn("text-xl font-bold mt-1", isToday(day) && "text-primary")}>{day.getDate()}</div>
                     {isToday(day) && (
                        <div className="flex items-center justify-center gap-1 mt-1">
                           <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                        </div>
                     )}
                  </div>
               ))}

               {employees.map((employee, empIndex) => (
                  <div key={employee.id} className={cn("contents", empIndex !== 0 && "border-t")}>
                     <div
                        className="p-3 border-r border-t bg-muted/10"
                        style={{ borderLeftWidth: 4, borderLeftColor: employee.color }}
                     >
                        <div className="flex items-center gap-2">
                           <div
                              className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
                              style={{ backgroundColor: employee.color }}
                           >
                              {employee.name
                                 .split(" ")
                                 .map((n) => n[0])
                                 .join("")}
                           </div>
                           <div className="min-w-0">
                              <p className="text-sm font-semibold truncate">{employee.name}</p>
                              <p className="text-xs text-muted-foreground truncate">{employee.role}</p>
                           </div>
                        </div>
                     </div>

                     {days.map((day) => {
                        const timeOff = getTimeOffForEmployeeOnDate(employee.id, day);
                        const workingHour = getWorkingHoursForEmployeeOnDate(employee.id, day);
                        const dayAppointments = getAppointmentsForEmployeeOnDate(employee.id, day);

                        return (
                           <div
                              key={day.toISOString()}
                              className={cn(
                                 "p-3 border-r border-t flex items-center justify-center cursor-pointer hover:bg-accent/5 transition-colors",
                                 isToday(day) && "bg-primary/5"
                              )}
                              onClick={() => handleDayClick(day)}
                           >
                              {timeOff ? (
                                 <div className="flex flex-col items-center gap-1 text-amber-600">
                                    {getTimeOffIcon(timeOff.type)}
                                    <span className="text-xs font-medium capitalize">{timeOff.type.replace("-", " ")}</span>
                                 </div>
                              ) : !workingHour?.isWorkingDay ? (
                                 <span className="text-sm text-muted-foreground italic">Off</span>
                              ) : (
                                 <div className="flex flex-col items-center gap-1">
                                    <Badge
                                       variant={dayAppointments.length > 0 ? "default" : "outline"}
                                       className="text-base font-bold min-w-[40px] justify-center"
                                    >
                                       {dayAppointments.length}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                       {dayAppointments.length === 1 ? "apt" : "apts"}
                                    </span>
                                 </div>
                              )}
                           </div>
                        );
                     })}
                  </div>
               ))}
            </div>
         </CardContent>
      </Card>
   );
}
