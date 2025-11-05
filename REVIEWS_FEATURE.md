# Customer Reviews Feature

A comprehensive, mobile-first reviews page for service-based businesses built with React, TypeScript, Shadcn/UI, and Tailwind CSS.

## 📁 Files Created

### Core Files

```
core/
├── schemas/schemas.reviews.ts         # Zod schemas for validation
├── types/types.reviews.ts             # TypeScript types (derived from schemas)
├── store/store.reviews.ts             # Zustand state management
├── hooks/queries/queries.reviews.ts   # React Query hooks
├── pages/page-reviews.tsx             # Main reviews page component
└── components/reviews/
    └── review-card.tsx                # Individual review card component

mock/
└── mock-reviews.ts                    # Mock data for development
```

## ✨ Features

### 📊 Header Statistics (Mobile & Desktop)
- **Average Rating** - Star rating out of 5.0
- **Total Reviews** - Count of all reviews
- **Unread Count** - Number of unread reviews
- **Response Rate** - Percentage of reviews responded to
- **Sentiment Distribution** - Positive, neutral, negative counts
- **Monthly Trend** - Up/down indicator compared to last month

### 🎯 Review Card Features
- **Expandable Text** - Reviews longer than 150 characters show "Read more" button
- **Customer Type Indicator** - Subtle badge showing "Client" vs "Walk-in"
- **Sentiment Badge** - Color-coded positive/neutral/negative sentiment
- **Star Rating** - Visual 5-star rating display
- **Service & Staff Info** - Shows which service and employee
- **Response Display** - Shows business responses with timestamp
- **Flagged Reviews** - Visual indicator for flagged reviews
- **Read/Unread Status** - Border highlight for unread reviews
- **Quick Actions** - Mark as read, respond buttons

### 🔍 Filtering & Search
- **Date Filter** - Calendar picker to filter reviews by specific date
- **Read Status Filter** - All / Unread / Read tabs
- **Active Filter Count** - Badge showing number of active filters
- **Clear Filters** - Quick button to reset all filters
- **Results Counter** - Shows filtered count vs total

### 📱 Responsive Design
- **Mobile-First** - Optimized for mobile with touch-friendly interface
- **Desktop Layout** - Two-column grid for reviews on larger screens
- **Sticky Headers** - Stats and filters stay visible while scrolling
- **Adaptive UI** - Different layouts and component sizes per device

## 🎨 Design Patterns Used

Following the established patterns from dashboard, settings, and schedule pages:

1. **Type-Safe Schemas** - Zod schemas with inferred TypeScript types
2. **Zustand Store** - Centralized state management for filters
3. **Mock Queries** - React Query hooks with validated mock data
4. **Mobile/Desktop Split** - Conditional rendering with `useIsMobile` hook
5. **Stat Cards** - Consistent metric display components
6. **Color-Coded Sentiment** - Visual feedback using your color system
7. **Smooth Animations** - Hover effects and transitions
8. **Empty States** - Helpful messaging when no results

## 🚀 Integration Guide

### 1. Add Route to Your Router

```tsx
// In your main router configuration
import ReviewsPage from "@/features/core/pages/page-reviews";

// Add to your routes
{
  path: "/reviews",
  element: <ReviewsPage />,
}
```

### 2. Add Navigation Link

Add a reviews link to your navigation menu:

```tsx
import { MessageSquare } from "lucide-react";

<NavLink to="/reviews">
  <MessageSquare className="h-5 w-5" />
  Reviews
</NavLink>
```

### 3. Update Your Backend Integration

When ready to connect to a real API, replace the mock queries in `queries.reviews.ts`:

```tsx
export function useReviews() {
  return useQuery<Review[]>({
    queryKey: QUERY_KEYS.reviews,
    queryFn: async () => {
      const response = await axios.get('/api/reviews');
      const validated = response.data.map((review) =>
        reviewSchema.parse(review)
      );
      return validated;
    },
  });
}
```

## 💾 Data Structure

