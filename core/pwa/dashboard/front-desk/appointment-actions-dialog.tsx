import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { CheckCircle2, XCircle, DollarSign, CreditCard, Banknote, Calendar } from "lucide-react";
import { useFrontDeskStore } from "@/features/core/store/store.front-desk";

export function AppointmentActionsDialog() {
   const { selectedAppointment, currentActionType, isActionDialogOpen, closeActionDialog } = useFrontDeskStore();

   const [cancelReason, setCancelReason] = useState("");
   const [paymentMethod, setPaymentMethod] = useState<"card" | "cash">("card");
   const [notes, setNotes] = useState("");

   const handleConfirm = () => {
      console.log("Action confirmed:", currentActionType, {
         appointment: selectedAppointment,
         cancelReason,
         paymentMethod,
         notes,
      });
      handleClose();
   };

   const handleClose = () => {
      setCancelReason("");
      setPaymentMethod("card");
      setNotes("");
      closeActionDialog();
   };

   if (!selectedAppointment || !currentActionType) return null;

   const renderContent = () => {
      switch (currentActionType) {
         case "check-in":
            return (
               <div className="space-y-4">
                  <div className="flex items-center justify-center py-6">
                     <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
                        <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-500" />
                     </div>
                  </div>
                  <div className="space-y-2 text-center">
                     <h3 className="font-semibold text-lg">Check In Customer</h3>
                     <p className="text-sm text-muted-foreground">
                        Mark <span className="font-semibold">{selectedAppointment.customerName}</span> as checked in for their{" "}
                        <span className="font-semibold">{selectedAppointment.service}</span> appointment at{" "}
                        {selectedAppointment.startTime}?
                     </p>
                     <p className="text-xs text-muted-foreground pt-2">
                        Staff member <span className="font-semibold">{selectedAppointment.staffName}</span> will be notified.
                     </p>
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor="notes">Notes (Optional)</Label>
                     <Textarea
                        id="notes"
                        placeholder="Add any notes for the staff member..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                     />
                  </div>
                  <div className="flex gap-2">
                     <Button onClick={handleConfirm} className="flex-1 bg-green-500 hover:bg-green-600">
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Confirm Check-In
                     </Button>
                     <Button variant="outline" onClick={handleClose}>
                        Cancel
                     </Button>
                  </div>
               </div>
            );

         case "cancel":
            return (
               <div className="space-y-4">
                  <div className="flex items-center justify-center py-6">
                     <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center">
                        <XCircle className="h-10 w-10 text-red-600 dark:text-red-500" />
                     </div>
                  </div>
                  <div className="space-y-2 text-center">
                     <h3 className="font-semibold text-lg text-red-600 dark:text-red-500">Cancel Appointment</h3>
                     <p className="text-sm text-muted-foreground">
                        Cancel the appointment for <span className="font-semibold">{selectedAppointment.customerName}</span>{" "}
                        scheduled at {selectedAppointment.startTime}?
                     </p>
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor="reason">Cancellation Reason *</Label>
                     <Textarea
                        id="reason"
                        placeholder="Please provide a reason for cancellation..."
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        rows={3}
                        required
                     />
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                     <p className="text-xs text-yellow-700 dark:text-yellow-400">
                        The customer will receive a cancellation notification via SMS/email.
                     </p>
                  </div>
                  <div className="flex gap-2">
                     <Button
                        onClick={handleConfirm}
                        disabled={!cancelReason.trim()}
                        className="flex-1 bg-red-500 hover:bg-red-600"
                     >
                        <XCircle className="h-4 w-4 mr-2" />
                        Confirm Cancellation
                     </Button>
                     <Button variant="outline" onClick={handleClose}>
                        Go Back
                     </Button>
                  </div>
               </div>
            );

         case "payment":
            return (
               <div className="space-y-4">
                  <div className="flex items-center justify-center py-6">
                     <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                        <DollarSign className="h-10 w-10 text-primary" />
                     </div>
                  </div>
                  <div className="space-y-2 text-center">
                     <h3 className="font-semibold text-lg">Process Payment</h3>
                     <p className="text-sm text-muted-foreground">
                        Process payment for <span className="font-semibold">{selectedAppointment.customerName}</span>
                     </p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                     <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">Service</span>
                        <span className="font-semibold">{selectedAppointment.service}</span>
                     </div>
                     <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">Duration</span>
                        <span className="font-semibold">{selectedAppointment.duration} min</span>
                     </div>
                     <div className="h-px bg-border my-3" />
                     <div className="flex justify-between items-center">
                        <span className="font-semibold">Total Amount</span>
                        <span className="text-2xl font-bold text-primary">$150.00</span>
                     </div>
                  </div>
                  <div className="space-y-2">
                     <Label>Payment Method</Label>
                     <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as "card" | "cash")}>
                        <div className="flex items-center space-x-2 p-3 border border-border rounded-lg hover:bg-accent/5 cursor-pointer">
                           <RadioGroupItem value="card" id="card" />
                           <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                              <CreditCard className="h-4 w-4" />
                              <span>Credit/Debit Card</span>
                           </Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 border border-border rounded-lg hover:bg-accent/5 cursor-pointer">
                           <RadioGroupItem value="cash" id="cash" />
                           <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer flex-1">
                              <Banknote className="h-4 w-4" />
                              <span>Cash</span>
                           </Label>
                        </div>
                     </RadioGroup>
                  </div>
                  <div className="flex gap-2">
                     <Button onClick={handleConfirm} className="flex-1">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Process Payment
                     </Button>
                     <Button variant="outline" onClick={handleClose}>
                        Cancel
                     </Button>
                  </div>
               </div>
            );

         case "reschedule":
            return (
               <div className="space-y-4">
                  <div className="flex items-center justify-center py-6">
                     <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center">
                        <Calendar className="h-10 w-10 text-accent" />
                     </div>
                  </div>
                  <div className="space-y-2 text-center">
                     <h3 className="font-semibold text-lg">Reschedule Appointment</h3>
                     <p className="text-sm text-muted-foreground">
                        Reschedule appointment for <span className="font-semibold">{selectedAppointment.customerName}</span>
                     </p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg text-sm">
                     <p className="text-muted-foreground mb-2">Current Appointment:</p>
                     <p className="font-semibold">
                        {selectedAppointment.service} - {selectedAppointment.startTime} - {selectedAppointment.endTime}
                     </p>
                     <p className="text-muted-foreground mt-1">with {selectedAppointment.staffName}</p>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                     <p className="text-xs text-blue-700 dark:text-blue-400">
                        This will open the booking calendar to select a new time slot.
                     </p>
                  </div>
                  <div className="flex gap-2">
                     <Button onClick={handleConfirm} className="flex-1">
                        <Calendar className="h-4 w-4 mr-2" />
                        Open Calendar
                     </Button>
                     <Button variant="outline" onClick={handleClose}>
                        Cancel
                     </Button>
                  </div>
               </div>
            );

         default:
            return null;
      }
   };

   return (
      <Dialog open={isActionDialogOpen} onOpenChange={handleClose}>
         <DialogContent className="max-w-md">{renderContent()}</DialogContent>
      </Dialog>
   );
}
