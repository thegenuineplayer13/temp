import { useMemo, useState } from "react";
import { useFrontDeskStore } from "@/features/core/store/store.front-desk";
import { useEmployees } from "@/features/core/hooks/queries/queries.staff";
import { useServiceRelationships } from "@/features/core/hooks/queries/queries.services";
import { useAppointments } from "@/features/core/hooks/queries/queries.dashboard-front-desk";
import { useWorkingHours, useTimeOffEntries } from "@/features/core/hooks/queries/queries.calendar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { User, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import {
   findEmployeesForAllServices,
   findEmployeesForService,
   getSequentialTimeSlots,
   getAvailableTimeSlots,
   combineDateAndTime,
} from "@/features/core/lib/booking-utils";

export function CreateAppointmentStepStaffTime() {
   const {
      bookingData,
      setSingleStaff,
      updateServiceAssignment,
      updateBookingData,
   } = useFrontDeskStore();

   const { data: allEmployees = [] } = useEmployees();
   const { data: serviceRelationships = {} } = useServiceRelationships();
   const { data: appointments = [] } = useAppointments();
   const { data: workingHours = [] } = useWorkingHours();
   const { data: timeOffEntries = [] } = useTimeOffEntries();

   const [selectedStaffForSingle, setSelectedStaffForSingle] = useState(bookingData.singleStaffId || "");

   const employees = useMemo(
      () => allEmployees.filter((emp) => emp.status === "active"),
      [allEmployees]
   );

   const selectedDate = bookingData.selectedDate ? new Date(bookingData.selectedDate) : null;
   const isSingleMode = bookingData.assignmentMode === "single";

   // Get available staff based on mode
   const availableStaffForSingle = useMemo(
      () => findEmployeesForAllServices(employees, bookingData.serviceCart, serviceRelationships),
      [employees, bookingData.serviceCart, serviceRelationships]
   );

   // Get available time slots for single mode
   const timeSlots = useMemo(() => {
      if (!isSingleMode || !selectedDate || !selectedStaffForSingle) return [];

      return getSequentialTimeSlots(
         selectedStaffForSingle,
         selectedDate,
         bookingData.serviceCart,
         appointments,
         workingHours,
         timeOffEntries
      );
   }, [isSingleMode, selectedDate, selectedStaffForSingle, bookingData.serviceCart, appointments, workingHours, timeOffEntries]);

   const handleSelectSingleStaff = (staffId: string, staffName: string) => {
      setSelectedStaffForSingle(staffId);
      setSingleStaff(staffId, staffName);
      updateBookingData({ startTime: null }); // Reset time when changing staff
   };

   const handleSelectTimeSlot = (time: string) => {
      updateBookingData({ startTime: time });
   };

   const handleSelectServiceStaff = (serviceId: string, staffId: string, staffName: string) => {
      updateServiceAssignment(serviceId, {
         staffId,
         staffName,
         startTime: null, // Reset time when changing staff
      });
   };

   const handleSelectServiceTime = (serviceId: string, time: string) => {
      if (!selectedDate) return;
      const timeISO = combineDateAndTime(selectedDate, time);
      updateServiceAssignment(serviceId, { startTime: timeISO });
   };

   // Get available time slots for a specific service
   const getServiceTimeSlots = (serviceId: string, staffId: string, duration: number) => {
      if (!selectedDate) return [];
      return getAvailableTimeSlots(staffId, selectedDate, duration, appointments, workingHours, timeOffEntries);
   };

   const renderSingleMode = () => (
      <div className="space-y-6">
         {/* Staff selection */}
         <div className="space-y-3">
            <h4 className="font-medium">Select Staff Member</h4>
            <div className="grid gap-2">
               {availableStaffForSingle.map((employee) => (
                  <Card
                     key={employee.id}
                     className={`p-3 cursor-pointer transition-colors ${
                        selectedStaffForSingle === employee.id
                           ? "border-primary bg-primary/5"
                           : "hover:bg-accent"
                     }`}
                     onClick={() => handleSelectSingleStaff(employee.id, employee.name)}
                  >
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                           <User className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                           <div className="font-medium">{employee.name}</div>
                           <div className="text-xs text-muted-foreground capitalize">{employee.role}</div>
                        </div>
                        {selectedStaffForSingle === employee.id && (
                           <CheckCircle2 className="h-5 w-5 text-primary" />
                        )}
                     </div>
                  </Card>
               ))}
            </div>
         </div>

         {/* Time slot selection */}
         {selectedStaffForSingle && (
            <>
               <Separator />
               <div className="space-y-3">
                  <h4 className="font-medium">Select Time Slot</h4>
                  {timeSlots.length === 0 ? (
                     <Card className="p-4 bg-yellow-500/10 border-yellow-500/20">
                        <div className="flex items-start gap-3">
                           <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                           <div className="text-sm text-yellow-800 dark:text-yellow-200">
                              No available time slots for this staff member on the selected date.
                              They may be fully booked or off-duty.
                           </div>
                        </div>
                     </Card>
                  ) : (
                     <ScrollArea className="h-[200px] border rounded-md p-2">
                        <div className="grid grid-cols-4 gap-2">
                           {timeSlots.map((slot) => (
                              <Button
                                 key={slot}
                                 variant={bookingData.startTime === slot ? "default" : "outline"}
                                 size="sm"
                                 onClick={() => handleSelectTimeSlot(slot)}
                                 className="font-mono"
                              >
                                 {slot}
                              </Button>
                           ))}
                        </div>
                     </ScrollArea>
                  )}
                  <p className="text-xs text-muted-foreground">
                     Total duration: {bookingData.totalDuration} minutes
                  </p>
               </div>
            </>
         )}
      </div>
   );

   const renderMultipleMode = () => (
      <ScrollArea className="h-[500px] pr-4">
         <div className="space-y-6">
            {bookingData.serviceAssignments.map((assignment, index) => {
               const availableStaff = findEmployeesForService(
                  employees,
                  assignment.serviceId,
                  serviceRelationships
               );

               const serviceTimes = assignment.staffId
                  ? getServiceTimeSlots(assignment.serviceId, assignment.staffId, assignment.duration)
                  : [];

               const selectedTime = assignment.startTime
                  ? new Date(assignment.startTime).toTimeString().substring(0, 5)
                  : null;

               return (
                  <div key={assignment.serviceId}>
                     {index > 0 && <Separator className="my-6" />}

                     <div className="space-y-4">
                        {/* Service header */}
                        <div className="flex items-center justify-between">
                           <div>
                              <h4 className="font-medium">{assignment.serviceName}</h4>
                              <p className="text-sm text-muted-foreground">{assignment.duration} minutes</p>
                           </div>
                           {assignment.staffId && assignment.startTime && (
                              <Badge className="gap-1 bg-green-600">
                                 <CheckCircle2 className="h-3 w-3" />
                                 Scheduled
                              </Badge>
                           )}
                        </div>

                        {/* Staff selection */}
                        <div className="space-y-2">
                           <Label className="text-sm font-medium">Select Staff</Label>
                           <div className="grid gap-2">
                              {availableStaff.map((employee) => (
                                 <Card
                                    key={employee.id}
                                    className={`p-2 cursor-pointer transition-colors ${
                                       assignment.staffId === employee.id
                                          ? "border-primary bg-primary/5"
                                          : "hover:bg-accent"
                                    }`}
                                    onClick={() =>
                                       handleSelectServiceStaff(assignment.serviceId, employee.id, employee.name)
                                    }
                                 >
                                    <div className="flex items-center gap-2">
                                       <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                          <User className="h-4 w-4 text-primary" />
                                       </div>
                                       <div className="flex-1">
                                          <div className="text-sm font-medium">{employee.name}</div>
                                       </div>
                                       {assignment.staffId === employee.id && (
                                          <CheckCircle2 className="h-4 w-4 text-primary" />
                                       )}
                                    </div>
                                 </Card>
                              ))}
                           </div>
                        </div>

                        {/* Time slot selection */}
                        {assignment.staffId && (
                           <div className="space-y-2">
                              <Label className="text-sm font-medium">Select Time</Label>
                              {serviceTimes.length === 0 ? (
                                 <Card className="p-3 bg-yellow-500/10 border-yellow-500/20">
                                    <p className="text-xs text-yellow-800 dark:text-yellow-200">
                                       No available slots for this staff member
                                    </p>
                                 </Card>
                              ) : (
                                 <div className="grid grid-cols-5 gap-2">
                                    {serviceTimes.map((slot) => (
                                       <Button
                                          key={slot}
                                          variant={selectedTime === slot ? "default" : "outline"}
                                          size="sm"
                                          onClick={() => handleSelectServiceTime(assignment.serviceId, slot)}
                                          className="text-xs font-mono"
                                       >
                                          {slot}
                                       </Button>
                                    ))}
                                 </div>
                              )}
                           </div>
                        )}
                     </div>
                  </div>
               );
            })}
         </div>
      </ScrollArea>
   );

   return (
      <div className="space-y-4">
         <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
               {selectedDate?.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
               })}
            </span>
         </div>

         {isSingleMode ? renderSingleMode() : renderMultipleMode()}
      </div>
   );
}

function Label({ className, children }: { className?: string; children: React.ReactNode }) {
   return <div className={className}>{children}</div>;
}
