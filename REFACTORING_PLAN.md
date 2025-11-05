# Component Refactoring Plan

## Overview
This document outlines the complete component structure for Staff, Clients, and Services pages following the established pattern:

1. ✅ Create schemas
2. ✅ Create types
3. ✅ Create stores (where needed)
4. ✅ Create mock queries
5. 🔄 Split pages into smaller components

---

## File Structure

```
core/
├── store/
│   ├── store.services.ts          ✅ CREATED
│   └── store.clients.ts           ✅ CREATED
├── components/
│   ├── services/
│   │   ├── services-stats-cards.tsx        ✅ CREATED
│   │   ├── specialization-list.tsx         ✅ CREATED
│   │   ├── service-list.tsx                ✅ CREATED
│   │   ├── specialization-form-dialog.tsx  📝 TO CREATE
│   │   └── service-form-dialog.tsx         📝 TO CREATE
│   ├── staff/
│   │   ├── staff-stats-cards.tsx           ✅ CREATED
│   │   ├── staff-table.tsx                 📝 TO CREATE
│   │   ├── staff-form-dialog.tsx           📝 TO CREATE
│   │   └── staff-delete-dialog.tsx         📝 TO CREATE
│   └── clients/
│       ├── clients-stats-cards.tsx         ✅ CREATED
│       ├── clients-filters.tsx             📝 TO CREATE
│       ├── clients-table.tsx               📝 TO CREATE
│       ├── clients-form-dialog.tsx         📝 TO CREATE
│       ├── clients-detail-dialog.tsx       📝 TO CREATE
│       └── clients-delete-dialog.tsx       📝 TO CREATE
└── pages/
    ├── services.tsx                        📝 TO REFACTOR (use components)
    ├── staff.tsx                           📝 TO REFACTOR (use components)
    └── clients.tsx                         📝 TO REFACTOR (use components)
```

---

## Component Breakdown

### Services Page Components

#### `services-stats-cards.tsx` ✅
**Purpose**: Display statistics (Total Specializations, Total Services, Avg Price, Avg Duration)
**Props**: `totalSpecializations`, `totalServices`, `avgPrice`, `avgDuration`
**Responsibility**: Pure presentation of stats

#### `specialization-list.tsx` ✅
**Purpose**: Display list of specializations with CRUD actions
**Props**:
- `specializations`: Specialization[]
- `selectedSpecializationId`: string | null
- `hoveredSpecializationId`: string | null
- Event handlers for select, hover, add, edit, delete
**Responsibility**: Display and interaction for specializations

#### `service-list.tsx` ✅
**Purpose**: Display list of services with link toggle and CRUD actions
**Props**:
- `services`: Service[]
- `selectedSpecializationId`: string | null
- `isServiceLinked`, `isServiceHighlighted` functions
- Event handlers
**Responsibility**: Display and interaction for services

#### `specialization-form-dialog.tsx` 📝
**Purpose**: Form dialog for add/edit specialization
**Props**: `open`, `onOpenChange`, `specialization?`, `onSubmit`
**Uses**: React Hook Form + Zod, ResponsiveDialog
**Responsibility**: Form validation and submission for specializations

#### `service-form-dialog.tsx` 📝
**Purpose**: Form dialog for add/edit service
**Props**: `open`, `onOpenChange`, `service?`, `onSubmit`
**Uses**: React Hook Form + Zod, ResponsiveDialog
**Responsibility**: Form validation and submission for services

---

### Staff Page Components

#### `staff-stats-cards.tsx` ✅
**Purpose**: Display employee statistics
**Props**: `totalEmployees`, `activeEmployees`, `onLeaveEmployees`, `inactiveEmployees`
**Responsibility**: Pure presentation of stats

#### `staff-table.tsx` 📝
**Purpose**: Display employees in a table with actions
**Props**:
- `employees`: Employee[]
- `specializations`: Specialization[]
- `onEdit`, `onDelete` handlers
**Responsibility**: Display employees with specialization icons, provide actions

#### `staff-form-dialog.tsx` 📝
**Purpose**: Form dialog for add/edit employee
**Props**: `open`, `onOpenChange`, `employee?`, `specializations`, `onSubmit`
**Uses**: React Hook Form + Zod, ResponsiveDialog, Checkboxes for multi-select
**Responsibility**: Form validation and submission for employees

#### `staff-delete-dialog.tsx` 📝
**Purpose**: Confirmation dialog for deleting employee
**Props**: `open`, `onOpenChange`, `employee`, `onConfirm`
**Uses**: ResponsiveDialog
**Responsibility**: Confirm delete action

---

### Clients Page Components

#### `clients-stats-cards.tsx` ✅
**Purpose**: Display client statistics
**Props**: `totalClients`, `registeredClients`, `walkInClients`, `averageSpending`, `formatCurrency`
**Responsibility**: Pure presentation of stats

