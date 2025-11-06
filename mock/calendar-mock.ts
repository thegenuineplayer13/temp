import type { CalendarEmployee, CalendarAppointment, TimeOffEntry, WorkingHours } from "@/features/core/types/types.calendar";

export const mockCalendarEmployees: CalendarEmployee[] = [
  {
    id: "emp-1",
    name: "Sarah Johnson",
    role: "Senior Stylist",
    color: "#3b82f6",
  },
  {
    id: "emp-2",
    name: "Michael Chen",
    role: "Barber",
    color: "#8b5cf6",
  },
  {
    id: "emp-3",
    name: "Emma Davis",
    role: "Colorist",
    color: "#ec4899",
  },
  {
    id: "emp-4",
    name: "James Wilson",
    role: "Stylist",
    color: "#10b981",
  },
  {
    id: "emp-5",
    name: "Lisa Martinez",
    role: "Junior Stylist",
    color: "#f59e0b",
  },
];

// Helper to get today's date at a specific time
const getTodayAt = (hours: number, minutes: number = 0): string => {
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
};

export const mockCalendarAppointments: CalendarAppointment[] = [
  // Morning appointments
  {
    id: "apt-1",
    employeeId: "emp-1",
    clientName: "Alice Cooper",
    service: "Haircut & Style",
    startTime: getTodayAt(9, 0),
    endTime: getTodayAt(10, 0),
    duration: 60,
    status: "completed",
  },
  {
    id: "apt-2",
    employeeId: "emp-2",
    clientName: "Bob Smith",
    service: "Beard Trim",
    startTime: getTodayAt(9, 30),
    endTime: getTodayAt(10, 0),
    duration: 30,
    status: "completed",
  },
  {
    id: "apt-3",
    employeeId: "emp-3",
    clientName: "Carol White",
    service: "Full Color",
    startTime: getTodayAt(9, 0),
    endTime: getTodayAt(11, 30),
    duration: 150,
    status: "in-progress",
  },
  // Late morning
  {
    id: "apt-4",
    employeeId: "emp-1",
    clientName: "David Brown",
    service: "Haircut",
    startTime: getTodayAt(10, 30),
    endTime: getTodayAt(11, 15),
    duration: 45,
    status: "in-progress",
  },
  {
    id: "apt-5",
    employeeId: "emp-2",
    clientName: "Eva Green",
    service: "Haircut & Beard",
    startTime: getTodayAt(10, 30),
    endTime: getTodayAt(11, 45),
    duration: 75,
    status: "confirmed",
  },
  {
    id: "apt-6",
    employeeId: "emp-4",
    clientName: "Frank Miller",
    service: "Haircut",
    startTime: getTodayAt(10, 0),
    endTime: getTodayAt(10, 45),
    duration: 45,
    status: "completed",
  },
  // Midday
  {
    id: "apt-7",
    employeeId: "emp-1",
    clientName: "Grace Lee",
    service: "Style & Blowout",
    startTime: getTodayAt(11, 30),
    endTime: getTodayAt(12, 30),
    duration: 60,
    status: "confirmed",
  },
  {
    id: "apt-8",
    employeeId: "emp-4",
    clientName: "Henry Taylor",
    service: "Haircut",
    startTime: getTodayAt(11, 15),
    endTime: getTodayAt(12, 0),
    duration: 45,
    status: "confirmed",
  },
  {
    id: "apt-9",
    employeeId: "emp-5",
    clientName: "Iris King",
    service: "Haircut & Style",
    startTime: getTodayAt(10, 0),
    endTime: getTodayAt(11, 0),
    duration: 60,
    status: "completed",
  },
  // Afternoon
  {
    id: "apt-10",
    employeeId: "emp-2",
    clientName: "Jack Wilson",
    service: "Haircut",
    startTime: getTodayAt(12, 0),
    endTime: getTodayAt(12, 45),
    duration: 45,
    status: "confirmed",
  },
  {
    id: "apt-11",
    employeeId: "emp-3",
    clientName: "Kate Johnson",
    service: "Highlights",
    startTime: getTodayAt(12, 0),
    endTime: getTodayAt(14, 0),
    duration: 120,
    status: "confirmed",
  },
  {
    id: "apt-12",
    employeeId: "emp-5",
    clientName: "Liam Davis",
    service: "Haircut",
    startTime: getTodayAt(11, 30),
    endTime: getTodayAt(12, 15),
    duration: 45,
    status: "confirmed",
  },
  {
    id: "apt-13",
    employeeId: "emp-1",
    clientName: "Mia Anderson",
    service: "Haircut & Style",
    startTime: getTodayAt(13, 0),
    endTime: getTodayAt(14, 0),
    duration: 60,
    status: "confirmed",
  },
  {
    id: "apt-14",
    employeeId: "emp-4",
    clientName: "Noah Brown",
    service: "Haircut",
    startTime: getTodayAt(12, 30),
    endTime: getTodayAt(13, 15),
    duration: 45,
    status: "confirmed",
  },
];

export const mockTimeOffEntries: TimeOffEntry[] = [];

