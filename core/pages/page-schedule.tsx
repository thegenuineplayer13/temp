import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, Clock, Users, CheckCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCalendarStore } from "@/features/core/store/store.calendar";
import { useCalendarAppointments, useCalendarEmployees } from "@/features/core/hooks/queries/queries.calendar";
import { CalendarDayView } from "../components/calendar/calendar-day-view";
import { CalendarWeekView } from "../components/calendar/calendar-week-view";
import { CalendarMonthView } from "../components/calendar/calendar-month-view";
import { AppointmentDetail } from "../components/calendar/appointment-detail";
import { cn } from "@/lib/utils";

function getWeekStart(date: Date) {
   const d = new Date(date);
   const day = d.getDay();
   const diff = d.getDate() - day;
   return new Date(d.setDate(diff));
}

export default function CalendarViewer() {
   const isMobile = useIsMobile();
   const { viewMode, currentDate, setViewMode, previousPeriod, nextPeriod, goToToday } = useCalendarStore();
   const { data: appointments = [] } = useCalendarAppointments();
   const { data: employees = [] } = useCalendarEmployees();

   const getDisplayTitle = () => {
      const options: Intl.DateTimeFormatOptions = {
         month: "long",
         year: "numeric",
      };

      switch (viewMode) {
         case "day":
            return currentDate.toLocaleDateString("en-US", {
               weekday: "long",
               month: "long",
               day: "numeric",
               year: "numeric",
            });
         case "week":
            const weekStart = getWeekStart(currentDate);
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 6);
            return `${weekStart.toLocaleDateString("en-US", {
               month: "short",
               day: "numeric",
            })} - ${weekEnd.toLocaleDateString("en-US", {
               month: "short",
               day: "numeric",
               year: "numeric",
            })}`;
         case "month":
            return currentDate.toLocaleDateString("en-US", options);
      }
   };

   const filteredAppointments = useMemo(() => {
      const start = new Date(currentDate);
      const end = new Date(currentDate);

      switch (viewMode) {
         case "day":
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
            break;
         case "week":
            const weekStart = getWeekStart(currentDate);
            start.setTime(weekStart.getTime());
            start.setHours(0, 0, 0, 0);
            end.setTime(weekStart.getTime());
            end.setDate(end.getDate() + 6);
            end.setHours(23, 59, 59, 999);
            break;
         case "month":
            start.setDate(1);
            start.setHours(0, 0, 0, 0);
            end.setMonth(end.getMonth() + 1);
            end.setDate(0);
            end.setHours(23, 59, 59, 999);
            break;
      }

      return appointments.filter((apt) => {
         const aptDate = new Date(apt.startTime);
         return aptDate >= start && aptDate <= end;
      });
   }, [appointments, currentDate, viewMode]);

   const totalAppointments = filteredAppointments.length;
   const completedAppointments = filteredAppointments.filter((apt) => apt.status === "completed").length;
   const workingEmployees = employees.filter((emp) => {
      return filteredAppointments.some((apt) => apt.employeeId === emp.id);
   }).length;

   return (
      <div className="bg-background">
         <div className="sticky top-0 z-20 bg-background border-b">
            <div className="container mx-auto px-4 md:px-6 py-3 md:py-4">
               <div className="flex flex-col gap-3 md:gap-4">
                  {/* Navigation and Title Row */}
                  <div className={cn("flex gap-2", isMobile ? "flex-col items-center justify-center" : "justify-between")}>
                     <div className={cn("flex", isMobile ? "w-full justify-between items-center" : "items-center gap-2")}>
                        <Button variant="outline" size={isMobile ? "sm" : "default"} onClick={previousPeriod}>
                           <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <h2 className="font-semibold text-sm md:text-base whitespace-nowrap">{getDisplayTitle()}</h2>
                        <Button variant="outline" size={isMobile ? "sm" : "default"} onClick={nextPeriod}>
                           <ChevronRight className="h-4 w-4" />
                        </Button>
                     </div>

                     <div className={cn("flex", isMobile ? "w-full justify-between items-center" : "items-center gap-2")}>
                        <Button variant="outline" size={isMobile ? "sm" : "default"} onClick={goToToday}>
                           Today
                        </Button>
                        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
                           <TabsList>
                              <TabsTrigger value="day" className={isMobile ? "text-xs px-2.5" : ""}>
                                 Day
                              </TabsTrigger>
                              <TabsTrigger value="week" className={isMobile ? "text-xs px-2.5" : ""}>
                                 Week
                              </TabsTrigger>
                              <TabsTrigger value="month" className={isMobile ? "text-xs px-2.5" : ""}>
                                 Month
                              </TabsTrigger>
                           </TabsList>
                        </Tabs>
                     </div>
                  </div>

                  {/* Stats Row */}
                  {!isMobile ? (
                     <div className="grid grid-cols-3 border border-border rounded-xl overflow-hidden divide-x divide-border bg-card/50">
                        <div className="p-3 flex items-center gap-3 hover:bg-accent/5 transition-colors">
                           <div className="flex-shrink-0 rounded-lg bg-blue-500/10 p-2">
                              <Clock className="h-4 w-4 text-blue-600 dark:text-blue-500" />
                           </div>
                           <div>
                              <p className="text-xs text-muted-foreground">Appointments</p>
                              <p className="text-xl font-bold">{totalAppointments}</p>
                           </div>
                        </div>

                        <div className="p-3 flex items-center gap-3 hover:bg-accent/5 transition-colors">
                           <div className="flex-shrink-0 rounded-lg bg-purple-500/10 p-2">
                              <Users className="h-4 w-4 text-purple-600 dark:text-purple-500" />
                           </div>
                           <div>
                              <p className="text-xs text-muted-foreground">Staff</p>
                              <p className="text-xl font-bold">{workingEmployees}</p>
                           </div>
                        </div>

                        <div className="p-3 flex items-center gap-3 hover:bg-accent/5 transition-colors">
                           <div className="flex-shrink-0 rounded-lg bg-green-500/10 p-2">
                              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-500" />
                           </div>
                           <div>
                              <p className="text-xs text-muted-foreground">Completed</p>
                              <p className="text-xl font-bold">{completedAppointments}</p>
                           </div>
                        </div>
                     </div>
                  ) : (
                     <Card className="p-4">
                        <CardContent className="p-0">
                           <div className="flex items-center justify-around">
                              <div className="text-center">
                                 <div className="flex items-center justify-center gap-1.5 mb-1">
                                    <Clock className="h-3.5 w-3.5 text-blue-600" />
                                    <div className="text-lg font-bold">{totalAppointments}</div>
                                 </div>
                                 <div className="text-xs text-muted-foreground">Apts</div>
                              </div>
                              <div className="w-px h-10 bg-border" />
                              <div className="text-center">
                                 <div className="flex items-center justify-center gap-1.5 mb-1">
                                    <Users className="h-3.5 w-3.5 text-purple-600" />
                                    <div className="text-lg font-bold">{workingEmployees}</div>
                                 </div>
                                 <div className="text-xs text-muted-foreground">Staff</div>
                              </div>
                              <div className="w-px h-10 bg-border" />
                              <div className="text-center">
                                 <div className="flex items-center justify-center gap-1.5 mb-1">
                                    <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                                    <div className="text-lg font-bold">{completedAppointments}</div>
                                 </div>
                                 <div className="text-xs text-muted-foreground">Done</div>
                              </div>
                           </div>
                        </CardContent>
                     </Card>
                  )}
               </div>
            </div>
         </div>

         <div className="container mx-auto px-4 md:px-6 pt-3">
            {viewMode === "day" && <CalendarDayView />}
            {viewMode === "week" && <CalendarWeekView />}
            {viewMode === "month" && <CalendarMonthView />}
         </div>

         <AppointmentDetail />
      </div>
   );
}
