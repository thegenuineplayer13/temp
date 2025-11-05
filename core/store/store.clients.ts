import { create } from "zustand";
import type { Client } from "../types/types.clients";

interface ClientsState {
  // Filter and search
  searchQuery: string;
  filterType: "all" | "registered" | "walk-in";
  setSearchQuery: (query: string) => void;
  setFilterType: (type: "all" | "registered" | "walk-in") => void;

  // Pagination
  currentPage: number;
  itemsPerPage: number;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (items: number) => void;

  // Selected client and dialog states
  selectedClient: Client | null;
  clientToDelete: Client | null;
  isViewDialogOpen: boolean;
  isFormDialogOpen: boolean;
  isDeleteDialogOpen: boolean;

  setSelectedClient: (client: Client | null) => void;
  setClientToDelete: (client: Client | null) => void;

  openViewDialog: (client: Client) => void;
  closeViewDialog: () => void;

  openFormDialog: (client?: Client) => void;
  closeFormDialog: () => void;

  openDeleteDialog: (client: Client) => void;
  closeDeleteDialog: () => void;

  // Reset filters
  resetFilters: () => void;
}

export const useClientsStore = create<ClientsState>((set) => ({
  // State
  searchQuery: "",
  filterType: "all",
  currentPage: 1,
  itemsPerPage: 10,
  selectedClient: null,
  clientToDelete: null,
  isViewDialogOpen: false,
  isFormDialogOpen: false,
  isDeleteDialogOpen: false,

  // Actions
  setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }),
  setFilterType: (type) => set({ filterType: type, currentPage: 1 }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setItemsPerPage: (items) => set({ itemsPerPage: items, currentPage: 1 }),
  setSelectedClient: (client) => set({ selectedClient: client }),
  setClientToDelete: (client) => set({ clientToDelete: client }),

  openViewDialog: (client) =>
    set({
      selectedClient: client,
      isViewDialogOpen: true,
    }),

  closeViewDialog: () =>
    set({
      isViewDialogOpen: false,
      selectedClient: null,
    }),

  openFormDialog: (client) =>
    set({
      selectedClient: client || null,
      isFormDialogOpen: true,
    }),

  closeFormDialog: () =>
    set({
      isFormDialogOpen: false,
      selectedClient: null,
    }),

  openDeleteDialog: (client) =>
    set({
      clientToDelete: client,
      isDeleteDialogOpen: true,
    }),

  closeDeleteDialog: () =>
    set({
      isDeleteDialogOpen: false,
      clientToDelete: null,
    }),

  resetFilters: () =>
    set({
      searchQuery: "",
      filterType: "all",
      currentPage: 1,
    }),
}));
