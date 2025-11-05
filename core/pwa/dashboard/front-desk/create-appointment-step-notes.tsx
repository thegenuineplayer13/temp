import { useFrontDeskStore } from "@/features/core/store/store.front-desk";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileText } from "lucide-react";

export function CreateAppointmentStepNotes() {
   const { bookingData, updateBookingData } = useFrontDeskStore();

   const handleNotesChange = (value: string) => {
      updateBookingData({ notes: value });
   };

   return (
      <div className="space-y-6">
         <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-2">
               <FileText className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Any special instructions?</h3>
            <p className="text-sm text-muted-foreground">
               Add any notes or special requests from the client (optional)
            </p>
         </div>

         <div className="space-y-3">
            <Label htmlFor="notes" className="text-base font-medium">
               Notes
            </Label>
            <Textarea
               id="notes"
               placeholder="Example: Client prefers warm water, has sensitive scalp, requests specific hair products, etc."
               value={bookingData.notes || ""}
               onChange={(e) => handleNotesChange(e.target.value)}
               rows={8}
               className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
               These notes will be visible to the assigned staff member(s)
            </p>
         </div>
      </div>
   );
}
