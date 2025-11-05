import { create } from "zustand";
import type { Specialization, Service } from "../types/types.services";

interface ServicesState {
  // Selected specialization for relationship management
  selectedSpecializationId: string | null;
  setSelectedSpecializationId: (id: string | null) => void;

  // Hover states for relationship highlighting
  hoveredSpecializationId: string | null;
  hoveredServiceId: string | null;
  setHoveredSpecializationId: (id: string | null) => void;
  setHoveredServiceId: (id: string | null) => void;

  // Dialog states
  isSpecializationDialogOpen: boolean;
  isServiceDialogOpen: boolean;
  editingSpecialization: Specialization | null;
  editingService: Service | null;

  openSpecializationDialog: (spec?: Specialization) => void;
  closeSpecializationDialog: () => void;
  openServiceDialog: (service?: Service) => void;
  closeServiceDialog: () => void;

  // Reset all states
  reset: () => void;
}

export const useServicesStore = create<ServicesState>((set) => ({
  // State
  selectedSpecializationId: null,
  hoveredSpecializationId: null,
  hoveredServiceId: null,
  isSpecializationDialogOpen: false,
  isServiceDialogOpen: false,
  editingSpecialization: null,
  editingService: null,

  // Actions
  setSelectedSpecializationId: (id) => set({ selectedSpecializationId: id }),
  setHoveredSpecializationId: (id) => set({ hoveredSpecializationId: id }),
  setHoveredServiceId: (id) => set({ hoveredServiceId: id }),

  openSpecializationDialog: (spec) =>
    set({
      isSpecializationDialogOpen: true,
      editingSpecialization: spec || null,
    }),

  closeSpecializationDialog: () =>
    set({
      isSpecializationDialogOpen: false,
      editingSpecialization: null,
    }),

  openServiceDialog: (service) =>
    set({
      isServiceDialogOpen: true,
      editingService: service || null,
    }),

  closeServiceDialog: () =>
    set({
      isServiceDialogOpen: false,
      editingService: null,
    }),

  reset: () =>
    set({
      selectedSpecializationId: null,
      hoveredSpecializationId: null,
      hoveredServiceId: null,
      isSpecializationDialogOpen: false,
      isServiceDialogOpen: false,
      editingSpecialization: null,
      editingService: null,
    }),
}));
