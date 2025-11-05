import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, CheckCircle, AlertCircle, Coffee } from "lucide-react";
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

  const getStatusBadge = (status: StaffStatus["status"]) => {
    switch (status) {
      case "busy":
        return (
          <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">
            Busy
          </Badge>
        );
      case "ending-soon":
        return (
          <Badge className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20">
            Ending Soon
          </Badge>
        );
      case "break":
        return (
          <Badge className="bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20">
            Short Break
          </Badge>
        );
      case "available":
        return (
          <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">
            Available
          </Badge>
        );
    }
  };

  const handleAppointmentClick = (appointment: CalendarAppointment) => {
    setSelectedAppointment(appointment);
    setDetailOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Current Time Banner */}
      <Card className="bg-primary text-primary-foreground">
        <CardContent className="py-4">
          <div className="flex items-center justify-center gap-3">
            <Clock className="h-6 w-6 animate-pulse" />
            <div className="text-center">
              <p className="text-2xl font-bold">{formatTime(currentTime)}</p>
              <p className="text-sm opacity-90">
                {currentTime.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Staff Status List */}
      <div className="grid grid-cols-1 gap-4">
        {staffStatuses.map((staffStatus) => (
          <Card
            key={staffStatus.employee.id}
            className={cn(
              "transition-all",
              staffStatus.status === "busy" && "border-blue-500/30",
              staffStatus.status === "ending-soon" && "border-yellow-500/30",
              staffStatus.status === "available" && "opacity-75"
            )}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: staffStatus.employee.color }}
                  />
                  <div>
                    <CardTitle className="text-base font-semibold">
                      {staffStatus.employee.name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">{staffStatus.employee.role}</p>
                  </div>
                </div>
                {getStatusBadge(staffStatus.status)}
              </div>
            </CardHeader>
            <CardContent>
              {staffStatus.currentAppointment ? (
                <div className="space-y-3">
                  {/* Current Appointment */}
                  <div
                    className="p-3 rounded-lg bg-accent/50 border cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => handleAppointmentClick(staffStatus.currentAppointment!)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <p className="font-medium text-sm truncate">
                            {staffStatus.currentAppointment.clientName}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground pl-6">
                          {staffStatus.currentAppointment.service}
                        </p>
                        <div className="flex items-center gap-3 mt-2 pl-6">
                          <span className="text-xs text-muted-foreground">
                            {formatTime(new Date(staffStatus.currentAppointment.startTime))} -{" "}
                            {formatTime(new Date(staffStatus.currentAppointment.endTime))}
                          </span>
                          {staffStatus.timeLeftCurrent && (
                            <Badge variant="secondary" className="text-xs">
                              {staffStatus.timeLeftCurrent}m left
                            </Badge>
                          )}
                        </div>
                      </div>
                      {staffStatus.status === "ending-soon" && (
                        <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                      )}
                    </div>
                  </div>

                  {/* Next Appointment */}
                  {staffStatus.nextAppointment && (
                    <div className="p-3 rounded-lg bg-muted/30 border-dashed border">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-muted-foreground mb-1">
                            Up next:
                          </p>
                          <p className="font-medium text-sm truncate">
                            {staffStatus.nextAppointment.clientName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {staffStatus.nextAppointment.service}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {formatTime(new Date(staffStatus.nextAppointment.startTime))}
                              {staffStatus.timeUntilNext && ` (in ${staffStatus.timeUntilNext}m)`}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-4 text-center">
                  {staffStatus.nextAppointment ? (
                    <div>
                      <Coffee className="h-8 w-8 mx-auto mb-2 text-muted-foreground opacity-50" />
                      <p className="text-sm text-muted-foreground mb-3">Available for walk-ins</p>
                      <div className="p-3 rounded-lg bg-muted/30 border-dashed border">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Next:</p>
                        <p className="font-medium text-sm">
                          {staffStatus.nextAppointment.clientName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {staffStatus.nextAppointment.service}
                        </p>
                        <div className="flex items-center justify-center gap-2 mt-2">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {formatTime(new Date(staffStatus.nextAppointment.startTime))}
                            {staffStatus.timeUntilNext && ` (in ${staffStatus.timeUntilNext}m)`}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600 dark:text-green-400" />
                      <p className="text-sm font-medium">Available</p>
                      <p className="text-xs text-muted-foreground">No appointments scheduled</p>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