#### `clients-filters.tsx` 📝
**Purpose**: Search and filter controls
**Props**: `searchQuery`, `filterType`, `onSearchChange`, `onFilterChange`
**Uses**: Store (useClientsStore)
**Responsibility**: Filter and search UI

#### `clients-table.tsx` 📝
**Purpose**: Display clients in a table with pagination and actions
**Props**:
- `clients`: Client[]
- `services`: Service[]
- `currentPage`, `itemsPerPage`, `totalPages`
- Event handlers for view, edit, delete, pagination
**Responsibility**: Display clients with service icons in last visit, handle pagination

#### `clients-form-dialog.tsx` 📝
**Purpose**: Form dialog for add/edit client
**Props**: `open`, `onOpenChange`, `client?`, `onSubmit`
**Uses**: React Hook Form + Zod, ResponsiveDialog
**Responsibility**: Form validation and submission for clients

#### `clients-detail-dialog.tsx` 📝
**Purpose**: View client details with visit history
**Props**: `open`, `onOpenChange`, `client`, `services`, `formatCurrency`, `formatDate`
**Responsibility**: Display comprehensive client information including visit history with service icons

#### `clients-delete-dialog.tsx` 📝
**Purpose**: Confirmation dialog for deleting client
**Props**: `open`, `onOpenChange`, `client`, `onConfirm`
**Uses**: ResponsiveDialog
**Responsibility**: Confirm delete action

---

## Refactored Page Files

### `pages/services.tsx`
**Responsibilities**:
- Use `useServicesStore` for state management
- Use `useSpecializations`, `useServices`, `useServiceRelationships` queries
- Calculate stats
- Handle business logic (toggle links, delete confirmation)
- Compose components together

**Structure**:
```tsx
export default function ServicesPage() {
  // Hooks
  const store = useServicesStore();
  const { data: specializations } = useSpecializations();
  const { data: services } = useServices();
  const { data: relationships } = useServiceRelationships();

  // Handlers
  const handleToggleLink = () => { /* logic */ };
  const handleDeleteSpecialization = () => { /* logic */ };

  // Render
  return (
    <div>
      <Header />
      <ServicesStatsCards {...stats} />
      <div className="grid lg:grid-cols-2">
        <SpecializationList {...} />
        <ServiceList {...} />
      </div>
      <SpecializationFormDialog {...} />
      <ServiceFormDialog {...} />
    </div>
  );
}
```

### `pages/staff.tsx`
**Responsibilities**:
- Use `useEmployees`, `useSpecializations` queries
- Local state for dialogs (no need for store - simpler page)
- Calculate stats
- Handle business logic
- Compose components together

**Structure**:
```tsx
export default function StaffPage() {
  // Queries
  const { data: employees } = useEmployees();
  const { data: specializations } = useSpecializations();

  // Local state
  const [dialogState, setDialogState] = useState({ /* ... */ });

  // Handlers
  const handleSubmit = () => { /* logic */ };

  // Render
  return (
    <div>
      <Header />
      <StaffStatsCards {...stats} />
      <StaffTable {...} />
      <StaffFormDialog {...} />
      <StaffDeleteDialog {...} />
    </div>
  );
}
```

### `pages/clients.tsx`
**Responsibilities**:
- Use `useClientsStore` for state management
- Use `useClients`, `useServices` queries
- Filter/search/pagination logic (uses store)
- Calculate stats
- Handle business logic
- Compose components together

**Structure**:
```tsx
export default function ClientsPage() {
  // Hooks
  const store = useClientsStore();
  const { data: clients } = useClients();
  const { data: services } = useServices();

  // Computed
  const filteredClients = useMemo(() => filterLogic, [clients, store.searchQuery]);
  const stats = useMemo(() => calculateStats, [clients]);

  // Handlers
  const handleSubmit = () => { /* logic */ };

  // Render
  return (
    <div>
      <Header />
      <ClientsStatsCards {...stats} />
      <ClientsFilters />
      <ClientsTable {...} />
      <ClientsFormDialog {...} />
      <ClientsDetailDialog {...} />
      <ClientsDeleteDialog {...} />
    </div>
  );
}
```

---

## Benefits of This Structure

1. **Separation of Concerns**: Each component has a single responsibility
2. **Reusability**: Components can be reused in other contexts
3. **Testability**: Smaller components are easier to test
4. **Maintainability**: Changes are isolated to specific components
5. **Readability**: Page files are much cleaner and easier to understand
6. **Consistency**: Follows established patterns in the codebase

---

## Next Steps

1. Create remaining component files (9 files to create)
2. Refactor the 3 page files to use components
3. Test the integration
4. Commit and push

**Estimated files to create/modify**: 12 new component files + 3 page refactors = 15 files

---

Should I proceed with creating all the components and refactoring the pages?
