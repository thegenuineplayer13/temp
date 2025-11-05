"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle, Users } from "lucide-react";
import {
  useEmployees,
  type Employee,
  type EmployeeFormData,
} from "@/mock/staff-monk";
import { DeleteEmployeeDialog } from "./staff/delete-employee-dialog";
import { EmployeeDialog } from "./staff/employee-dialog";
import { EmployeeTable } from "./staff/employee-table";

export default function EmployeesPage() {
  const {
    employees,
    isLoading,
    createEmployee,
    updateEmployee,
    deleteEmployee,
  } = useEmployees();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<
    Employee | undefined
  >(undefined);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(
    null
  );

  const handleAddEmployee = () => {
    setSelectedEmployee(undefined);
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

  const handleSubmit = (data: EmployeeFormData) => {
    if (selectedEmployee) {
      // Update existing employee
      const updated = updateEmployee(selectedEmployee.id, data);
      if (updated) {
        // toast({
        //   title: 'Employee updated',
        //   description: `${updated.name} has been updated successfully.`,
        // });
      }
    } else {
      // Create new employee
      const newEmployee = createEmployee(data);
      //   toast({
      //     title: 'Employee added',
      //     description: `${newEmployee.name} has been added to your team.`,
      //   });
    }
    setIsDialogOpen(false);
  };

  const handleConfirmDelete = () => {
    if (employeeToDelete) {
      const success = deleteEmployee(employeeToDelete.id);
      if (success) {
        // toast({
        //   title: 'Employee deleted',
        //   description: `${employeeToDelete.name} has been removed from your records.`,
        //   variant: 'destructive',
        // });
      }
    }
    setIsDeleteDialogOpen(false);
    setEmployeeToDelete(null);
  };

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

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Employees</CardDescription>
            <CardTitle className="text-3xl">{employees.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Active</CardDescription>
            <CardTitle className="text-3xl">
              {employees.filter((e) => e.status === "active").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Inactive</CardDescription>
            <CardTitle className="text-3xl">
              {employees.filter((e) => e.status === "inactive").length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Employee Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Employees</CardTitle>
          <CardDescription>
            A comprehensive list of all employees with their roles and
            specializations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmployeeTable
            employees={employees}
            onEdit={handleEditEmployee}
            onDelete={handleDeleteEmployee}
          />
        </CardContent>
      </Card>

      {/* Dialogs */}
      <EmployeeDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        employee={selectedEmployee}
        onSubmit={handleSubmit}
      />

      <DeleteEmployeeDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        employee={employeeToDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
