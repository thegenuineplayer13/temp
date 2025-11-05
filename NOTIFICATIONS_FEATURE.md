# Unified Alerts & Requests Feature

A comprehensive notification system for managing both alerts (inventory, staff, operations, system) and requests (time off, schedule changes, equipment, training) in a unified interface.

## Overview

This feature provides a mobile-first, priority-based notification management system that distinguishes between:
- **Alerts**: System-generated notifications requiring acknowledgment or resolution
- **Requests**: User-submitted requests requiring approval or rejection

## File Structure

```
core/
├── schemas/
│   └── schemas.notifications.ts          # Zod validation schemas
├── types/
│   └── types.notifications.ts             # TypeScript type definitions
├── store/
│   └── store.notifications.ts             # Zustand state management
├── hooks/queries/
│   └── queries.notifications.ts           # React Query hooks
├── components/notifications/
│   ├── notification-utils.tsx             # Utility functions (icons, labels, colors, time formatting)
│   ├── notification-card-base.tsx         # Base card component
│   ├── notification-router.tsx            # Routing logic for render components
│   └── renders/                           # Specialized render components
│       ├── inventory-alert-render.tsx     # Inventory-specific alerts
│       ├── staff-alert-render.tsx         # Staff-specific alerts
│       ├── general-alert-render.tsx       # Operations & system alerts
│       └── request-render.tsx             # All request types
└── pages/
    └── page-notifications.tsx              # Main unified page

mock/
└── mock-notifications.ts                  # Mock data (12 alerts + 10 requests)
```

## Features

### Alert Types

#### Inventory Alerts
- **Low Stock**: Items below reorder level
- **Out of Stock**: Items completely depleted
- **Expiring Soon**: Items nearing expiration date

#### Staff Alerts
- **No Show**: Employee didn't check in for shift
- **Late Arrival**: Employee checked in late
- **Early Departure**: Employee left before scheduled time

#### Operations Alerts
- **Appointment Conflict**: Double bookings detected
- **Equipment Malfunction**: Equipment failures
- **Maintenance Due**: Scheduled maintenance reminders

#### System Alerts
- **Payment Failed**: Declined payment transactions
- **License Expiring**: Staff license renewal reminders
- **System Update**: Available software updates

### Request Types

#### Time Off Requests
- **Day Off**: Single day time off
- **Vacation**: Multiple day vacation
- **Sick Leave**: Illness-related absence
- **Personal Day**: Personal time off
- **Bereavement**: Family emergency leave

#### Schedule Requests
- **Shift Swap**: Employee shift exchanges
- **Schedule Change**: Permanent schedule modifications

#### Other Requests
- **Equipment Request**: New equipment purchases
- **Training Request**: Professional development courses

## Priority Levels

All notifications have one of four priority levels:
- **Urgent**: Critical issues requiring immediate attention (red)
- **High**: Important items needing prompt action (orange)
- **Medium**: Items needing attention soon (yellow)
- **Low**: Items for review when convenient (blue)

## Status Management

### Alert Status Flow
1. **Unread**: Initial state (can acknowledge)
2. **Acknowledged**: Seen and noted (can resolve)
3. **Resolved**: Completed and closed

### Request Status Flow
1. **Pending**: Awaiting approval (can approve/reject)
2. **Approved**: Request granted
3. **Rejected**: Request denied

## Visual Design

### Category Indicators
- **Alert**: Orange exclamation mark icon (top-right)
- **Request**: Blue clipboard icon (top-right)

### Type Icons
Each notification type has a unique icon displayed in the card header:
- Inventory: Package icons
- Staff: User-related icons
- Operations: Calendar/wrench icons
- System: Credit card/refresh icons
- Time off: Calendar/umbrella icons
- Schedule: Settings/arrows icons
- Other: Shopping cart/graduation cap icons

### Priority Colors
Cards with urgent/high priority alerts have tinted backgrounds for immediate visibility.

### Priority Badges
Color-coded badges show priority level on each notification.

## Filtering System

### Primary Filters
- **Category**: All, Alerts, Requests (tabs)
- **Status**: All, Active, Completed (tabs)
- **Priority**: All, Urgent, High, Medium, Low (badges with counts)

### Additional Filters
- **Search**: Full-text search across title, description, and creator
- **Type**: Dropdown for specific alert/request types

### Active Filters
Clear indicator showing number of active filters with one-click reset.

## Data Structure

