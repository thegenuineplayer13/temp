import { useFrontDeskStore } from "@/features/core/store/store.front-desk";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";

export function CreateAppointmentStepDate() {
   const { bookingData, updateBookingData } = useFrontDeskStore();

   const selectedDate = bookingData.selectedDate ? new Date(bookingData.selectedDate) : undefined;

   const handleDateSelect = (date: Date | undefined) => {
      if (!date) return;

      updateBookingData({
         selectedDate: date.toISOString(),
         startTime: null, // Reset time when date changes
      });

      // Reset service assignment times for parallel mode
      bookingData.serviceAssignments.forEach((assignment) => {
         // We'll update these in the staff-time step
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
               Select a date to see available time slots
            </p>
         </div>

         <div className="flex justify-center">
            <Calendar
               mode="single"
               selected={selectedDate}
               onSelect={handleDateSelect}
               disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
               className="rounded-md border shadow-sm scale-110"
               classNames={{
                  months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                  month: "space-y-4",
                  caption: "flex justify-center pt-1 relative items-center",
                  caption_label: "text-base font-semibold",
                  nav: "space-x-1 flex items-center",
                  nav_button: "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100",
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex",
                  head_cell: "text-muted-foreground rounded-md w-11 font-normal text-sm",
                  row: "flex w-full mt-2",
                  cell: "h-11 w-11 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                  day: "h-11 w-11 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md",
                  day_range_end: "day-range-end",
                  day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground font-semibold",
                  day_today: "bg-accent text-accent-foreground font-semibold",
                  day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                  day_disabled: "text-muted-foreground opacity-50",
                  day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                  day_hidden: "invisible",
               }}
            />
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
