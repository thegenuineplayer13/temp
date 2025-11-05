import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, User, Coffee, Star, CalendarClock, AlertCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCalendarStore } from "@/features/core/store/store.calendar";
import {
  useCalendarEmployees,
  useCalendarAppointments,
} from "@/features/core/hooks/queries/queries.calendar";
import type { CalendarAppointment } from "@/features/core/types/types.calendar";

interface StaffStatus {
  employee: {
    id: string;
    name: string;
    role: string;
    color: string;
  };
  currentAppointment: CalendarAppointment | null;
  nextAppointment: CalendarAppointment | null;
  status: "busy" | "available" | "break" | "ending-soon";
  timeUntilNext?: number; // minutes
  timeLeftCurrent?: number; // minutes
}

export function CalendarNowView() {
  const isMobile = useIsMobile();
  const { setSelectedAppointment, setDetailOpen } = useCalendarStore();
  const { data: employees = [] } = useCalendarEmployees();
  const { data: allAppointments = [] } = useCalendarAppointments();

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 5000); // Update every 5 seconds
    return () => clearInterval(timer);
  }, []);

  const staffStatuses = useMemo(() => {
    const statuses: StaffStatus[] = [];

    employees.forEach((employee) => {
      const employeeAppointments = allAppointments
        .filter((apt) => apt.employeeId === employee.id)
        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

      let currentAppointment: CalendarAppointment | null = null;
      let nextAppointment: CalendarAppointment | null = null;
      let status: StaffStatus["status"] = "available";
      let timeUntilNext: number | undefined;
      let timeLeftCurrent: number | undefined;

      const now = currentTime.getTime();

      for (const apt of employeeAppointments) {
        const startTime = new Date(apt.startTime).getTime();
        const endTime = new Date(apt.endTime).getTime();

        if (startTime <= now && endTime > now) {
          // Currently in appointment
          currentAppointment = apt;
          timeLeftCurrent = Math.round((endTime - now) / 60000); // minutes

          if (timeLeftCurrent <= 10) {
            status = "ending-soon";
          } else {
            status = "busy";
          }
        } else if (startTime > now) {
          // Future appointment
          if (!nextAppointment) {
            nextAppointment = apt;
            timeUntilNext = Math.round((startTime - now) / 60000); // minutes

            // If available but next appointment is soon
            if (!currentAppointment && timeUntilNext <= 15) {
              status = "break";
            }
          }
          break;
        }
      }

      statuses.push({
        employee,
        currentAppointment,
        nextAppointment,
        status,
        timeUntilNext,
        timeLeftCurrent,
      });
    });

    // Sort: busy first, then ending-soon, then break, then available
    return statuses.sort((a, b) => {
      const order = { busy: 0, "ending-soon": 1, break: 2, available: 3 };
      return order[a.status] - order[b.status];
    });
  }, [employees, allAppointments, currentTime]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusConfig = (status: StaffStatus["status"]) => {
    switch (status) {
      case "busy":
        return {
          badge: (
            <Badge className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20">
              In Progress
            </Badge>
          ),
          bgClass: "bg-purple-500/5 border-purple-500/20",
        };
      case "ending-soon":
        return {
          badge: (
            <Badge className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20">
              Ending Soon
            </Badge>
          ),
          bgClass: "bg-yellow-500/5 border-yellow-500/20",
        };
      case "break":
        return {
          badge: (
            <Badge className="bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20">
              Short Break
            </Badge>
          ),
          bgClass: "bg-orange-500/5 border-orange-500/20",
        };
      case "available":
        return {
          badge: (
            <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">
              Available
            </Badge>
          ),
          bgClass: "bg-green-500/5 border-green-500/20",
        };
    }
  };

  const handleAppointmentClick = (appointment: CalendarAppointment) => {
    setSelectedAppointment(appointment);
    setDetailOpen(true);
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Current Time Banner */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground shadow-lg">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="relative py-6">
          <div className="flex items-center justify-center gap-3">
            <Clock className="h-7 w-7 animate-pulse" />
            <div className="text-center">
              <p className="text-3xl font-bold tracking-tight">{formatTime(currentTime)}</p>
              <p className="text-sm opacity-90 mt-1">
                {currentTime.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Staff Status List */}
      <div className="grid grid-cols-1 gap-3">
        {staffStatuses.map((staffStatus) => {
          const statusConfig = getStatusConfig(staffStatus.status);

          return (
            <div
              key={staffStatus.employee.id}
              className={cn(
                "relative rounded-lg border transition-all hover:shadow-md",
                statusConfig.bgClass
              )}
            >
              {/* Colored left border */}
              <div
                className="absolute top-0 left-0 w-1 h-full rounded-l-lg"
                style={{ backgroundColor: staffStatus.employee.color }}
              />

              <div className="p-4 pl-5 space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-base truncate">
                        {staffStatus.employee.name}
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground">{staffStatus.employee.role}</p>
                  </div>
                  {statusConfig.badge}
                </div>

                {/* Content */}
                {staffStatus.currentAppointment ? (
                  <div className="space-y-3">
                    {/* Current Appointment */}
                    <div
                      className="p-3 rounded-lg border border-border/50 bg-card/50 cursor-pointer hover:bg-accent/50 transition-colors"
                      onClick={() => handleAppointmentClick(staffStatus.currentAppointment!)}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              <span className="font-medium text-sm truncate">
                                {staffStatus.currentAppointment.clientName}
                              </span>
                            </div>
                          </div>
                          {staffStatus.status === "ending-soon" && (
                            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <Star className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                          <p className="text-xs font-medium">
                            {staffStatus.currentAppointment.service}
                          </p>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                            <p className="text-xs text-muted-foreground">
                              {formatTime(new Date(staffStatus.currentAppointment.startTime))} -{" "}
                              {formatTime(new Date(staffStatus.currentAppointment.endTime))}
                            </p>
                          </div>
                          {staffStatus.timeLeftCurrent && (
                            <Badge variant="secondary" className="text-xs h-5">
                              {staffStatus.timeLeftCurrent}m left
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Next Appointment */}
                    {staffStatus.nextAppointment && (
                      <div className="p-3 rounded-lg bg-muted/30 border border-dashed border-border/60">
                        <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                          <CalendarClock className="h-3.5 w-3.5" />
                          Coming up next
                        </p>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <User className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                            <span className="font-medium text-sm truncate">
                              {staffStatus.nextAppointment.clientName}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Star className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                            <span className="text-xs text-muted-foreground">
                              {staffStatus.nextAppointment.service}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                            <span className="text-xs text-muted-foreground">
                              {formatTime(new Date(staffStatus.nextAppointment.startTime))}
                              {staffStatus.timeUntilNext && ` (in ${staffStatus.timeUntilNext}m)`}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-6">
                    {staffStatus.nextAppointment ? (
                      <div className="space-y-3">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="rounded-full bg-accent p-3">
                            <Coffee className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium">Available for Walk-ins</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Free until next appointment
                            </p>
                          </div>
                        </div>

                        <div className="p-3 rounded-lg bg-muted/30 border border-dashed border-border/60">
                          <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                            <CalendarClock className="h-3.5 w-3.5" />
                            Next scheduled
                          </p>
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <User className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                              <span className="font-medium text-sm">
                                {staffStatus.nextAppointment.clientName}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Star className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                              <span className="text-xs text-muted-foreground">
                                {staffStatus.nextAppointment.service}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                              <span className="text-xs text-muted-foreground">
                                {formatTime(new Date(staffStatus.nextAppointment.startTime))}
                                {staffStatus.timeUntilNext && ` (in ${staffStatus.timeUntilNext}m)`}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-2 py-2">
                        <div className="rounded-full bg-green-500/10 p-3">
                          <Sparkles className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium">Fully Available</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            No appointments scheduled
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
