import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Coffee, Plane, Umbrella, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCalendarStore } from "@/features/core/store/store.calendar";
import { useCalendarEmployees, useCalendarAppointments, useTimeOffEntries } from "@/features/core/hooks/queries/queries.calendar";
import type { TimeOffEntry } from "@/features/core/types/types.calendar";

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

export function CalendarMonthView() {
   const isMobile = useIsMobile();
   const { currentDate, setCurrentDate, setViewMode } = useCalendarStore();
   const { data: employees = [] } = useCalendarEmployees();
   const { data: allAppointments = [] } = useCalendarAppointments();
   const { data: timeOffEntries = [] } = useTimeOffEntries();

   const generateCalendarDays = () => {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const firstDay = new Date(year, month, 1);
      const startingDayOfWeek = firstDay.getDay();
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      const prevMonth = new Date(year, month, 0);
      const daysInPrevMonth = prevMonth.getDate();

      const days: Date[] = [];

      for (let i = startingDayOfWeek - 1; i >= 0; i--) {
         days.push(new Date(year, month - 1, daysInPrevMonth - i));
      }

      for (let i = 1; i <= daysInMonth; i++) {
         days.push(new Date(year, month, i));
      }

      const remainingDays = 42 - days.length;
      for (let i = 1; i <= remainingDays; i++) {
         days.push(new Date(year, month + 1, i));
      }

      return days;
   };

   const days = generateCalendarDays();
   const weeks = [];
   for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
   }

   const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
   const today = new Date();

   const isToday = (date: Date) => date.toDateString() === today.toDateString();
   const isCurrentMonth = (date: Date) => date.getMonth() === currentDate.getMonth();

   const getAppointmentsForDate = (date: Date) => {
      return allAppointments.filter((apt) => new Date(apt.startTime).toDateString() === date.toDateString());
   };

   const getTimeOffForDate = (date: Date) => {
      return timeOffEntries.filter((entry) => new Date(entry.startDate) <= date && new Date(entry.endDate) >= date);
   };

   const handleDateClick = (date: Date) => {
      setCurrentDate(date);
      setViewMode("day");
   };

   if (isMobile) {
      return (
         <Card>
            <CardHeader>
               <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-primary" />
                  Month View
               </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
               <div className="grid grid-cols-7 border-b bg-muted/50">
                  {dayNames.map((name) => (
                     <div key={name} className="p-2 text-center text-xs font-semibold border-r last:border-r-0">
                        {name.slice(0, 1)}
                     </div>
                  ))}
               </div>

               {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="grid grid-cols-7 border-b last:border-b-0">
                     {week.map((date, dayIndex) => {
                        const dateAppointments = getAppointmentsForDate(date);
                        const dateTimeOff = getTimeOffForDate(date);

                        return (
                           <div
                              key={dayIndex}
                              className={cn(
                                 "min-h-[60px] p-1.5 border-r last:border-r-0 cursor-pointer hover:bg-accent/5 transition-colors",
                                 !isCurrentMonth(date) && "bg-muted/30 opacity-50",
                                 isToday(date) && "bg-primary/10 border-primary border-2"
                              )}
                              onClick={() => handleDateClick(date)}
                           >
                              <div className="text-xs font-semibold mb-1">{date.getDate()}</div>

                              <div className="space-y-0.5">
                                 {dateAppointments.length > 0 && (
                                    <div className="text-[10px] bg-blue-500 text-white rounded px-1 text-center font-semibold">
                                       {dateAppointments.length}
                                    </div>
                                 )}

                                 {dateTimeOff.length > 0 && (
                                    <div className="flex flex-wrap gap-0.5">
                                       {dateTimeOff.slice(0, 1).map((entry) => (
                                          <div
                                             key={entry.id}
                                             className="w-full text-[10px] bg-amber-500 text-white rounded px-1 flex items-center gap-0.5"
                                          >
                                             {getTimeOffIcon(entry.type)}
                                          </div>
                                       ))}
                                    </div>
                                 )}
                              </div>
                           </div>
                        );
                     })}
                  </div>
               ))}
            </CardContent>
         </Card>
      );
   }

   return (
      <Card>
         <CardContent className="p-0">
            <div className="grid grid-cols-7 border-b bg-muted/50">
               {dayNames.map((name) => (
                  <div key={name} className="p-3 text-center font-semibold border-r last:border-r-0">
                     {name}
                  </div>
               ))}
            </div>

            {weeks.map((week, weekIndex) => (
               <div key={weekIndex} className="grid grid-cols-7 border-b last:border-b-0">
                  {week.map((date, dayIndex) => {
                     const dateAppointments = getAppointmentsForDate(date);
                     const dateTimeOff = getTimeOffForDate(date);
                     const workingStaffCount = employees.length - dateTimeOff.length;

                     return (
                        <div
                           key={dayIndex}
                           className={cn(
                              "min-h-[100px] p-2 border-r last:border-r-0 cursor-pointer hover:bg-accent/5 transition-colors",
                              !isCurrentMonth(date) && "bg-muted/30 opacity-50",
                              isToday(date) && "bg-primary/10 border-primary border-2"
                           )}
                           onClick={() => handleDateClick(date)}
                        >
                           <div className="flex items-center justify-between mb-2">
                              <div className={cn("text-sm font-semibold", isToday(date) && "text-primary")}>{date.getDate()}</div>
                              {workingStaffCount > 0 && (
                                 <Badge variant="outline" className="text-[10px] h-4 px-1">
                                    {workingStaffCount}
                                 </Badge>
                              )}
                           </div>

                           <div className="space-y-1.5">
                              {dateAppointments.length > 0 && (
                                 <div className="flex items-center justify-between px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded">
                                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">Appointments</span>
                                    <Badge variant="default" className="h-5 text-xs">
                                       {dateAppointments.length}
                                    </Badge>
                                 </div>
                              )}

                              {dateTimeOff.length > 0 && (
                                 <div className="space-y-0.5">
                                    {dateTimeOff.slice(0, 2).map((entry) => {
                                       const employee = employees.find((emp) => emp.id === entry.employeeId);
                                       return (
                                          <div
                                             key={entry.id}
                                             className="flex items-center gap-1 text-xs text-amber-700 dark:text-amber-400 px-1.5 py-0.5 bg-amber-500/10 rounded"
                                          >
                                             {getTimeOffIcon(entry.type)}
                                             <span className="truncate flex-1">{employee?.name.split(" ")[0]}</span>
                                          </div>
                                       );
                                    })}
                                    {dateTimeOff.length > 2 && (
                                       <div className="text-[10px] text-muted-foreground text-center">
                                          +{dateTimeOff.length - 2}
                                       </div>
                                    )}
                                 </div>
                              )}
                           </div>
                        </div>
                     );
                  })}
               </div>
            ))}
         </CardContent>
      </Card>
   );
}
