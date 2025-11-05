import { create } from "zustand";
import type { ReadStatus, Review } from "@/features/core/types/types.reviews";

interface DateRange {
	from: Date;
	to?: Date;
}

interface ReviewsState {
	selectedDate: Date | null;
	dateRange: DateRange | null;
	readFilter: ReadStatus | "all";
	starFilter: number | "all";
	searchQuery: string;
	selectedReviewId: string | null;
	detailOpen: boolean;
	responseModalOpen: boolean;
	reviewToRespond: Review | null;

	// Methods
	setSelectedDate: (date: Date | null) => void;
	setDateRange: (range: DateRange | null) => void;
	setReadFilter: (filter: ReadStatus | "all") => void;
	setStarFilter: (stars: number | "all") => void;
	setSearchQuery: (query: string) => void;
	setSelectedReviewId: (id: string | null) => void;
	setDetailOpen: (open: boolean) => void;
	setResponseModalOpen: (open: boolean) => void;
	setReviewToRespond: (review: Review | null) => void;
	openResponseModal: (review: Review) => void;
	closeResponseModal: () => void;
	clearFilters: () => void;
}

export const useReviewsStore = create<ReviewsState>((set) => ({
	selectedDate: null,
	dateRange: null,
	readFilter: "all",
	starFilter: "all",
	searchQuery: "",
	selectedReviewId: null,
	detailOpen: false,
	responseModalOpen: false,
	reviewToRespond: null,

	setSelectedDate: (date) => set({ selectedDate: date, dateRange: null }),
	setDateRange: (range) => set({ dateRange: range, selectedDate: null }),
	setReadFilter: (filter) => set({ readFilter: filter }),
	setStarFilter: (stars) => set({ starFilter: stars }),
	setSearchQuery: (query) => set({ searchQuery: query }),
	setSelectedReviewId: (id) => set({ selectedReviewId: id }),
	setDetailOpen: (open) => set({ detailOpen: open }),
	setResponseModalOpen: (open) => set({ responseModalOpen: open }),
	setReviewToRespond: (review) => set({ reviewToRespond: review }),
	openResponseModal: (review) => set({ responseModalOpen: true, reviewToRespond: review }),
	closeResponseModal: () => set({ responseModalOpen: false, reviewToRespond: null }),
	clearFilters: () =>
		set({
			selectedDate: null,
			dateRange: null,
			readFilter: "all",
			starFilter: "all",
			searchQuery: "",
		}),
}));
