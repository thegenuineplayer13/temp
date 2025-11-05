"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusCircle, Users } from "lucide-react";
import { StaffFilters } from "../components/staff/staff-filters";
import { StaffTable } from "../components/staff/staff-table";
import { StaffFormDialog } from "../components/staff/staff-form-dialog";
import { StaffDeleteDialog } from "../components/staff/staff-delete-dialog";
import { useEmployees } from "../hooks/queries/queries.staff";
import { useSpecializations } from "../hooks/queries/queries.services";
import type { Employee, EmployeeForm, EmployeeStatus } from "../types/types.staff";

export default function StaffPage() {
  const { data: employees = [], isLoading: loadingEmployees } = useEmployees();
  const { data: specializations = [], isLoading: loadingSpecs } = useSpecializations();

  const [filterStatus, setFilterStatus] = useState<EmployeeStatus | "all">("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

  // Filter employees by status
  const filteredEmployees = useMemo(() => {
    if (filterStatus === "all") return employees;
    return employees.filter((e) => e.status === filterStatus);
  }, [employees, filterStatus]);

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setIsDialogOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDialogOpen(true);
  };

  const handleDeleteEmployee = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = (data: EmployeeForm) => {
    if (selectedEmployee) {
      console.log("Update employee:", selectedEmployee.id, data);
    } else {
      console.log("Create employee:", data);
    }
  };

  const handleConfirmDelete = () => {
    if (employeeToDelete) {
      console.log("Delete employee:", employeeToDelete.id);
    }
  };

  const isLoading = loadingEmployees || loadingSpecs;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Users className="h-12 w-12 mx-auto text-muted-foreground animate-pulse" />
          <p className="text-muted-foreground">Loading employees...</p>
        </div>
      </div>
    );
  }

  // Calculate stats
  const activeEmployees = employees.filter((e) => e.status === "active").length;
  const inactiveEmployees = employees.filter((e) => e.status === "inactive").length;
  const onLeaveEmployees = employees.filter((e) => e.status === "on-leave").length;

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Employee Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your team members and their specializations
          </p>
        </div>
        <Button onClick={handleAddEmployee} size="lg">
          <PlusCircle className="mr-2 h-5 w-5" />
          Add Employee
        </Button>
      </div>

      {/* Filters */}
      <StaffFilters
        selectedStatus={filterStatus}
        onStatusChange={setFilterStatus}
        totalEmployees={employees.length}
        activeCount={activeEmployees}
        onLeaveCount={onLeaveEmployees}
        inactiveCount={inactiveEmployees}
      />

      {/* Employee Table */}
      <Card>
        <div className="p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">All Employees</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {filterStatus === "all"
                ? "A comprehensive list of all employees with their roles and specializations"
                : `Showing ${filteredEmployees.length} ${filterStatus} employee${
                    filteredEmployees.length !== 1 ? "s" : ""
                  }`}
            </p>
          </div>
          <StaffTable
            employees={filteredEmployees}
            specializations={specializations}
            onEdit={handleEditEmployee}
            onDelete={handleDeleteEmployee}
          />
        </div>
      </Card>

      {/* Employee Form Dialog */}
      <StaffFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        employee={selectedEmployee}
        specializations={specializations}
        onSubmit={handleSubmit}
      />

      {/* Delete Confirmation Dialog */}
      <StaffDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        employee={employeeToDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
