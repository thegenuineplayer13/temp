import { useState, useCallback } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { useFrontDeskStore } from "@/features/core/store/store.front-desk";
import { useAppointments } from "@/features/core/hooks/queries/queries.dashboard-front-desk";
import { SearchBar } from "./front-desk/search-bar";
import { StaffOverviewCard } from "./front-desk/staff-overview-card";
import { TodaySchedule } from "./front-desk/today-schedule";
import { WalkInQueue } from "./front-desk/walk-in-queue";
import { CustomerQuickView } from "./front-desk/customer-quick-view";
import { AppointmentActionsDialog } from "./front-desk/appointment-actions-dialog";
import { RegisterCustomerDialog } from "./front-desk/register-customer-dialog";
import { CreateAppointmentWizard } from "./front-desk/create-appointment-wizard";
import { FrontDeskActionsPanel } from "./front-desk/front-desk-actions-panel";
import { QuickWalkInDialog } from "./front-desk/quick-walk-in-dialog";
import type { NewCustomer } from "@/features/core/types/types.dashboard-front-desk";

type MobileView = "dashboard" | "queue";

export default function FrontDeskDashboard() {
   const isMobile = useIsMobile();
   const [mobileView, setMobileView] = useState<MobileView>("dashboard");
   const [quickWalkInOpen, setQuickWalkInOpen] = useState(false);

   const { data: appointments = [] } = useAppointments();

   const { openCustomerView, openActionDialog, openRegisterDialog, closeCustomerView, openBookingWizard, selectedCustomer } = useFrontDeskStore();

   const handleCheckIn = useCallback(
      (appointmentId: string) => {
         const appointment = appointments.find((a) => a.id === appointmentId);
         if (appointment) {
            openActionDialog(appointment, "check-in");
         }
      },
      [appointments, openActionDialog]
   );

   const handleCancel = useCallback(
      (appointmentId: string) => {
         const appointment = appointments.find((a) => a.id === appointmentId);
         if (appointment) {
            openActionDialog(appointment, "cancel");
         }
      },
      [appointments, openActionDialog]
   );

   const handleProcessPayment = useCallback(
      (appointmentId: string) => {
         const appointment = appointments.find((a) => a.id === appointmentId);
         if (appointment) {
            openActionDialog(appointment, "payment");
         }
      },
      [appointments, openActionDialog]
   );

   const handleViewDetails = useCallback((appointmentId: string) => {
      console.log("View appointment details:", appointmentId);
   }, []);

   const handleAssignStaff = useCallback((walkInId: string, staffId: string | "first-available") => {
      console.log("Assigning staff:", { walkInId, staffId });
   }, []);

   const handleViewWalkInCustomer = useCallback((walkInId: string) => {
      console.log("View walk-in customer:", walkInId);
   }, []);

   const handleBookAppointment = useCallback(
      (customerId: string) => {
         console.log("Book appointment for customer:", customerId);
         openBookingWizard(selectedCustomer || undefined);
         closeCustomerView();
      },
      [openBookingWizard, closeCustomerView, selectedCustomer]
   );

   const handleAddToWalkIn = useCallback(
      (customerId: string) => {
         console.log("Add customer to walk-in queue:", customerId);
         closeCustomerView();
         if (isMobile) {
            setMobileView("queue");
         }
      },
      [closeCustomerView, isMobile]
   );

   const handleRegisterCustomer = useCallback((customerData: NewCustomer) => {
      console.log("Registering new customer:", customerData);
   }, []);

   const handleQuickWalkIn = useCallback(
      (name: string, serviceIds?: string[]) => {
         console.log("Adding quick walk-in:", { name, serviceIds });
         if (isMobile) {
            setMobileView("queue");
         }
      },
      [isMobile]
   );

   const handleOpenQuickWalkIn = useCallback(() => {
      setQuickWalkInOpen(true);
   }, []);

   return (
      <div className="min-h-screen bg-background">
         <SearchBar
            onSelectCustomer={openCustomerView}
            onRegisterClick={openRegisterDialog}
            onBookAppointmentClick={openBookingWizard}
         />

         {isMobile && (
            <div className="sticky top-[73px] z-40 bg-background border-b">
               <div className="container mx-auto px-4 py-3">
                  <Tabs value={mobileView} onValueChange={(v) => setMobileView(v as MobileView)}>
                     <TabsList className="w-full">
                        <TabsTrigger value="dashboard" className="flex-1">
                           Dashboard
                        </TabsTrigger>
                        <TabsTrigger value="queue" className="flex-1">
                           Walk-in Queue
                        </TabsTrigger>
                     </TabsList>
                  </Tabs>
               </div>
            </div>
         )}

         <div className="container mx-auto px-4 md:px-6 py-6">
            {!isMobile && (
               <div className="mb-6">
                  <h1 className="text-3xl font-bold tracking-tight">Front Desk</h1>
                  <p className="text-muted-foreground">Manage appointments, walk-ins, and customer check-ins</p>
               </div>
            )}

            {isMobile ? (
               <>
                  {mobileView === "dashboard" ? (
                     <div className="space-y-4">
                        <TodaySchedule
                           onCheckIn={handleCheckIn}
                           onCancel={handleCancel}
                           onProcessPayment={handleProcessPayment}
                           onViewDetails={handleViewDetails}
                        />
                     </div>
                  ) : (
                     <WalkInQueue onAssignStaff={handleAssignStaff} onViewCustomer={handleViewWalkInCustomer} />
                  )}
               </>
            ) : (
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-8 space-y-6">
                     <TodaySchedule
                        onCheckIn={handleCheckIn}
                        onCancel={handleCancel}
                        onProcessPayment={handleProcessPayment}
                        onViewDetails={handleViewDetails}
                     />
                     <StaffOverviewCard />
                  </div>

                  <div className="lg:col-span-4">
                     <WalkInQueue onAssignStaff={handleAssignStaff} onViewCustomer={handleViewWalkInCustomer} />
                  </div>
               </div>
            )}
         </div>

         <CustomerQuickView
            onBookAppointment={handleBookAppointment}
            onAddToWalkIn={handleAddToWalkIn}
            onCheckIn={handleCheckIn}
            onCancel={handleCancel}
            onProcessPayment={handleProcessPayment}
         />

         <AppointmentActionsDialog />

         <RegisterCustomerDialog onRegister={handleRegisterCustomer} />

         <CreateAppointmentWizard />

         <FrontDeskActionsPanel
            onBookAppointment={openBookingWizard}
            onRegisterCustomer={openRegisterDialog}
            onAddToWalkIn={handleOpenQuickWalkIn}
         />

         <QuickWalkInDialog open={quickWalkInOpen} onOpenChange={setQuickWalkInOpen} onAddWalkIn={handleQuickWalkIn} />
      </div>
   );
}
