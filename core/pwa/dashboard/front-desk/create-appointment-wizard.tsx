import { ResponsiveDialog } from "@/features/core/components/shared/responsive-dialog";
import { useFrontDeskStore } from "@/features/core/store/store.front-desk";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { CreateAppointmentStepClient } from "./create-appointment-step-client";
import { CreateAppointmentStepServices } from "./create-appointment-step-services";
import { CreateAppointmentStepStaff } from "./create-appointment-step-staff";
import { CreateAppointmentStepDateTime } from "./create-appointment-step-datetime";
import { CreateAppointmentStepReview } from "./create-appointment-step-review";

export function CreateAppointmentWizard() {
   const { isBookingWizardOpen, bookingStep, bookingData, closeBookingWizard, nextBookingStep, prevBookingStep, resetBookingWizard } =
      useFrontDeskStore();

   const handleClose = () => {
      resetBookingWizard();
   };

   const canProceedToNextStep = (): boolean => {
      switch (bookingStep) {
         case 1:
            // Client selection: must have a client selected
            return !!bookingData.clientId;
         case 2:
            // Service selection: must have at least one service
            return bookingData.serviceCart.length > 0;
         case 3:
            // Staff assignment: depends on mode
            if (bookingData.assignmentMode === "single") {
               return !!bookingData.singleStaffId;
            } else if (bookingData.assignmentMode === "multiple") {
               // All services must have staff assigned
               return bookingData.serviceAssignments.every((assignment) => !!assignment.staffId);
            }
            return true; // auto mode always can proceed
         case 4:
            // Date/Time selection: must have date and time
            if (bookingData.assignmentMode === "multiple") {
               // For multiple staff, each service must have a start time
               return (
                  !!bookingData.selectedDate &&
                  bookingData.serviceAssignments.every((assignment) => !!assignment.startTime)
               );
            }
            // For single staff or auto, just need date and start time
            return !!bookingData.selectedDate && !!bookingData.startTime;
         case 5:
            // Review step: always ready
            return true;
         default:
            return false;
      }
   };

   const handleNext = () => {
      if (canProceedToNextStep()) {
         nextBookingStep();
      }
   };

   const handleBack = () => {
      prevBookingStep();
   };

   const stepTitles = [
      "Select Client",
      "Select Services",
      "Assign Staff",
      "Choose Date & Time",
      "Review & Confirm",
   ];

   const renderStep = () => {
      switch (bookingStep) {
         case 1:
            return <CreateAppointmentStepClient />;
         case 2:
            return <CreateAppointmentStepServices />;
         case 3:
            return <CreateAppointmentStepStaff />;
         case 4:
            return <CreateAppointmentStepDateTime />;
         case 5:
            return <CreateAppointmentStepReview />;
         default:
            return null;
      }
   };

   const footer = (
      <div className="flex flex-col gap-3">
         {/* Progress indicator */}
         <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((step) => (
               <div
                  key={step}
                  className={`h-2 rounded-full transition-all ${
                     step === bookingStep
                        ? "w-8 bg-primary"
                        : step < bookingStep
                          ? "w-2 bg-primary/50"
                          : "w-2 bg-muted"
                  }`}
               />
            ))}
         </div>

         {/* Navigation buttons */}
         <div className="flex gap-2">
            {bookingStep > 1 && (
               <Button variant="outline" onClick={handleBack} className="flex-1">
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back
               </Button>
            )}

            {bookingStep < 5 ? (
               <Button onClick={handleNext} disabled={!canProceedToNextStep()} className="flex-1">
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
               </Button>
            ) : null}

            {bookingStep === 1 && (
               <Button variant="ghost" onClick={handleClose} className="flex-1">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
               </Button>
            )}
         </div>
      </div>
   );

   return (
      <ResponsiveDialog
         open={isBookingWizardOpen}
         onOpenChange={(open) => !open && handleClose()}
         title={stepTitles[bookingStep - 1]}
         description={`Step ${bookingStep} of 5`}
         footer={footer}
         className="max-w-2xl"
      >
         <div className="py-4">{renderStep()}</div>
      </ResponsiveDialog>
   );
}
