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
      // If no services selected yet, allow all future dates
      if (bookingData.serviceCart.length === 0) {
         return true;
      }

      // Get potential staff
      const potentialStaff = findEmployeesForAllServices(employees, bookingData.serviceCart, serviceRelationships);

      if (potentialStaff.length === 0) {
         // If no staff can do all services, check if ANY employee is working
         // (for multiple-staff mode)
         return employees.some((employee) => {
            if (employee.status !== "active") return false;
            return isEmployeeWorkingOnDate(employee.id, date, workingHours, timeOffEntries);
         });
      }

      // Check if any staff member has available slots on this date
      return potentialStaff.some((employee) => {
         if (!isEmployeeWorkingOnDate(employee.id, date, workingHours, timeOffEntries)) {
            return false;
         }

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
      <div className="space-y-4">
         <div className="text-center">
            <h3 className="font-semibold text-lg">When would you like to schedule this appointment?</h3>
            <p className="text-sm text-muted-foreground mt-1">Select a date from the calendar below</p>
         </div>

         <div className="flex justify-center w-full">
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
               className="rounded-lg border w-full"
               classNames={{
                  months: "flex flex-col w-full",
                  month: "space-y-4 w-full",
                  caption: "flex justify-center pt-1 relative items-center",
                  caption_label: "text-sm font-medium",
                  nav: "space-x-1 flex items-center",
                  nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex w-full",
                  head_cell: "text-muted-foreground rounded-md w-full font-normal text-[0.8rem]",
                  row: "flex w-full mt-2",
                  cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 w-full",
                  day: "h-9 w-full p-0 font-normal",
                  day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                  day_today: "bg-accent text-accent-foreground",
                  day_outside: "text-muted-foreground opacity-50",
                  day_disabled: "text-muted-foreground opacity-50",
                  day_hidden: "invisible",
               }}
            />
         </div>

         {selectedDate && (
            <div className="text-center p-3 bg-primary/5 rounded-lg border border-primary/20">
               <p className="text-sm font-medium text-primary">
                  {selectedDate.toLocaleDateString("en-US", {
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
