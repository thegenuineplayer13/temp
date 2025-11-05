import { create } from "zustand";
import type { Appointment, Customer, AppointmentStatus } from "@/features/core/types/types.dashboard-front-desk";

type ActionType = "check-in" | "cancel" | "payment" | "reschedule" | null;

interface FrontDeskState {
   selectedCustomer: Customer | null;
   selectedAppointment: Appointment | null;
   currentActionType: ActionType;
   isCustomerViewOpen: boolean;
   isActionDialogOpen: boolean;
   isRegisterDialogOpen: boolean;
   filterStatus: AppointmentStatus | "all";
   filterStaffId: string;
   setSelectedCustomer: (customer: Customer | null) => void;
   setSelectedAppointment: (appointment: Appointment | null) => void;
   setCurrentActionType: (type: ActionType) => void;
   openCustomerView: (customer: Customer) => void;
   closeCustomerView: () => void;
   openActionDialog: (appointment: Appointment, action: ActionType) => void;
   closeActionDialog: () => void;
   openRegisterDialog: () => void;
   closeRegisterDialog: () => void;
   setFilterStatus: (status: AppointmentStatus | "all") => void;
   setFilterStaffId: (staffId: string) => void;
   resetFilters: () => void;
}

export const useFrontDeskStore = create<FrontDeskState>((set) => ({
   selectedCustomer: null,
   selectedAppointment: null,
   currentActionType: null,
   isCustomerViewOpen: false,
   isActionDialogOpen: false,
   isRegisterDialogOpen: false,
   filterStatus: "all",
   filterStaffId: "all",

   setSelectedCustomer: (customer) => set({ selectedCustomer: customer }),
   setSelectedAppointment: (appointment) => set({ selectedAppointment: appointment }),
   setCurrentActionType: (type) => set({ currentActionType: type }),

   openCustomerView: (customer) =>
      set({
         selectedCustomer: customer,
         isCustomerViewOpen: true,
      }),

   closeCustomerView: () =>
      set({
         isCustomerViewOpen: false,
         selectedCustomer: null,
      }),

   openActionDialog: (appointment, action) =>
      set({
         selectedAppointment: appointment,
         currentActionType: action,
         isActionDialogOpen: true,
      }),

   closeActionDialog: () =>
      set({
         isActionDialogOpen: false,
         selectedAppointment: null,
         currentActionType: null,
      }),

   openRegisterDialog: () => set({ isRegisterDialogOpen: true }),
   closeRegisterDialog: () => set({ isRegisterDialogOpen: false }),

   setFilterStatus: (status) => set({ filterStatus: status }),
   setFilterStaffId: (staffId) => set({ filterStaffId: staffId }),
   resetFilters: () => set({ filterStatus: "all", filterStaffId: "all" }),
}));
