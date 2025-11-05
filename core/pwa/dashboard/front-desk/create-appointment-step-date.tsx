import { useMemo } from "react";
import { useFrontDeskStore } from "@/features/core/store/store.front-desk";
import { useEmployees } from "@/features/core/hooks/queries/queries.staff";
import { useServiceRelationships } from "@/features/core/hooks/queries/queries.services";
import { useAppointments } from "@/features/core/hooks/queries/queries.dashboard-front-desk";
import { useWorkingHours, useTimeOffEntries } from "@/features/core/hooks/queries/queries.calendar";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import {
   findEmployeesForAllServices,
   isEmployeeWorkingOnDate,
   getAvailableTimeSlots,
   getSequentialTimeSlots,
} from "@/features/core/lib/booking-utils";

export function CreateAppointmentStepDate() {
   const { bookingData, updateBookingData } = useFrontDeskStore();
   const { data: allEmployees = [] } = useEmployees();
   const { data: serviceRelationships = {} } = useServiceRelationships();
   const { data: appointments = [] } = useAppointments();
   const { data: workingHours = [] } = useWorkingHours();
   const { data: timeOffEntries = [] } = useTimeOffEntries();

   const employees = useMemo(
      () => allEmployees.filter((emp) => emp.status === "active"),
      [allEmployees]
   );

   const selectedDate = bookingData.selectedDate ? new Date(bookingData.selectedDate) : undefined;

   // Check if a date has any available slots
   const hasAvailableSlots = (date: Date) => {
      // Get potential staff
      const potentialStaff = findEmployeesForAllServices(employees, bookingData.serviceCart, serviceRelationships);

      if (potentialStaff.length === 0) return false;

      // Check if any staff member has available slots on this date
      return potentialStaff.some((employee) => {
         if (!isEmployeeWorkingOnDate(employee.id, date, workingHours, timeOffEntries)) {
            return false;
         }

         const totalDuration = bookingData.serviceCart.reduce((sum, s) => sum + s.duration, 0);
         const slots = getSequentialTimeSlots(
            employee.id,
            date,
            bookingData.serviceCart,
            appointments,
            workingHours,
            timeOffEntries
         );

         return slots.length > 0;
      });
   };

   const handleDateSelect = (date: Date | undefined) => {
      if (!date) return;

      updateBookingData({
         selectedDate: date.toISOString(),
         startTime: null, // Reset time when date changes
      });
   };

   return (
      <div className="space-y-6">
         <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-2">
               <CalendarIcon className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">When would you like to schedule this appointment?</h3>
            <p className="text-sm text-muted-foreground">
               Dates with available time slots are highlighted
            </p>
         </div>

         <div className="flex justify-center">
            <div className="w-full max-w-md">
               <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={(date) => {
                     // Disable past dates
                     if (date < new Date(new Date().setHours(0, 0, 0, 0))) return true;
                     // Disable dates with no available slots
                     return !hasAvailableSlots(date);
                  }}
                  className="rounded-lg border-2 shadow-lg w-full"
                  classNames={{
                     months: "flex flex-col",
                     month: "space-y-4 w-full",
                     caption: "flex justify-center pt-2 relative items-center px-10",
                     caption_label: "text-lg font-semibold",
                     nav: "flex items-center gap-1",
                     nav_button: "h-9 w-9 bg-transparent p-0 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors",
                     nav_button_previous: "absolute left-2",
                     nav_button_next: "absolute right-2",
                     table: "w-full border-collapse mt-4",
                     head_row: "flex w-full",
                     head_cell: "text-muted-foreground rounded-md flex-1 font-medium text-sm py-2",
                     row: "flex w-full mt-1",
                     cell: "flex-1 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
                     day: "h-12 w-full p-0 font-normal hover:bg-accent hover:text-accent-foreground rounded-md transition-colors inline-flex items-center justify-center",
                     day_selected: "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground font-bold",
                     day_today: "bg-accent text-accent-foreground font-semibold border-2 border-primary/30",
                     day_outside: "text-muted-foreground/30 opacity-30",
                     day_disabled: "text-muted-foreground/30 opacity-30 line-through hover:bg-transparent cursor-not-allowed",
                     day_hidden: "invisible",
                  }}
               />
            </div>
         </div>

         {selectedDate && (
            <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/20">
               <p className="text-sm font-medium text-primary">
                  Selected: {selectedDate.toLocaleDateString("en-US", {
                     weekday: "long",
                     year: "numeric",
                     month: "long",
                     day: "numeric",
                  })}
               </p>
            </div>
         )}
      </div>
   );
}
