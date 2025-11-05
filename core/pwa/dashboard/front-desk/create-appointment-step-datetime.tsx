import { useState } from "react";
import { useFrontDeskStore } from "@/features/core/store/store.front-desk";
import { useAppointments } from "@/features/core/hooks/queries/queries.dashboard-front-desk";
import { useWorkingHours, useTimeOffEntries } from "@/features/core/hooks/queries/queries.calendar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import {
   getAvailableTimeSlots,
   getSequentialTimeSlots,
   calculateSequentialEndTime,
   combineDateAndTime,
} from "@/features/core/lib/booking-utils";

export function CreateAppointmentStepDateTime() {
   const { bookingData, updateBookingData, updateServiceAssignment } = useFrontDeskStore();
   const { data: appointments = [] } = useAppointments();
   const { data: workingHours = [] } = useWorkingHours();
   const { data: timeOffEntries = [] } = useTimeOffEntries();

   const [selectedDate, setSelectedDate] = useState<Date | undefined>(
      bookingData.selectedDate ? new Date(bookingData.selectedDate) : undefined,
   );

   const isSequentialMode = bookingData.assignmentMode === "single";

   const handleDateSelect = (date: Date | undefined) => {
      if (!date) return;

      setSelectedDate(date);
      updateBookingData({
         selectedDate: date.toISOString(),
         startTime: null, // Reset time when date changes
      });

      // Reset service assignment times for parallel mode
      if (!isSequentialMode) {
         bookingData.serviceAssignments.forEach((assignment) => {
            updateServiceAssignment(assignment.serviceId, { startTime: null });
         });
      }
   };

   const handleTimeSelect = (time: string) => {
      updateBookingData({ startTime: time });
   };

   const handleServiceTimeSelect = (serviceId: string, time: string) => {
      if (!selectedDate) return;

      const timeISO = combineDateAndTime(selectedDate, time);
      updateServiceAssignment(serviceId, { startTime: timeISO });
   };

   // Calculate available time slots
   const getAvailableSlotsForMode = () => {
      if (!selectedDate || !bookingData.singleStaffId) return [];

      if (isSequentialMode) {
         return getSequentialTimeSlots(
            bookingData.singleStaffId,
            selectedDate,
            bookingData.serviceCart,
            appointments,
            workingHours,
            timeOffEntries,
         );
      }

      // For parallel mode, this will be handled per service
      return [];
   };

   const getAvailableSlotsForService = (serviceId: string, staffId: string, duration: number) => {
      if (!selectedDate) return [];

      return getAvailableTimeSlots(
         staffId,
         selectedDate,
         duration,
         appointments,
         workingHours,
         timeOffEntries,
      );
   };

   const availableSlots = isSequentialMode ? getAvailableSlotsForMode() : [];

   const renderSequentialMode = () => {
      const endTime = bookingData.startTime
         ? calculateSequentialEndTime(bookingData.startTime, bookingData.serviceCart)
         : null;

      return (
         <div className="space-y-4">
            {/* Selected date and time summary */}
            {selectedDate && (
               <Card className="p-4 bg-primary/5 border-primary/20">
                  <div className="space-y-2">
                     <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-primary" />
                        <span className="font-semibold">
                           {selectedDate.toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                           })}
                        </span>
                     </div>
                     {bookingData.startTime && endTime && (
                        <div className="flex items-center gap-2 text-sm">
                           <Clock className="h-4 w-4 text-muted-foreground" />
                           <span>
                              {bookingData.startTime} - {endTime}
                           </span>
                           <Badge variant="secondary" className="text-xs">
                              {bookingData.totalDuration} min total
                           </Badge>
                        </div>
                     )}
                  </div>
               </Card>
            )}

            {/* Time slot selection */}
            {selectedDate && (
               <div className="space-y-3">
                  <Label className="text-sm font-semibold">Available Time Slots</Label>
                  {availableSlots.length === 0 ? (
                     <Card className="p-4 bg-yellow-500/10 border-yellow-500/20">
                        <div className="flex items-start gap-3">
                           <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 shrink-0" />
                           <div>
                              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                 No available time slots
                              </p>
                              <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                                 The selected staff member is not available on this date or doesn't have a{" "}
                                 {bookingData.totalDuration}-minute block available.
                              </p>
                           </div>
                        </div>
                     </Card>
                  ) : (
                     <ScrollArea className="h-[200px] border rounded-md">
                        <div className="grid grid-cols-3 gap-2 p-2">
                           {availableSlots.map((slot) => (
                              <Button
                                 key={slot}
                                 variant={bookingData.startTime === slot ? "default" : "outline"}
                                 size="sm"
                                 onClick={() => handleTimeSelect(slot)}
                                 className="w-full"
                              >
                                 {slot}
                              </Button>
                           ))}
                        </div>
                     </ScrollArea>
                  )}
               </div>
            )}
         </div>
      );
   };

   const renderParallelMode = () => {
      return (
         <div className="space-y-4">
            {/* Selected date summary */}
            {selectedDate && (
               <Card className="p-4 bg-primary/5 border-primary/20">
                  <div className="flex items-center gap-2">
                     <CalendarIcon className="h-4 w-4 text-primary" />
                     <span className="font-semibold">
                        {selectedDate.toLocaleDateString("en-US", {
                           weekday: "long",
                           year: "numeric",
                           month: "long",
                           day: "numeric",
                        })}
                     </span>
                  </div>
               </Card>
            )}

            {/* Time selection per service */}
            {selectedDate && (
               <ScrollArea className="h-[350px]">
                  <div className="space-y-4 p-2">
                     {bookingData.serviceAssignments.map((assignment, index) => {
                        const availableSlots = assignment.staffId
                           ? getAvailableSlotsForService(assignment.serviceId, assignment.staffId, assignment.duration)
                           : [];

                        return (
                           <div key={assignment.serviceId}>
                              {index > 0 && <Separator className="my-4" />}

                              <div className="space-y-3">
                                 {/* Service header */}
                                 <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                       <div className="flex items-center gap-2">
                                          <span className="font-medium text-sm">{assignment.serviceName}</span>
                                          <Badge variant="outline" className="text-xs">
                                             {assignment.duration}min
                                          </Badge>
                                       </div>
                                       <p className="text-xs text-muted-foreground">Staff: {assignment.staffName}</p>
                                    </div>
                                    {assignment.startTime && (
                                       <Badge className="bg-green-600">
                                          <CheckCircle2 className="h-3 w-3 mr-1" />
                                          Scheduled
                                       </Badge>
                                    )}
                                 </div>

                                 {/* Time slots */}
                                 {availableSlots.length === 0 ? (
                                    <Card className="p-3 bg-yellow-500/10 border-yellow-500/20">
                                       <p className="text-xs text-yellow-800 dark:text-yellow-200">
                                          No available time slots for this service
                                       </p>
                                    </Card>
                                 ) : (
                                    <div className="grid grid-cols-4 gap-2">
                                       {availableSlots.map((slot) => {
                                          const slotISO = combineDateAndTime(selectedDate, slot);
                                          const isSelected = assignment.startTime === slotISO;

                                          return (
                                             <Button
                                                key={slot}
                                                variant={isSelected ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => handleServiceTimeSelect(assignment.serviceId, slot)}
                                                className="text-xs"
                                             >
                                                {slot}
                                             </Button>
                                          );
                                       })}
                                    </div>
                                 )}
                              </div>
                           </div>
                        );
                     })}
                  </div>
               </ScrollArea>
            )}
         </div>
      );
   };

   return (
      <div className="space-y-4">
         {/* Info card */}
         <Card className="p-4 bg-blue-500/10 border-blue-500/20">
            <div className="flex items-start gap-3">
               <CalendarIcon className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
               <div className="space-y-1">
                  <p className="text-sm font-medium">
                     {isSequentialMode ? "Sequential Appointments" : "Parallel Appointments"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                     {isSequentialMode
                        ? `All services will be scheduled back-to-back starting at your selected time (total ${bookingData.totalDuration} minutes).`
                        : "Services can be scheduled at overlapping times since they're handled by different staff members."}
                  </p>
               </div>
            </div>
         </Card>

         {/* Date picker */}
         <div className="space-y-3">
            <Label className="text-base font-semibold">Select Date</Label>
            <div className="flex justify-center">
               <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  className="rounded-md border"
               />
            </div>
         </div>

         <Separator />

         {/* Time selection */}
         {selectedDate && (
            <div className="space-y-3">
               <Label className="text-base font-semibold">Select Time</Label>
               {isSequentialMode ? renderSequentialMode() : renderParallelMode()}
            </div>
         )}

         {/* Help text */}
         <p className="text-xs text-muted-foreground text-center">
            {!selectedDate
               ? "Select a date to see available time slots"
               : isSequentialMode
                 ? "Select a start time for all services"
                 : "Select a start time for each service"}
         </p>
      </div>
   );
}