### Base Notification Schema
```typescript
{
  id: string
  category: "alert" | "request"
  priority: "urgent" | "high" | "medium" | "low"
  title: string
  description: string
  createdAt: string (ISO)
  createdBy?: { id, name, role }
  metadata?: Record<string, unknown>
}
```

### Alert Extensions
```typescript
{
  type: AlertType
  status: "unread" | "acknowledged" | "resolved"
  acknowledgedAt?: string
  resolvedAt?: string
  resolvedBy?: { id, name }
  affectedEntities?: Array<{ id, type, name }>
  actionRequired: boolean
  actionUrl?: string
}
```

### Request Extensions
```typescript
{
  type: RequestType
  status: "pending" | "approved" | "rejected"
  startDate?: string
  endDate?: string
  duration?: number
  reason?: string
  reviewedAt?: string
  reviewedBy?: { id, name }
  reviewNotes?: string
  affectedAppointments?: number
  replacement?: { id, name }
}
```

## Specialized Renders

Each notification type has a specialized render component that displays relevant information:

### Inventory Alert Render
- Current stock levels
- Reorder levels
- Days remaining
- Expiry dates
- Supplier information
- Affected services
- Reorder action button

### Staff Alert Render
- Employee information
- Scheduled vs actual times
- Delay/absence duration
- Affected appointments count
- Revenue at risk
- Possible replacements
- Find replacement action

### General Alert Render
Used for operations and system alerts:
- Affected entities
- Equipment details (for malfunctions)
- Maintenance schedules
- Conflict details
- Payment information
- License expiration dates
- Update information

### Request Render
Handles all request types with dynamic fields:
- Requester information
- Date ranges (for time off)
- Duration
- Reason
- Affected appointments
- Shift swap details
- Schedule change details
- Equipment/training details
- Replacement assignments
- Review notes
- Approve/Reject actions

## State Management (Zustand)

```typescript
interface NotificationsState {
  // Filters
  categoryFilter: NotificationCategory | "all"
  priorityFilter: PriorityLevel | "all"
  statusFilter: "all" | "active" | "completed"
  typeFilter: AlertType | RequestType | "all"
  searchQuery: string

  // Detail view
  selectedNotificationId: string | null
  detailOpen: boolean

  // Modals
  approvalModalOpen: boolean
  notificationToApprove: Notification | null

  // Actions
  setCategoryFilter, setPriorityFilter, setStatusFilter
  setTypeFilter, setSearchQuery, clearFilters
  openDetail, closeDetail
  openApprovalModal, closeApprovalModal
}
```

## React Query Hooks

### Queries
- `useNotifications()`: Fetch all notifications
- `useNotificationStats()`: Fetch statistics
- `useNotification(id)`: Fetch single notification

### Mutations
- `useAcknowledgeAlert()`: Acknowledge an alert
- `useResolveAlert()`: Resolve an alert
- `useApproveRequest()`: Approve a request
- `useRejectRequest()`: Reject a request

## Statistics Dashboard

The page header displays:
- Unread Alerts count
- Pending Requests count
- High Priority items count (urgent + high)
- This Week count

## Priority Grouping

Notifications are grouped by priority level with collapsible sections:
1. **Urgent** (red icon)
2. **High Priority** (orange icon)
3. **Needs Attention** (yellow icon)
4. **For Review** (blue icon)

Each group shows count badge and can be filtered independently.

## Mock Data

22 total notifications provided:
- 12 alerts covering all types
- 10 requests covering all types
- Mix of priorities and statuses
- Realistic metadata for each type

## Integration Steps

1. **Add to routing**: Add route for `/notifications` or `/alerts-requests`
2. **Navigation**: Add link in sidebar/menu
3. **Badge indicators**: Show unread count in navigation
4. **Real-time updates**: Integrate with WebSocket for live notifications
5. **API integration**: Replace mock data with real API calls
6. **Permissions**: Add role-based access control
7. **Notifications**: Add toast notifications for actions
8. **Detail modal**: Optional detail view modal/drawer

## Mobile Optimization

- Compact stats grid (2x2)
- Sticky header with filters
- Touch-optimized action buttons
- Responsive card layouts
- Horizontal scrolling for filters
- Bottom-safe spacing

## Accessibility

- Semantic HTML
- ARIA labels for icons
- Keyboard navigation support
- Focus management
- Color contrast compliance
- Screen reader friendly

## Future Enhancements

- Bulk actions (acknowledge multiple, approve batch)
- Push notifications
- Email/SMS digests
- Custom notification rules
- Notification templates
- History/audit log
- Export functionality
- Analytics dashboard
- Smart prioritization (ML-based)
- Automated workflows
