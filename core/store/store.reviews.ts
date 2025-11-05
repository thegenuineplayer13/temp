import { create } from "zustand";
import type { ReadStatus } from "@/features/core/types/types.reviews";

interface ReviewsState {
	selectedDate: Date | null;
	readFilter: ReadStatus | "all";
	searchQuery: string;
	selectedReviewId: string | null;
	detailOpen: boolean;

	// Methods
	setSelectedDate: (date: Date | null) => void;
	setReadFilter: (filter: ReadStatus | "all") => void;
	setSearchQuery: (query: string) => void;
	setSelectedReviewId: (id: string | null) => void;
	setDetailOpen: (open: boolean) => void;
	clearFilters: () => void;
}

export const useReviewsStore = create<ReviewsState>((set) => ({
	selectedDate: null,
	readFilter: "all",
	searchQuery: "",
	selectedReviewId: null,
	detailOpen: false,

	setSelectedDate: (date) => set({ selectedDate: date }),
	setReadFilter: (filter) => set({ readFilter: filter }),
	setSearchQuery: (query) => set({ searchQuery: query }),
	setSelectedReviewId: (id) => set({ selectedReviewId: id }),
	setDetailOpen: (open) => set({ detailOpen: open }),
	clearFilters: () =>
		set({
			selectedDate: null,
			readFilter: "all",
			searchQuery: "",
		}),
}));
