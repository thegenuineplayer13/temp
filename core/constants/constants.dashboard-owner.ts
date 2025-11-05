// Chart colors mapped to CSS variables
export const CHART_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"] as const;

export const getChartColor = (index: number): string => {
   return CHART_COLORS[index % CHART_COLORS.length];
};

export const DISPLAY_LIMITS = {
   MOBILE_REVIEWS: 3,
   DESKTOP_REVIEWS: 3,
   MOBILE_SERVICES: 4,
   DESKTOP_SERVICES: 5,
   MOBILE_CHART_DAYS: 4,
   TOP_STAFF: 6,
   DETAILED_SERVICES: 10,
   DETAILED_STAFF: 10,
   DETAILED_FEEDBACK: 15,
} as const;

export const ANIMATION = {
   REFRESH_DELAY: 1500,
   NETWORK_DELAY: 300,
} as const;

export const PULL_TO_REFRESH = {
   THRESHOLD: 80,
} as const;