export const mockWorkingHours: WorkingHours[] = [
  // Sarah Johnson - Mon to Fri, 9am-6pm
  { employeeId: "emp-1", dayOfWeek: 1, startTime: "09:00", endTime: "18:00", isWorkingDay: true },
  { employeeId: "emp-1", dayOfWeek: 2, startTime: "09:00", endTime: "18:00", isWorkingDay: true },
  { employeeId: "emp-1", dayOfWeek: 3, startTime: "09:00", endTime: "18:00", isWorkingDay: true },
  { employeeId: "emp-1", dayOfWeek: 4, startTime: "09:00", endTime: "18:00", isWorkingDay: true },
  { employeeId: "emp-1", dayOfWeek: 5, startTime: "09:00", endTime: "18:00", isWorkingDay: true },
  { employeeId: "emp-1", dayOfWeek: 0, startTime: "00:00", endTime: "00:00", isWorkingDay: false },
  { employeeId: "emp-1", dayOfWeek: 6, startTime: "00:00", endTime: "00:00", isWorkingDay: false },

  // Michael Chen - Mon to Sat, 9am-6pm
  { employeeId: "emp-2", dayOfWeek: 1, startTime: "09:00", endTime: "18:00", isWorkingDay: true },
  { employeeId: "emp-2", dayOfWeek: 2, startTime: "09:00", endTime: "18:00", isWorkingDay: true },
  { employeeId: "emp-2", dayOfWeek: 3, startTime: "09:00", endTime: "18:00", isWorkingDay: true },
  { employeeId: "emp-2", dayOfWeek: 4, startTime: "09:00", endTime: "18:00", isWorkingDay: true },
  { employeeId: "emp-2", dayOfWeek: 5, startTime: "09:00", endTime: "18:00", isWorkingDay: true },
  { employeeId: "emp-2", dayOfWeek: 6, startTime: "09:00", endTime: "15:00", isWorkingDay: true },
  { employeeId: "emp-2", dayOfWeek: 0, startTime: "00:00", endTime: "00:00", isWorkingDay: false },

  // Emma Davis - Tue to Sat, 9am-6pm
  { employeeId: "emp-3", dayOfWeek: 2, startTime: "09:00", endTime: "18:00", isWorkingDay: true },
  { employeeId: "emp-3", dayOfWeek: 3, startTime: "09:00", endTime: "18:00", isWorkingDay: true },
  { employeeId: "emp-3", dayOfWeek: 4, startTime: "09:00", endTime: "18:00", isWorkingDay: true },
  { employeeId: "emp-3", dayOfWeek: 5, startTime: "09:00", endTime: "18:00", isWorkingDay: true },
  { employeeId: "emp-3", dayOfWeek: 6, startTime: "09:00", endTime: "18:00", isWorkingDay: true },
  { employeeId: "emp-3", dayOfWeek: 0, startTime: "00:00", endTime: "00:00", isWorkingDay: false },
  { employeeId: "emp-3", dayOfWeek: 1, startTime: "00:00", endTime: "00:00", isWorkingDay: false },

  // James Wilson - Mon to Fri, 10am-7pm
  { employeeId: "emp-4", dayOfWeek: 1, startTime: "10:00", endTime: "19:00", isWorkingDay: true },
  { employeeId: "emp-4", dayOfWeek: 2, startTime: "10:00", endTime: "19:00", isWorkingDay: true },
  { employeeId: "emp-4", dayOfWeek: 3, startTime: "10:00", endTime: "19:00", isWorkingDay: true },
  { employeeId: "emp-4", dayOfWeek: 4, startTime: "10:00", endTime: "19:00", isWorkingDay: true },
  { employeeId: "emp-4", dayOfWeek: 5, startTime: "10:00", endTime: "19:00", isWorkingDay: true },
  { employeeId: "emp-4", dayOfWeek: 0, startTime: "00:00", endTime: "00:00", isWorkingDay: false },
  { employeeId: "emp-4", dayOfWeek: 6, startTime: "00:00", endTime: "00:00", isWorkingDay: false },

  // Lisa Martinez - Wed to Sun, 10am-6pm
  { employeeId: "emp-5", dayOfWeek: 3, startTime: "10:00", endTime: "18:00", isWorkingDay: true },
  { employeeId: "emp-5", dayOfWeek: 4, startTime: "10:00", endTime: "18:00", isWorkingDay: true },
  { employeeId: "emp-5", dayOfWeek: 5, startTime: "10:00", endTime: "18:00", isWorkingDay: true },
  { employeeId: "emp-5", dayOfWeek: 6, startTime: "10:00", endTime: "18:00", isWorkingDay: true },
  { employeeId: "emp-5", dayOfWeek: 0, startTime: "10:00", endTime: "16:00", isWorkingDay: true },
  { employeeId: "emp-5", dayOfWeek: 1, startTime: "00:00", endTime: "00:00", isWorkingDay: false },
  { employeeId: "emp-5", dayOfWeek: 2, startTime: "00:00", endTime: "00:00", isWorkingDay: false },

  // David Wilson - Mon to Fri, 9am-6pm (Manager)
  { employeeId: "emp-6", dayOfWeek: 1, startTime: "09:00", endTime: "18:00", isWorkingDay: true },
  { employeeId: "emp-6", dayOfWeek: 2, startTime: "09:00", endTime: "18:00", isWorkingDay: true },
  { employeeId: "emp-6", dayOfWeek: 3, startTime: "09:00", endTime: "18:00", isWorkingDay: true },
  { employeeId: "emp-6", dayOfWeek: 4, startTime: "09:00", endTime: "18:00", isWorkingDay: true },
  { employeeId: "emp-6", dayOfWeek: 5, startTime: "09:00", endTime: "18:00", isWorkingDay: true },
  { employeeId: "emp-6", dayOfWeek: 0, startTime: "00:00", endTime: "00:00", isWorkingDay: false },
  { employeeId: "emp-6", dayOfWeek: 6, startTime: "00:00", endTime: "00:00", isWorkingDay: false },
];
