import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coffee, Plane, Umbrella, Home, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CalendarEmployee, CalendarAppointment, TimeOffEntry, WorkingHours } from "@/mock/calendar-viewer-mock";

interface CalendarMonthViewProps {
   month: Date;
   employees: CalendarEmployee[];
   appointments: CalendarAppointment[];
   timeOffEntries: TimeOffEntry[];
   workingHours: WorkingHours[];
   onDateClick: (date: Date) => void;
   isMobile: boolean;
}

export function CalendarMonthView({
   month,
   employees,
   appointments,
   timeOffEntries,
   workingHours,
   onDateClick,
   isMobile,
}: CalendarMonthViewProps) {
   const generateCalendarDays = () => {
      const year = month.getFullYear();
      const monthIndex = month.getMonth();
      const firstDay = new Date(year, monthIndex, 1);
      const startingDayOfWeek = firstDay.getDay();
      const lastDay = new Date(year, monthIndex + 1, 0);
      const daysInMonth = lastDay.getDate();
      const prevMonth = new Date(year, monthIndex, 0);
      const daysInPrevMonth = prevMonth.getDate();

      const days: (Date | null)[] = [];

      for (let i = startingDayOfWeek - 1; i >= 0; i--) {
         days.push(new Date(year, monthIndex - 1, daysInPrevMonth - i));
      }

      for (let i = 1; i <= daysInMonth; i++) {
         days.push(new Date(year, monthIndex, i));
      }

      const remainingDays = 42 - days.length;
      for (let i = 1; i <= remainingDays; i++) {
         days.push(new Date(year, monthIndex + 1, i));
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

   const isToday = (date: Date | null) => {
      if (!date) return false;
      return date.toDateString() === today.toDateString();
   };

   const isCurrentMonth = (date: Date | null) => {
      if (!date) return false;
      return date.getMonth() === month.getMonth();
   };

   const getAppointmentsForDate = (date: Date | null) => {
      if (!date) return [];
      return appointments.filter((apt) => new Date(apt.startTime).toDateString() === date.toDateString());
   };

   const getTimeOffForDate = (date: Date | null) => {
      if (!date) return [];
      return timeOffEntries.filter((entry) => new Date(entry.startDate) <= date! && new Date(entry.endDate) >= date!);
   };

   const getWorkingEmployeesForDate = (date: Date | null) => {
      if (!date) return 0;
      return employees.filter((emp) => {
         const timeOff = timeOffEntries.find(
            (entry) => entry.employeeId === emp.id && new Date(entry.startDate) <= date && new Date(entry.endDate) >= date
         );
         if (timeOff) return false;

         const workingHour = workingHours.find((hours) => hours.employeeId === emp.id && hours.dayOfWeek === date.getDay());
         return workingHour?.isWorkingDay ?? false;
      }).length;
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

   if (isMobile) {
      return (
         <Card className="overflow-hidden">
            <CardHeader>
               <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                  Month View
               </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
               {/* Day names header */}
               <div className="grid grid-cols-7 border-b bg-muted/50">
                  {dayNames.map((name) => (
                     <div key={name} className="p-2 text-center text-xs font-semibold border-r last:border-r-0">
                        {name.slice(0, 1)}
                     </div>
                  ))}
               </div>

               {/* Calendar grid */}
               {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="grid grid-cols-7 border-b last:border-b-0">
                     {week.map((date, dayIndex) => {
                        const dateAppointments = getAppointmentsForDate(date);
                        const dateTimeOff = getTimeOffForDate(date);
                        const workingCount = getWorkingEmployeesForDate(date);

                        return (
                           <div
                              key={dayIndex}
                              className={cn(
                                 "min-h-[60px] p-1.5 border-r last:border-r-0 cursor-pointer",
                                 !isCurrentMonth(date) && "bg-muted/30 opacity-50",
                                 isToday(date) && "bg-primary/10 border-primary border-2"
                              )}
                              onClick={() => date && onDateClick(date)}
                           >
                              <div className="text-xs font-semibold mb-1">{date?.getDate()}</div>

                              <div className="space-y-0.5">
                                 {dateAppointments.length > 0 && (
                                    <div className="text-[10px] bg-blue-500 text-white rounded px-1 text-center">
                                       {dateAppointments.length}
                                    </div>
                                 )}

                                 {dateTimeOff.length > 0 && (
                                    <div className="flex flex-wrap gap-0.5">
                                       {dateTimeOff.slice(0, 2).map((entry) => (
                                          <div key={entry.id} className="text-[10px] bg-amber-500 text-white rounded px-1">
                                             {getTimeOffIcon(entry.type)}
                                          </div>
                                       ))}
                                    </div>
                                 )}

                                 {workingCount > 0 && (
                                    <div className="text-[10px] text-muted-foreground">{workingCount} staff</div>
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

   // Desktop view
   return (
      <Card className="overflow-hidden">
         <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
               <CalendarIcon className="h-5 w-5 text-primary" />
               Month View
            </CardTitle>
         </CardHeader>
         <CardContent className="p-0">
            {/* Day names header */}
            <div className="grid grid-cols-7 border-b bg-muted/50">
               {dayNames.map((name) => (
                  <div key={name} className="p-3 text-center font-semibold border-r last:border-r-0">
                     {name}
                  </div>
               ))}
            </div>

            {/* Calendar grid */}
            {weeks.map((week, weekIndex) => (
               <div key={weekIndex} className="grid grid-cols-7 border-b last:border-b-0">
                  {week.map((date, dayIndex) => {
                     const dateAppointments = getAppointmentsForDate(date);
                     const dateTimeOff = getTimeOffForDate(date);
                     const workingCount = getWorkingEmployeesForDate(date);

                     return (
                        <div
                           key={dayIndex}
                           className={cn(
                              "min-h-[120px] p-2 border-r last:border-r-0 cursor-pointer hover:bg-accent/5",
                              !isCurrentMonth(date) && "bg-muted/30 opacity-50",
                              isToday(date) && "bg-primary/10 border-primary border-2"
                           )}
                           onClick={() => date && onDateClick(date)}
                        >
                           <div className="flex items-center justify-between mb-2">
                              <div className={cn("text-sm font-semibold", isToday(date) && "text-primary")}>
                                 {date?.getDate()}
                              </div>
                              {workingCount > 0 && (
                                 <Badge variant="outline" className="text-xs h-5">
                                    {workingCount} staff
                                 </Badge>
                              )}
                           </div>

                           <div className="space-y-1">
                              {/* Appointments */}
                              {dateAppointments.length > 0 && (
                                 <div className="space-y-0.5">
                                    <div className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                                       {dateAppointments.length} apt
                                       {dateAppointments.length !== 1 ? "s" : ""}
                                    </div>
                                    {/* Show appointment breakdown */}
                                    <div className="flex flex-wrap gap-0.5">
                                       {dateAppointments
                                          .reduce((acc, apt) => {
                                             const existing = acc.find((a) => a.status === apt.status);
                                             if (existing) {
                                                existing.count++;
                                             } else {
                                                acc.push({ status: apt.status, count: 1 });
                                             }
                                             return acc;
                                          }, [] as { status: string; count: number }[])
                                          .map((group, idx) => (
                                             <div
                                                key={idx}
                                                className={cn(
                                                   "text-[10px] px-1 py-0.5 rounded",
                                                   group.status === "confirmed" && "bg-blue-500 text-white",
                                                   group.status === "in-progress" && "bg-purple-500 text-white",
                                                   group.status === "completed" && "bg-green-500 text-white",
                                                   group.status === "cancelled" && "bg-gray-500 text-white",
                                                   group.status === "no-show" && "bg-red-500 text-white"
                                                )}
                                             >
                                                {group.count}
                                             </div>
                                          ))}
                                    </div>
                                 </div>
                              )}

                              {/* Time off */}
                              {dateTimeOff.length > 0 && (
                                 <div className="space-y-0.5">
                                    {dateTimeOff.slice(0, 3).map((entry) => {
                                       const employee = employees.find((emp) => emp.id === entry.employeeId);
                                       return (
                                          <div
                                             key={entry.id}
                                             className="flex items-center gap-1 text-xs text-amber-700 dark:text-amber-400"
                                          >
                                             {getTimeOffIcon(entry.type)}
                                             <span className="truncate">{employee?.name.split(" ")[0]}</span>
                                          </div>
                                       );
                                    })}
                                    {dateTimeOff.length > 3 && (
                                       <div className="text-xs text-muted-foreground">+{dateTimeOff.length - 3} more</div>
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
