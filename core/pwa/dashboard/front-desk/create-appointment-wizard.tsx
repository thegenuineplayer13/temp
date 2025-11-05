import { useMemo } from "react";
import { ResponsiveDialog } from "@/features/core/components/shared/responsive-dialog";
import { useFrontDeskStore } from "@/features/core/store/store.front-desk";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { CreateAppointmentStepClient } from "./create-appointment-step-client";
import { CreateAppointmentStepServices } from "./create-appointment-step-services";
import { CreateAppointmentStepDate } from "./create-appointment-step-date";
import { CreateAppointmentStepAssignmentMode } from "./create-appointment-step-assignment-mode";
import { CreateAppointmentStepStaffTime } from "./create-appointment-step-staff-time";
import { CreateAppointmentStepNotes } from "./create-appointment-step-notes";
import { CreateAppointmentStepReview } from "./create-appointment-step-review";

type WizardStep = {
   id: string;
   title: string;
   component: React.ReactNode;
   canProceed: () => boolean;
};

export function CreateAppointmentWizard() {
   const { isBookingWizardOpen, bookingStep, bookingData, closeBookingWizard, setBookingStep, resetBookingWizard } =
      useFrontDeskStore();

   // Build dynamic step list
   const steps = useMemo((): WizardStep[] => {
      const allSteps: WizardStep[] = [];

      // Step 1: Client selection (skip if already selected)
      if (!bookingData.clientId) {
         allSteps.push({
            id: "client",
            title: "Select Client",
            component: <CreateAppointmentStepClient />,
            canProceed: () => !!bookingData.clientId,
         });
      }

      // Step 2: Service selection
      allSteps.push({
         id: "services",
         title: "Select Services",
         component: <CreateAppointmentStepServices />,
         canProceed: () => bookingData.serviceCart.length > 0,
      });

      // Step 3: Date selection
      allSteps.push({
         id: "date",
         title: "Choose Date",
         component: <CreateAppointmentStepDate />,
         canProceed: () => !!bookingData.selectedDate,
      });

      // Step 4: Assignment mode (only if multiple services)
      if (bookingData.serviceCart.length > 1) {
         allSteps.push({
            id: "assignment-mode",
            title: "Assignment Mode",
            component: <CreateAppointmentStepAssignmentMode />,
            canProceed: () => bookingData.assignmentMode !== "auto",
         });
      }

      // Step 5: Staff & Time selection
      allSteps.push({
         id: "staff-time",
         title: "Select Staff & Time",
         component: <CreateAppointmentStepStaffTime />,
         canProceed: () => {
            if (bookingData.assignmentMode === "single") {
               return !!bookingData.singleStaffId && !!bookingData.startTime;
            } else if (bookingData.assignmentMode === "multiple") {
               return bookingData.serviceAssignments.every((a) => !!a.staffId && !!a.startTime);
            }
            return false;
         },
      });

      // Step 6: Notes
      allSteps.push({
         id: "notes",
         title: "Add Notes",
         component: <CreateAppointmentStepNotes />,
         canProceed: () => true, // Notes are optional
      });

      // Step 7: Review
      allSteps.push({
         id: "review",
         title: "Review & Confirm",
         component: <CreateAppointmentStepReview />,
         canProceed: () => true,
      });

      return allSteps;
   }, [bookingData.clientId, bookingData.serviceCart.length, bookingData.assignmentMode, bookingData.singleStaffId, bookingData.startTime, bookingData.serviceAssignments]);

   const currentStepIndex = bookingStep - 1;
   const currentStep = steps[currentStepIndex];
   const totalSteps = steps.length;
   const isLastStep = currentStepIndex === totalSteps - 1;

   const handleClose = () => {
      resetBookingWizard();
   };

   const handleNext = () => {
      if (currentStep?.canProceed()) {
         setBookingStep(Math.min(totalSteps, bookingStep + 1));
      }
   };

   const handleBack = () => {
      setBookingStep(Math.max(1, bookingStep - 1));
   };

   const footer = (
      <div className="flex flex-col gap-3">
         {/* Progress indicator */}
         <div className="flex items-center justify-center gap-2">
            {steps.map((_, index) => (
               <div
                  key={index}
                  className={`h-2 rounded-full transition-all ${
                     index + 1 === bookingStep
                        ? "w-8 bg-primary"
                        : index + 1 < bookingStep
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

            {!isLastStep ? (
               <Button onClick={handleNext} disabled={!currentStep?.canProceed()} className="flex-1">
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
         title={currentStep?.title || ""}
         description={`Step ${bookingStep} of ${totalSteps}`}
         footer={footer}
         className="max-w-3xl"
      >
         <div className="min-h-[400px]">{currentStep?.component}</div>
      </ResponsiveDialog>
   );
}
