import type { Employee } from "@/features/core/types/types.staff";
import type { Service, ServiceRelationship } from "@/features/core/types/types.services";
import type { ServiceCartItem } from "@/features/core/types/types.dashboard-front-desk";
import type { Appointment } from "@/features/core/types/types.dashboard-front-desk";
import type { WorkingHours, TimeOffEntry } from "@/features/core/types/types.calendar";

/**
 * Get all service IDs that a staff member can perform based on their specializations
 */
export function getStaffServiceIds(
   employee: Employee,
   serviceRelationships: ServiceRelationship,
): string[] {
   const serviceIds: string[] = [];

   employee.specializationIds.forEach((specId) => {
      const services = serviceRelationships[specId] || [];
      serviceIds.push(...services);
   });

   // Remove duplicates
   return [...new Set(serviceIds)];
}

/**
 * Check if a staff member can perform a specific service
 */
export function canStaffPerformService(
   employee: Employee,
   serviceId: string,
   serviceRelationships: ServiceRelationship,
): boolean {
   const staffServices = getStaffServiceIds(employee, serviceRelationships);
   return staffServices.includes(serviceId);
}

/**
 * Check if a staff member can perform ALL services in the cart
 */
export function canStaffPerformAllServices(
   employee: Employee,
   serviceCart: ServiceCartItem[],
   serviceRelationships: ServiceRelationship,
): boolean {
   const staffServices = getStaffServiceIds(employee, serviceRelationships);

   return serviceCart.every((cartItem) => staffServices.includes(cartItem.serviceId));
}

/**
 * Find all active employees who can perform ALL services in the cart (for single-employee mode)
 */
export function findEmployeesForAllServices(
   employees: Employee[],
   serviceCart: ServiceCartItem[],
   serviceRelationships: ServiceRelationship,
): Employee[] {
   return employees.filter((employee) => {
      // Only consider active employees
      if (employee.status !== "active") return false;

      return canStaffPerformAllServices(employee, serviceCart, serviceRelationships);
   });
}

/**
 * Find all active employees who can perform a specific service
 */
export function findEmployeesForService(
   employees: Employee[],
   serviceId: string,
   serviceRelationships: ServiceRelationship,
): Employee[] {
   return employees.filter((employee) => {
      // Only consider active employees
      if (employee.status !== "active") return false;

      return canStaffPerformService(employee, serviceId, serviceRelationships);
   });
}

/**
 * Get the best assignment mode based on available staff
 * Returns "single" if at least one employee can do all services
 * Returns "multiple" if services require different employees
 * Returns "auto" if no employees found (shouldn't happen in production)
 */
export function suggestAssignmentMode(
   employees: Employee[],
   serviceCart: ServiceCartItem[],
   serviceRelationships: ServiceRelationship,
): "single" | "multiple" | "auto" {
   const employeesForAll = findEmployeesForAllServices(employees, serviceCart, serviceRelationships);

   if (employeesForAll.length > 0) {
      return "single"; // At least one employee can handle all services
   }

   // Check if we can assign different employees to each service
   const canAssignAll = serviceCart.every((service) => {
      const employeesForService = findEmployeesForService(employees, service.serviceId, serviceRelationships);
      return employeesForService.length > 0;
   });

   return canAssignAll ? "multiple" : "auto";
}

/**
 * Parse time string (HH:MM) to minutes since midnight
 */
export function timeToMinutes(time: string): number {
   const [hours, minutes] = time.split(":").map(Number);
   return hours * 60 + minutes;
}

/**
 * Convert minutes since midnight to time string (HH:MM)
 */
export function minutesToTime(minutes: number): string {
   const hours = Math.floor(minutes / 60);
   const mins = minutes % 60;
   return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
}

/**
 * Add minutes to a time string
 */
export function addMinutesToTime(time: string, minutesToAdd: number): string {
   const totalMinutes = timeToMinutes(time) + minutesToAdd;
   return minutesToTime(totalMinutes);
}

/**
 * Check if an employee is working on a specific date
 */
export function isEmployeeWorkingOnDate(
   employeeId: string,
   date: Date,
   workingHours: WorkingHours[],
   timeOffEntries: TimeOffEntry[],
): boolean {
   const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday

   // Check if employee has time off on this date
   const dateStr = date.toISOString().split("T")[0];
   const hasTimeOff = timeOffEntries.some((timeOff) => {
      if (timeOff.employeeId !== employeeId) return false;
      return dateStr >= timeOff.startDate && dateStr <= timeOff.endDate;
   });

   if (hasTimeOff) return false;

   // Check if employee has working hours for this day
   const workingHoursForDay = workingHours.find(
      (wh) => wh.employeeId === employeeId && wh.dayOfWeek === dayOfWeek,
   );

   return workingHoursForDay?.isWorkingDay || false;
}

/**
 * Get an employee's working hours for a specific day of week
 */
export function getEmployeeWorkingHours(
   employeeId: string,
   dayOfWeek: number,
   workingHours: WorkingHours[],
): { startTime: string; endTime: string } | null {
   const wh = workingHours.find((w) => w.employeeId === employeeId && w.dayOfWeek === dayOfWeek && w.isWorkingDay);

   if (!wh) return null;

   return {
      startTime: wh.startTime,
      endTime: wh.endTime,
   };
}

/**
 * Check if a time slot is available for an employee
 */
