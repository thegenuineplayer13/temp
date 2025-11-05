import { create } from "zustand";
import type {
   Appointment,
   Customer,
   AppointmentStatus,
   BookingData,
   ServiceCartItem,
   StaffAssignmentMode,
   ServiceStaffAssignment,
} from "@/features/core/types/types.dashboard-front-desk";

type ActionType = "check-in" | "cancel" | "payment" | "reschedule" | null;

type BookingStep = 1 | 2 | 3 | 4 | 5;

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

   // Booking wizard state
   isBookingWizardOpen: boolean;
   bookingStep: BookingStep;
   bookingData: BookingData;
   openBookingWizard: (customer?: Customer) => void;
   closeBookingWizard: () => void;
   setBookingStep: (step: BookingStep) => void;
   nextBookingStep: () => void;
   prevBookingStep: () => void;
   updateBookingData: (data: Partial<BookingData>) => void;
   addServiceToCart: (service: ServiceCartItem) => void;
   removeServiceFromCart: (serviceId: string) => void;
   setAssignmentMode: (mode: StaffAssignmentMode) => void;
   setSingleStaff: (staffId: string, staffName: string) => void;
   updateServiceAssignment: (serviceId: string, assignment: Partial<ServiceStaffAssignment>) => void;
   resetBookingWizard: () => void;
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

   // Booking wizard implementation
   isBookingWizardOpen: false,
   bookingStep: 1,
   bookingData: {
      clientId: null,
      clientName: null,
      clientPhone: null,
      serviceCart: [],
      totalDuration: 0,
      totalPrice: 0,
      assignmentMode: "auto",
      singleStaffId: null,
      singleStaffName: null,
      serviceAssignments: [],
      selectedDate: null,
      startTime: null,
      notes: "",
      bookingGroupId: crypto.randomUUID(),
   },

   openBookingWizard: (customer?: Customer) =>
      set({
         isBookingWizardOpen: true,
         bookingStep: 1,
         bookingData: {
            clientId: customer?.id || null,
            clientName: customer?.name || null,
            clientPhone: customer?.phone || null,
            serviceCart: [],
            totalDuration: 0,
            totalPrice: 0,
            assignmentMode: "auto",
            singleStaffId: null,
            singleStaffName: null,
            serviceAssignments: [],
            selectedDate: null,
            startTime: null,
            notes: "",
            bookingGroupId: crypto.randomUUID(),
         },
      }),

   closeBookingWizard: () =>
      set({
         isBookingWizardOpen: false,
      }),

   setBookingStep: (step) => set({ bookingStep: step }),

   nextBookingStep: () => set((state) => ({ bookingStep: Math.min(5, state.bookingStep + 1) as BookingStep })),

   prevBookingStep: () => set((state) => ({ bookingStep: Math.max(1, state.bookingStep - 1) as BookingStep })),

   updateBookingData: (data) =>
      set((state) => ({
         bookingData: { ...state.bookingData, ...data },
      })),

   addServiceToCart: (service) =>
      set((state) => {
         const newCart = [...state.bookingData.serviceCart, service];
         const totalDuration = newCart.reduce((sum, s) => sum + s.duration, 0);
         const totalPrice = newCart.reduce((sum, s) => sum + s.price, 0);

         // Create service assignment entry for this service
         const newAssignment: ServiceStaffAssignment = {
            serviceId: service.serviceId,
            serviceName: service.serviceName,
            duration: service.duration,
            staffId: null,
            staffName: null,
            startTime: null,
         };

         return {
            bookingData: {
               ...state.bookingData,
               serviceCart: newCart,
               totalDuration,
               totalPrice,
               serviceAssignments: [...state.bookingData.serviceAssignments, newAssignment],
            },
         };
      }),

   removeServiceFromCart: (serviceId) =>
      set((state) => {
         const newCart = state.bookingData.serviceCart.filter((s) => s.serviceId !== serviceId);
         const totalDuration = newCart.reduce((sum, s) => sum + s.duration, 0);
         const totalPrice = newCart.reduce((sum, s) => sum + s.price, 0);

         // Remove the service assignment entry
         const newAssignments = state.bookingData.serviceAssignments.filter((a) => a.serviceId !== serviceId);

         return {
            bookingData: {
               ...state.bookingData,
               serviceCart: newCart,
               totalDuration,
               totalPrice,
               serviceAssignments: newAssignments,
            },
         };
      }),

   setAssignmentMode: (mode) =>
      set((state) => ({
         bookingData: {
            ...state.bookingData,
            assignmentMode: mode,
         },
      })),

   setSingleStaff: (staffId, staffName) =>
      set((state) => ({
         bookingData: {
            ...state.bookingData,
            singleStaffId: staffId,
            singleStaffName: staffName,
         },
      })),

   updateServiceAssignment: (serviceId, assignment) =>
      set((state) => {
         const newAssignments = state.bookingData.serviceAssignments.map((a) =>
            a.serviceId === serviceId ? { ...a, ...assignment } : a,
         );

         return {
            bookingData: {
               ...state.bookingData,
               serviceAssignments: newAssignments,
            },
         };
      }),

   resetBookingWizard: () =>
      set({
         isBookingWizardOpen: false,
         bookingStep: 1,
         bookingData: {
            clientId: null,
            clientName: null,
            clientPhone: null,
            serviceCart: [],
            totalDuration: 0,
            totalPrice: 0,
            assignmentMode: "auto",
            singleStaffId: null,
            singleStaffName: null,
            serviceAssignments: [],
            selectedDate: null,
            startTime: null,
            notes: "",
            bookingGroupId: crypto.randomUUID(),
         },
      }),
}));
