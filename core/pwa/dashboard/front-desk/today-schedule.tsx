import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { AppointmentCard } from "./appointment-card";
import { useIsMobile } from "@/hooks/use-mobile";
import { useFrontDeskStore } from "@/features/core/store/store.front-desk";
import { useAppointments, useStaff } from "@/features/core/hooks/queries/queries.dashboard-front-desk";
import type { AppointmentStatus } from "@/features/core/types/types.dashboard-front-desk";

interface TodayScheduleProps {
   onCheckIn: (appointmentId: string) => void;
   onCancel: (appointmentId: string) => void;
   onProcessPayment: (appointmentId: string) => void;
   onViewDetails: (appointmentId: string) => void;
}

export function TodaySchedule({ onCheckIn, onCancel, onProcessPayment, onViewDetails }: TodayScheduleProps) {
   const isMobile = useIsMobile();
   const { filterStatus, filterStaffId, setFilterStatus, setFilterStaffId } = useFrontDeskStore();
   const { data: appointments = [] } = useAppointments();
   const { data: staff = [] } = useStaff();

   const currentHour = new Date().getHours();

   const filteredAppointments = useMemo(() => {
      return appointments.filter((apt) => {
         if (filterStatus !== "all" && apt.status !== filterStatus) return false;
         if (filterStaffId !== "all" && apt.staffId !== filterStaffId) return false;
         return true;
      });
   }, [appointments, filterStatus, filterStaffId]);

   const appointmentsByHour = useMemo(() => {
      const grouped: Record<number, typeof appointments> = {};
      filteredAppointments.forEach((apt) => {
         const hour = parseInt(apt.startTime.split(":")[0]);
         if (!grouped[hour]) grouped[hour] = [];
         grouped[hour].push(apt);
      });
      Object.keys(grouped).forEach((hour) => {
         grouped[Number(hour)].sort((a, b) => {
            const timeA = a.startTime.split(":").map(Number);
            const timeB = b.startTime.split(":").map(Number);
            return timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1]);
         });
      });
      return grouped;
   }, [filteredAppointments]);

   const getStaffColor = (staffId: string) => {
      return staff.find((s) => s.id === staffId)?.color || "#888888";
   };

   const statusCounts = useMemo(
      () => ({
         all: appointments.length,
         booked: appointments.filter((a) => a.status === "booked").length,
         "checked-in": appointments.filter((a) => a.status === "checked-in").length,
         "in-progress": appointments.filter((a) => a.status === "in-progress").length,
         completed: appointments.filter((a) => a.status === "completed").length,
      }),
      [appointments]
   );

   const getStatusColor = (status: AppointmentStatus | "all") => {
      switch (status) {
         case "booked":
            return "!bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
         case "checked-in":
            return "!bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20";
         case "in-progress":
            return "!bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
         case "completed":
            return "!bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20";
         default:
            return "bg-muted text-muted-foreground border-border";
      }
   };

   const timeSlots = Array.from({ length: 13 }, (_, i) => i + 8);

   return (
      <Card>
         <CardHeader>
            <div className="flex flex-col gap-4">
               <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                     <Calendar className="h-5 w-5 text-primary" />
                     Today's Schedule
                     <Badge variant="secondary" className="ml-2">
                        {filteredAppointments.length}
                     </Badge>
                  </CardTitle>
               </div>

               {!isMobile && (
                  <div className="flex flex-wrap gap-2 flex-col">
                     {/* STATUS FILTERS */}
                     <div className="flex items-center gap-1.5 flex-wrap">
                        {(["all", "booked", "checked-in", "in-progress", "completed"] as const).map((status) => (
                           <Button
                              key={status}
                              variant={filterStatus === status ? "default" : "outline"}
                              size="sm"
                              onClick={() => setFilterStatus(status)}
                              className={cn("h-8 text-xs border-2", filterStatus !== status && getStatusColor(status))}
                           >
                              {status === "all"
                                 ? `All (${statusCounts.all})`
                                 : `${status.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())} (${
                                      statusCounts[status]
                                   })`}
                           </Button>
                        ))}
                     </div>

                     {/* STAFF FILTERS */}
                     <div className="flex items-center gap-1.5 flex-wrap">
                        <Button
                           variant={filterStaffId === "all" ? "default" : "outline"}
                           size="sm"
                           onClick={() => setFilterStaffId("all")}
                           className="h-8 text-xs border-2"
                        >
                           All Staff
                        </Button>

                        {staff.map((member) => (
                           <Button
                              key={member.id}
                              variant={filterStaffId === member.id ? "default" : "outline"}
                              size="sm"
                              onClick={() => setFilterStaffId(member.id)}
                              className={cn(
                                 "h-8 text-xs flex items-center gap-1.5 border-2 pl-2",
                                 filterStaffId !== member.id && "border-border"
                              )}
                              style={filterStaffId !== member.id ? { borderLeftWidth: "4px", borderLeftColor: member.color } : {}}
                           >
                              {member.name.split(" ")[0]}
                           </Button>
                        ))}
                     </div>
                  </div>
               )}
            </div>
         </CardHeader>

         <CardContent>
            {filteredAppointments.length === 0 ? (
               <div className="py-12 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-sm text-muted-foreground">
                     {filterStatus !== "all" || filterStaffId !== "all"
                        ? "No appointments match your filters"
                        : "No appointments scheduled for today"}
                  </p>
               </div>
            ) : (
               <div className="space-y-4">
                  {timeSlots.map((hour) => {
                     const hourAppointments = appointmentsByHour[hour] || [];
                     const isCurrentHour = hour === currentHour;

                     return (
                        <div
                           key={hour}
                           className={cn(
                              "rounded-lg border-2 transition-all",
                              isCurrentHour
                                 ? "border-primary bg-primary/5 shadow-md"
                                 : hourAppointments.length > 0
                                 ? "border-border"
                                 : "border-dashed border-border/50"
                           )}
                        >
                           <div className="flex gap-4 p-3">
                              <div
                                 className={cn(
                                    "w-20 flex-shrink-0 flex flex-col items-center justify-center rounded-md py-2",
                                    isCurrentHour ? "bg-primary text-primary-foreground" : "bg-muted/50"
                                 )}
                              >
                                 <div className={cn("text-lg font-bold", isCurrentHour && "animate-pulse")}>
                                    {hour > 12 ? hour - 12 : hour}:00
                                 </div>
                                 <div className="text-[10px] font-medium">{hour >= 12 ? "PM" : "AM"}</div>
                                 {isCurrentHour && (
                                    <Badge variant="secondary" className="mt-1 text-[9px] h-4">
                                       NOW
                                    </Badge>
                                 )}
                              </div>

                              <div className="flex-1">
                                 {hourAppointments.length === 0 ? (
                                    <div className="flex items-center justify-center h-full py-4">
                                       <p className="text-sm text-muted-foreground">No appointments</p>
                                    </div>
                                 ) : (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                                       {hourAppointments.map((appointment) => (
                                          <AppointmentCard
                                             key={appointment.id}
                                             appointment={appointment}
                                             staffColor={getStaffColor(appointment.staffId)}
                                             onCheckIn={onCheckIn}
                                             onCancel={onCancel}
                                             onProcessPayment={onProcessPayment}
                                             onViewDetails={onViewDetails}
                                          />
                                       ))}
                                    </div>
                                 )}
                              </div>
                           </div>
                        </div>
                     );
                  })}
               </div>
            )}
         </CardContent>
      </Card>
   );
}
