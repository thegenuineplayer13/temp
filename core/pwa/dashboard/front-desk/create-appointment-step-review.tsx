import { useState } from "react";
import { useFrontDeskStore } from "@/features/core/store/store.front-desk";
import { useCreateAppointments } from "@/features/core/hooks/queries/queries.dashboard-front-desk";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
   Calendar,
   Clock,
   User,
   Phone,
   DollarSign,
   CheckCircle2,
   Loader2,
   ArrowRight,
   AlertCircle,
} from "lucide-react";
import {
   combineDateAndTime,
   calculateEndTime,
   addMinutesToTime,
   calculateSequentialEndTime,
} from "@/features/core/lib/booking-utils";
import type { Appointment } from "@/features/core/types/types.dashboard-front-desk";

export function CreateAppointmentStepReview() {
   const { bookingData, updateBookingData, resetBookingWizard } = useFrontDeskStore();
   const [notes, setNotes] = useState(bookingData.notes || "");
   const createAppointments = useCreateAppointments();

   const isSequentialMode = bookingData.assignmentMode === "single";

   // Generate appointments to be created
   const generateAppointments = (): Omit<Appointment, "id">[] => {
      const appointments: Omit<Appointment, "id">[] = [];

      if (!bookingData.clientId || !bookingData.selectedDate) return [];

      if (isSequentialMode && bookingData.singleStaffId && bookingData.startTime) {
         // Single staff - create back-to-back appointments
         let currentTime = bookingData.startTime;

         bookingData.serviceCart.forEach((service) => {
            const startTimeISO = combineDateAndTime(new Date(bookingData.selectedDate!), currentTime);
            const endTimeISO = calculateEndTime(startTimeISO, service.duration);

            appointments.push({
               customerId: bookingData.clientId!,
               customerName: bookingData.clientName!,
               customerPhone: bookingData.clientPhone!,
               staffId: bookingData.singleStaffId!,
               staffName: bookingData.singleStaffName!,
               service: service.serviceName,
               serviceId: service.serviceId,
               startTime: startTimeISO,
               endTime: endTimeISO,
               duration: service.duration,
               price: service.price,
               status: "booked",
               paymentStatus: "pending",
               notes: notes,
               bookingGroupId: bookingData.bookingGroupId,
            });

            // Move to next service start time
            currentTime = addMinutesToTime(currentTime, service.duration);
         });
      } else {
         // Multiple staff - create parallel appointments
         bookingData.serviceAssignments.forEach((assignment) => {
            if (!assignment.staffId || !assignment.startTime) return;

            const service = bookingData.serviceCart.find((s) => s.serviceId === assignment.serviceId);
            if (!service) return;

            const endTimeISO = calculateEndTime(assignment.startTime, assignment.duration);

            appointments.push({
               customerId: bookingData.clientId!,
               customerName: bookingData.clientName!,
               customerPhone: bookingData.clientPhone!,
               staffId: assignment.staffId,
               staffName: assignment.staffName!,
               service: service.serviceName,
               serviceId: service.serviceId,
               startTime: assignment.startTime,
               endTime: endTimeISO,
               duration: assignment.duration,
               price: service.price,
               status: "booked",
               paymentStatus: "pending",
               notes: notes,
               bookingGroupId: bookingData.bookingGroupId,
            });
         });
      }

      return appointments;
   };

   const appointmentsToCreate = generateAppointments();

   // Sort appointments by start time for display
   const sortedAppointments = [...appointmentsToCreate].sort(
      (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
   );

   const handleNotesChange = (value: string) => {
      setNotes(value);
      updateBookingData({ notes: value });
   };

   const handleConfirm = async () => {
      if (appointmentsToCreate.length === 0) return;

      try {
         await createAppointments.mutateAsync(appointmentsToCreate);
         resetBookingWizard();
      } catch (error) {
         console.error("Failed to create appointments:", error);
      }
   };

   const formatTime = (isoString: string) => {
      return new Date(isoString).toLocaleTimeString("en-US", {
         hour: "2-digit",
         minute: "2-digit",
         hour12: true,
      });
   };

   const formatDate = (isoString: string) => {
      return new Date(isoString).toLocaleDateString("en-US", {
         weekday: "long",
         year: "numeric",
         month: "long",
         day: "numeric",
      });
   };

   return (
      <div className="space-y-4">
         {/* Summary card */}
         <Card className="p-4 bg-primary/5 border-primary/20">
            <div className="space-y-3">
               {/* Client info */}
               <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  <span className="font-semibold">{bookingData.clientName}</span>
                  <span className="text-sm text-muted-foreground">•</span>
                  <Phone className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{bookingData.clientPhone}</span>
               </div>

               <Separator />

               {/* Date */}
               {bookingData.selectedDate && (
                  <div className="flex items-center gap-2">
                     <Calendar className="h-4 w-4 text-muted-foreground" />
                     <span className="text-sm">{formatDate(bookingData.selectedDate)}</span>
                  </div>
               )}

               {/* Total summary */}
               <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                     <Clock className="h-4 w-4 text-muted-foreground" />
                     <span>Total Duration: {bookingData.totalDuration} min</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <DollarSign className="h-4 w-4 text-muted-foreground" />
                     <span className="font-semibold">${bookingData.totalPrice}</span>
                  </div>
               </div>
            </div>
         </Card>

         {/* Appointments timeline */}
         <div className="space-y-3">
            <Label className="text-base font-semibold">
               Appointments to be Created ({appointmentsToCreate.length})
            </Label>

            {appointmentsToCreate.length === 0 ? (
               <Card className="p-4 bg-red-500/10 border-red-500/20">
                  <div className="flex items-start gap-3">
                     <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                     <div>
                        <p className="text-sm font-medium text-red-800 dark:text-red-200">
                           Cannot create appointments
                        </p>
                        <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                           Please go back and complete all required steps.
                        </p>
                     </div>
                  </div>
               </Card>
            ) : (
               <ScrollArea className="h-[250px] border rounded-md">
                  <div className="p-4 space-y-3">
                     {sortedAppointments.map((apt, index) => (
                        <div key={`${apt.serviceId}-${index}`}>
                           {index > 0 && isSequentialMode && (
                              <div className="flex justify-center my-2">
                                 <ArrowRight className="h-4 w-4 text-muted-foreground" />
                              </div>
                           )}

                           <Card className="p-3">
                              <div className="space-y-2">
                                 {/* Service name and badge */}
                                 <div className="flex items-center justify-between">
                                    <span className="font-medium">{apt.service}</span>
                                    <Badge variant={isSequentialMode ? "default" : "secondary"}>
                                       {isSequentialMode ? `${index + 1} of ${sortedAppointments.length}` : "Parallel"}
                                    </Badge>
                                 </div>

                                 {/* Time */}
                                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    <span>
                                       {formatTime(apt.startTime)} - {formatTime(apt.endTime)}
                                    </span>
                                    <span className="text-xs">({apt.duration}min)</span>
                                 </div>

                                 {/* Staff */}
                                 <div className="flex items-center gap-2 text-sm">
                                    <User className="h-3 w-3 text-muted-foreground" />
                                    <span>{apt.staffName}</span>
                                 </div>

                                 {/* Price */}
                                 <div className="flex items-center gap-2 text-sm">
                                    <DollarSign className="h-3 w-3 text-muted-foreground" />
                                    <span className="font-semibold">${apt.price}</span>
                                 </div>
                              </div>
                           </Card>
                        </div>
                     ))}
                  </div>
               </ScrollArea>
            )}
         </div>

         {/* Notes */}
         <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
               id="notes"
               placeholder="Add any special instructions or notes for the staff..."
               value={notes}
               onChange={(e) => handleNotesChange(e.target.value)}
               rows={3}
            />
         </div>

         <Separator />

         {/* Confirm button */}
         <div className="space-y-3">
            {isSequentialMode && (
               <Card className="p-3 bg-blue-500/10 border-blue-500/20">
                  <p className="text-xs text-center text-muted-foreground">
                     Services will be scheduled <strong>back-to-back</strong> with {bookingData.singleStaffName}
                  </p>
               </Card>
            )}

            {!isSequentialMode && sortedAppointments.length > 1 && (
               <Card className="p-3 bg-green-500/10 border-green-500/20">
                  <p className="text-xs text-center text-muted-foreground">
                     Services can run <strong>in parallel</strong> with different staff members
                  </p>
               </Card>
            )}

            <Button
               onClick={handleConfirm}
               disabled={appointmentsToCreate.length === 0 || createAppointments.isPending}
               className="w-full h-12 text-base"
            >
               {createAppointments.isPending ? (
                  <>
                     <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                     Creating Appointments...
                  </>
               ) : (
                  <>
                     <CheckCircle2 className="h-5 w-5 mr-2" />
                     Confirm & Create {appointmentsToCreate.length} Appointment
                     {appointmentsToCreate.length > 1 ? "s" : ""}
                  </>
               )}
            </Button>
         </div>
      </div>
   );
}