export function isTimeSlotAvailable(
   employeeId: string,
   date: Date,
   startTime: string,
   duration: number,
   appointments: Appointment[],
   workingHours: WorkingHours[],
   timeOffEntries: TimeOffEntry[],
): boolean {
   // Check if employee is working on this date
   if (!isEmployeeWorkingOnDate(employeeId, date, workingHours, timeOffEntries)) {
      return false;
   }

   // Check if time is within working hours
   const dayOfWeek = date.getDay();
   const employeeHours = getEmployeeWorkingHours(employeeId, dayOfWeek, workingHours);

   if (!employeeHours) return false;

   const slotStart = timeToMinutes(startTime);
   const slotEnd = slotStart + duration;
   const workStart = timeToMinutes(employeeHours.startTime);
   const workEnd = timeToMinutes(employeeHours.endTime);

   if (slotStart < workStart || slotEnd > workEnd) {
      return false;
   }

   // Check if there are conflicting appointments
   const dateStr = date.toISOString().split("T")[0];

   const conflicts = appointments.filter((apt) => {
      if (apt.staffId !== employeeId) return false;

      // Check if appointment is on the same date
      const aptDate = new Date(apt.startTime).toISOString().split("T")[0];
      if (aptDate !== dateStr) return false;

      // Skip cancelled or no-show appointments
      if (apt.status === "cancelled" || apt.status === "no-show") return false;

      // Check for time overlap
      const aptStartTime = new Date(apt.startTime).toTimeString().substring(0, 5);
      const aptStart = timeToMinutes(aptStartTime);
      const aptEnd = aptStart + apt.duration;

      // Overlap if: slot starts before apt ends AND slot ends after apt starts
      return slotStart < aptEnd && slotEnd > aptStart;
   });

   return conflicts.length === 0;
}

/**
 * Generate available time slots for an employee on a specific date
 */
export function getAvailableTimeSlots(
   employeeId: string,
   date: Date,
   duration: number,
   appointments: Appointment[],
   workingHours: WorkingHours[],
   timeOffEntries: TimeOffEntry[],
   slotInterval: number = 15, // Generate slots every 15 minutes
): string[] {
   if (!isEmployeeWorkingOnDate(employeeId, date, workingHours, timeOffEntries)) {
      return [];
   }

   const dayOfWeek = date.getDay();
   const employeeHours = getEmployeeWorkingHours(employeeId, dayOfWeek, workingHours);

   if (!employeeHours) return [];

   const workStart = timeToMinutes(employeeHours.startTime);
   const workEnd = timeToMinutes(employeeHours.endTime);

   const slots: string[] = [];

   // Generate slots from work start to work end
   for (let time = workStart; time + duration <= workEnd; time += slotInterval) {
      const timeStr = minutesToTime(time);

      if (isTimeSlotAvailable(employeeId, date, timeStr, duration, appointments, workingHours, timeOffEntries)) {
         slots.push(timeStr);
      }
   }

   return slots;
}

/**
 * Get available time slots for sequential appointments (same employee)
 * Returns time slots where the employee can handle all services back-to-back
 */
export function getSequentialTimeSlots(
   employeeId: string,
   date: Date,
   serviceCart: ServiceCartItem[],
   appointments: Appointment[],
   workingHours: WorkingHours[],
   timeOffEntries: TimeOffEntry[],
   slotInterval: number = 15,
): string[] {
   const totalDuration = serviceCart.reduce((sum, service) => sum + service.duration, 0);

   return getAvailableTimeSlots(
      employeeId,
      date,
      totalDuration,
      appointments,
      workingHours,
      timeOffEntries,
      slotInterval,
   );
}

/**
 * Calculate end time for sequential appointments
 */
export function calculateSequentialEndTime(startTime: string, serviceCart: ServiceCartItem[]): string {
   const totalDuration = serviceCart.reduce((sum, service) => sum + service.duration, 0);
   return addMinutesToTime(startTime, totalDuration);
}

/**
 * Format date to ISO string for storage
 */
export function formatDateForStorage(date: Date): string {
   return date.toISOString();
}

/**
 * Combine date and time to ISO string
 */
export function combineDateAndTime(date: Date, time: string): string {
   const [hours, minutes] = time.split(":").map(Number);
   const combined = new Date(date);
   combined.setHours(hours, minutes, 0, 0);
   return combined.toISOString();
}

/**
 * Calculate end time as ISO string
 */
export function calculateEndTime(startTimeISO: string, duration: number): string {
   const start = new Date(startTimeISO);
   const end = new Date(start.getTime() + duration * 60 * 1000);
   return end.toISOString();
}

/**
 * Sort employees by workload (number of appointments on given date)
 * Returns employees with fewer appointments first for load balancing
 */
export function sortEmployeesByWorkload(
   employees: Employee[],
   date: Date,
   appointments: Appointment[],
): Employee[] {
   const dateStr = date.toISOString().split("T")[0];

   const employeeWorkload = employees.map((employee) => {
      const appointmentCount = appointments.filter((apt) => {
         if (apt.staffId !== employee.id) return false;
         const aptDate = new Date(apt.startTime).toISOString().split("T")[0];
         return aptDate === dateStr && apt.status !== "cancelled" && apt.status !== "no-show";
      }).length;

      return { employee, appointmentCount };
   });

   // Sort by workload (ascending)
   employeeWorkload.sort((a, b) => a.appointmentCount - b.appointmentCount);

   return employeeWorkload.map((item) => item.employee);
}
