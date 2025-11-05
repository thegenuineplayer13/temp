import * as React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Briefcase,
  AlertCircle,
  MapPin,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mockAppointmentsData } from "@/mock/mock-appointments-data";

interface Appointment {
  id: string;
  time: string;
  clientName: string;
  serviceType: string;
  estimatedDuration: number;
  location?: string;
  specialNotes?: string;
  isUrgent?: boolean;
  status?: "completed" | "in-progress" | "upcoming" | "cancelled";
}

export default function AppointmentsPage() {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = React.useState<
    "today" | "tomorrow" | "week"
  >("today");
  const [selectedAppointment, setSelectedAppointment] = React.useState<
    string | null
  >(null);

  const getStatusColor = (status?: Appointment["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-600 dark:text-green-500 border-green-500/20";
      case "in-progress":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-500 border-blue-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-600 dark:text-red-500 border-red-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const AppointmentCard = ({
    appointment,
    showDate,
  }: {
    appointment: Appointment;
    showDate?: string;
  }) => {
    const isExpanded = selectedAppointment === appointment.id;

    return (
      <button
        onClick={() =>
          setSelectedAppointment(isExpanded ? null : appointment.id)
        }
        className={cn(
          "w-full text-left rounded-xl border-2 transition-all hover:shadow-md",
          isExpanded
            ? "border-primary shadow-lg"
            : "border-border hover:border-primary/50"
        )}
      >
        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Time Badge */}
            <div className="flex-shrink-0">
              <div className="rounded-lg bg-primary/10 px-3 py-2 text-center min-w-[70px]">
                <div className="text-xs font-medium text-muted-foreground uppercase">
                  {showDate || "Time"}
                </div>
                <div className="text-lg font-bold text-primary">
                  {appointment.time}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold text-base truncate">
                      {appointment.clientName}
                    </h3>
                    {appointment.isUrgent && (
                      <Badge variant="destructive" className="text-xs">
                        Urgent
                      </Badge>
                    )}
                    {appointment.status && (
                      <Badge
                        className={cn(
                          "text-xs",
                          getStatusColor(appointment.status)
                        )}
                      >
                        {appointment.status}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Briefcase className="h-3.5 w-3.5" />
                    <span className="truncate">{appointment.serviceType}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <Badge variant="outline" className="text-xs">
                    {appointment.estimatedDuration}m
                  </Badge>
                  <ChevronRight
                    className={cn(
                      "h-4 w-4 text-muted-foreground transition-transform",
                      isExpanded && "rotate-90"
                    )}
                  />
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="mt-3 pt-3 border-t space-y-2 animate-in fade-in slide-in-from-top-1">
                  {appointment.location && (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">
                        {appointment.location}
                      </span>
                    </div>
                  )}
                  {appointment.specialNotes && (
                    <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-foreground">
                        <span className="font-medium">Note:</span>{" "}
                        {appointment.specialNotes}
                      </p>
                    </div>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" className="flex-1">
                      View Client
                    </Button>
                    {appointment.status === "upcoming" && (
                      <Button size="sm" variant="outline" className="flex-1">
                        Start Job
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </button>
    );
  };

  const TodayView = () => (
    <div className="space-y-3">
      {mockAppointmentsData.today.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No appointments today</p>
          </CardContent>
        </Card>
      ) : (
        mockAppointmentsData.today.map((apt) => (
          <AppointmentCard key={apt.id} appointment={apt} />
        ))
      )}
    </div>
  );

  const TomorrowView = () => (
    <div className="space-y-3">
      {mockAppointmentsData.tomorrow.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No appointments tomorrow</p>
          </CardContent>
        </Card>
      ) : (
        mockAppointmentsData.tomorrow.map((apt) => (
          <AppointmentCard key={apt.id} appointment={apt} />
        ))
      )}
    </div>
  );

  const WeekView = () => (
    <div className="space-y-4">
      {mockAppointmentsData.week.map((day) => (
        <div key={day.date}>
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{day.dayName}</h3>
              <p className="text-sm text-muted-foreground">{day.date}</p>
            </div>
            <Badge variant="outline">
              {day.appointments.length}{" "}
              {day.appointments.length === 1 ? "appointment" : "appointments"}
            </Badge>
          </div>
          {day.appointments.length === 0 ? (
            <Card>
              <CardContent className="p-4 text-center text-sm text-muted-foreground">
                No appointments
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {day.appointments.map((apt) => (
                <AppointmentCard
                  key={apt.id}
                  appointment={apt}
                  showDate={day.dayName}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background border-b">
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Appointments</h1>
              <Badge variant="outline" className="text-sm">
                {activeTab === "today" && mockAppointmentsData.today.length}
                {activeTab === "tomorrow" &&
                  mockAppointmentsData.tomorrow.length}
                {activeTab === "week" &&
                  mockAppointmentsData.week.reduce(
                    (sum, d) => sum + d.appointments.length,
                    0
                  )}
              </Badge>
            </div>

            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as any)}
            >
              <TabsList className="w-full">
                <TabsTrigger value="today" className="flex-1">
                  Today
                </TabsTrigger>
                <TabsTrigger value="tomorrow" className="flex-1">
                  Tomorrow
                </TabsTrigger>
                <TabsTrigger value="week" className="flex-1">
                  Week
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {activeTab === "today" && <TodayView />}
          {activeTab === "tomorrow" && <TomorrowView />}
          {activeTab === "week" && <WeekView />}
        </div>
      </div>
    );
  }

  // Desktop View
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Appointments</h1>
            <Badge variant="outline" className="text-base px-4 py-2">
              {activeTab === "today" &&
                `${mockAppointmentsData.today.length} Today`}
              {activeTab === "tomorrow" &&
                `${mockAppointmentsData.tomorrow.length} Tomorrow`}
              {activeTab === "week" &&
                `${mockAppointmentsData.week.reduce(
                  (sum, d) => sum + d.appointments.length,
                  0
                )} This Week`}
            </Badge>
          </div>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList>
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="tomorrow">Tomorrow</TabsTrigger>
              <TabsTrigger value="week">This Week</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Content */}
        <div>
          {activeTab === "today" && <TodayView />}
          {activeTab === "tomorrow" && <TomorrowView />}
          {activeTab === "week" && <WeekView />}
        </div>
      </div>
    </div>
  );
}
