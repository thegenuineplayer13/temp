"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  PlusCircle,
  Users,
  Edit2,
  Trash2,
  UserCheck,
  UserX,
  Coffee,
} from "lucide-react";
import { ResponsiveDialog } from "../components/shared/responsive-dialog";
import { IconBadge } from "../components/shared/icon-badge";
import { useEmployees } from "../hooks/queries/queries.staff";
import { useSpecializations } from "../hooks/queries/queries.services";
import { employeeFormSchema } from "../schemas/schemas.staff";
import type { Employee, EmployeeForm } from "../types/types.staff";

export default function StaffPage() {
  const { data: employees = [], isLoading: loadingEmployees } = useEmployees();
  const { data: specializations = [], isLoading: loadingSpecs } = useSpecializations();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

  const form = useForm<EmployeeForm>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: "employee",
      status: "active",
      specializationIds: [],
      hireDate: new Date().toISOString().split("T")[0],
      avatar: "",
      salary: undefined,
      notes: "",
    },
  });

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    form.reset({
      name: "",
      email: "",
      phone: "",
      role: "employee",
      status: "active",
      specializationIds: [],
      hireDate: new Date().toISOString().split("T")[0],
      avatar: "",
      salary: undefined,
      notes: "",
    });
    setIsDialogOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    form.reset({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      role: employee.role,
      status: employee.status,
      specializationIds: employee.specializationIds,
      hireDate: employee.hireDate,
      avatar: employee.avatar,
      salary: employee.salary,
      notes: employee.notes,
    });
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
    setIsDialogOpen(false);
    setSelectedEmployee(null);
  };

  const handleConfirmDelete = () => {
    if (employeeToDelete) {
      console.log("Delete employee:", employeeToDelete.id);
    }
    setIsDeleteDialogOpen(false);
    setEmployeeToDelete(null);
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

  // Get specialization name by ID
  const getSpecializationNames = (specIds: string[]) => {
    return specIds
      .map((id) => specializations.find((s) => s.id === id))
      .filter(Boolean);
  };

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
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              Total Employees
            </CardDescription>
            <CardTitle className="text-3xl">{employees.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-1">
              <UserCheck className="h-3 w-3" />
              Active
            </CardDescription>
            <CardTitle className="text-3xl">{activeEmployees}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-1">
              <Coffee className="h-3 w-3" />
              On Leave
            </CardDescription>
            <CardTitle className="text-3xl">{onLeaveEmployees}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-1">
              <UserX className="h-3 w-3" />
              Inactive
            </CardDescription>
            <CardTitle className="text-3xl">{inactiveEmployees}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Employee Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Employees</CardTitle>
          <CardDescription>
            A comprehensive list of all employees with their roles and specializations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Contact</TableHead>
                  <TableHead className="hidden lg:table-cell">Role</TableHead>
                  <TableHead>Specializations</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No employees found
                    </TableCell>
                  </TableRow>
                ) : (
                  employees.map((employee) => {
                    const empSpecs = getSpecializationNames(employee.specializationIds);
                    return (
                      <TableRow key={employee.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div>{employee.name}</div>
                            <div className="text-xs text-muted-foreground md:hidden">
                              {employee.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="text-sm">
                            <div>{employee.phone}</div>
                            <div className="text-xs text-muted-foreground">
                              {employee.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <Badge variant="outline" className="capitalize">
                            {employee.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {empSpecs.length > 0 ? (
                              empSpecs.map((spec) => (
                                <div
                                  key={spec.id}
                                  className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-accent text-xs"
                                >
                                  <IconBadge icon={spec.icon} color={spec.color} size="sm" />
                                  <span>{spec.name}</span>
                                </div>
                              ))
                            ) : (
                              <span className="text-xs text-muted-foreground">None</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              employee.status === "active"
                                ? "default"
                                : employee.status === "on-leave"
                                ? "secondary"
                                : "outline"
                            }
                            className="capitalize"
                          >
                            {employee.status === "on-leave" ? "On Leave" : employee.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditEmployee(employee)}
                            >
                              <Edit2 className="h-4 w-4" />
                              <span className="ml-2 hidden sm:inline">Edit</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive"
                              onClick={() => handleDeleteEmployee(employee)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="ml-2 hidden sm:inline">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Employee Dialog */}
      <ResponsiveDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={selectedEmployee ? "Edit Employee" : "Add New Employee"}
        description={
          selectedEmployee
            ? "Update employee information and specialization details."
            : "Fill in the employee details to add them to your team."
        }
        className="sm:max-w-2xl"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false);
                setSelectedEmployee(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={form.handleSubmit(handleSubmit)}>
              {selectedEmployee ? "Update Employee" : "Add Employee"}
            </Button>
          </>
        }
      >
        <form className="space-y-6 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                {...form.register("name")}
                placeholder="John Doe"
              />
              {form.formState.errors.name && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...form.register("email")}
                placeholder="john@example.com"
              />
              {form.formState.errors.email && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                {...form.register("phone")}
                placeholder="+1 (555) 123-4567"
              />
              {form.formState.errors.phone && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.phone.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select
                value={form.watch("role")}
                onValueChange={(value: any) => form.setValue("role", value)}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="owner">Owner</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="employee">Employee</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.role && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.role.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Specializations</Label>
            <div className="grid grid-cols-2 gap-3 p-4 border rounded-lg max-h-48 overflow-y-auto">
              {specializations.map((spec) => {
                const isChecked = form.watch("specializationIds")?.includes(spec.id) || false;
                return (
                  <div key={spec.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`spec-${spec.id}`}
                      checked={isChecked}
                      onCheckedChange={(checked) => {
                        const current = form.watch("specializationIds") || [];
                        if (checked) {
                          form.setValue("specializationIds", [...current, spec.id]);
                        } else {
                          form.setValue(
                            "specializationIds",
                            current.filter((id) => id !== spec.id)
                          );
                        }
                      }}
                    />
                    <label
                      htmlFor={`spec-${spec.id}`}
                      className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      <IconBadge icon={spec.icon} color={spec.color} size="sm" />
                      {spec.name}
                    </label>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              Select one or more specializations for this employee
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hireDate">Hire Date *</Label>
              <Input
                id="hireDate"
                type="date"
                {...form.register("hireDate")}
              />
              {form.formState.errors.hireDate && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.hireDate.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary">Salary ($)</Label>
              <Input
                id="salary"
                type="number"
                step="1000"
                {...form.register("salary", { valueAsNumber: true })}
                placeholder="50000"
              />
              {form.formState.errors.salary && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.salary.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={form.watch("status")}
                onValueChange={(value: any) => form.setValue("status", value)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="on-leave">On Leave</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.status && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.status.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...form.register("notes")}
              placeholder="Additional notes about this employee..."
              rows={3}
            />
          </div>
        </form>
      </ResponsiveDialog>

      {/* Delete Confirmation Dialog */}
      <ResponsiveDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Employee"
        description="Are you sure you want to delete this employee? This action cannot be undone."
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setEmployeeToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </>
        }
      >
        {employeeToDelete && (
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              You are about to delete:
            </p>
            <p className="mt-2 font-semibold">{employeeToDelete.name}</p>
            <p className="text-sm text-muted-foreground">{employeeToDelete.email}</p>
          </div>
        )}
      </ResponsiveDialog>
    </div>
  );
}