### Review Schema

```typescript
{
  id: string;
  customerName: string;
  customerType: "client" | "walk-in";
  customerId?: string;
  rating: number; // 0-5
  comment: string;
  service: string;
  serviceId: string;
  employee: string;
  employeeId: string;
  date: string; // ISO date string
  sentiment: "positive" | "neutral" | "negative";
  isRead: boolean;
  responded: boolean;
  responseText?: string;
  responseDate?: string;
  flagged?: boolean;
}
```

### Stats Schema

```typescript
{
  totalReviews: number;
  averageRating: number; // 0-5
  unreadCount: number;
  positiveCount: number;
  neutralCount: number;
  negativeCount: number;
  responseRate: number; // 0-100
  thisMonthCount: number;
  lastMonthCount: number;
  monthlyTrend: "up" | "down" | "stable";
  monthlyPercentageChange: number;
}
```

## 🎯 Mock Data

18 sample reviews included with variety:
- Mix of clients and walk-ins
- Different ratings (2-5 stars)
- Various sentiments
- Some with responses, some without
- Some flagged for attention
- Different dates for testing filters
- Various services and employees

## 🔧 Customization

### Adjust Expansion Threshold

In `review-card.tsx`:

```tsx
const CHARACTER_LIMIT = 150; // Change this value
```

### Modify Color Schemes

Sentiment colors in `review-card.tsx`:

```tsx
const getSentimentColor = (sentiment: string) => {
  switch (sentiment) {
    case "positive":
      return "bg-green-500/10 text-green-600...";
    case "negative":
      return "bg-red-500/10 text-red-600...";
    default:
      return "bg-yellow-500/10 text-yellow-600...";
  }
};
```

### Add More Stats

Add to `ReviewStats` type in `schemas.reviews.ts` and update the page header.

## 📸 Screenshots

### Mobile View Features
- Stacked stat cards (2-column grid)
- Compact sentiment distribution card
- Tab-based read/unread filter
- Full-width review cards
- Touch-optimized buttons

### Desktop View Features
- 6-column stats header
- Side-by-side filters with results counter
- Two-column review grid
- Hover effects on stat cards
- Calendar popover for date selection

## 🎨 UI Components Used

- `Card` / `CardContent` - Container components
- `Button` - Action buttons
- `Badge` - Status indicators
- `Tabs` - Filter tabs
- `Calendar` / `Popover` - Date picker
- Lucide icons - Consistent iconography

## 🔄 State Management

### Store (store.reviews.ts)
- `selectedDate` - Date filter
- `readFilter` - "all" | "read" | "unread"
- `searchQuery` - Future search feature
- `selectedReviewId` - For detail modals
- `detailOpen` - Modal state

### Methods
- `setSelectedDate(date)`
- `setReadFilter(filter)`
- `clearFilters()` - Reset all filters

## 🚧 Future Enhancements

Consider adding:
1. **Search** - Text search across reviews
2. **Rating Filter** - Filter by star rating
3. **Service Filter** - Filter by specific service
4. **Employee Filter** - Filter by staff member
5. **Response Modal** - Quick response interface
6. **Bulk Actions** - Mark multiple as read
7. **Export** - Download reviews as CSV/PDF
8. **Sorting** - Sort by date, rating, sentiment
9. **Pagination** - For large datasets
10. **Review Analytics** - Charts and insights

## ✅ Testing Checklist

- [x] Mobile responsive layout
- [x] Desktop responsive layout
- [x] Date filter works
- [x] Read/unread filter works
- [x] Filter clearing works
- [x] Review expansion works
- [x] Client vs walk-in indicator
- [x] Sentiment badges display
- [x] Empty state displays
- [x] Stats calculate correctly
- [x] Type safety maintained

## 📝 Notes

- All data is currently mocked for development
- Real-time updates not implemented (would need WebSocket or polling)
- Mark as read doesn't persist (add API call)
- Response feature UI-only (needs backend integration)
- Flagging system needs admin workflow
