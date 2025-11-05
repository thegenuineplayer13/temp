import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ResponsiveDialog } from "../shared/responsive-dialog";
import { IconBadge } from "../shared/icon-badge";
import { employeeFormSchema } from "@/features/core/schemas/schemas.staff";
import type { Employee, EmployeeForm } from "@/features/core/types/types.staff";
import type { Specialization } from "@/features/core/types/types.services";

interface StaffFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
  specializations: Specialization[];
  onSubmit: (data: EmployeeForm) => void;
}

export function StaffFormDialog({
  open,
  onOpenChange,
  employee,
  specializations,
  onSubmit,
}: StaffFormDialogProps) {
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

  useEffect(() => {
    if (employee) {
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
    } else if (open) {
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
    }
  }, [employee, open, form]);

  const handleSubmit = (data: EmployeeForm) => {
    onSubmit(data);
    onOpenChange(false);
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title={employee ? "Edit Employee" : "Add New Employee"}
      description={
        employee
          ? "Update employee information and specialization details."
          : "Fill in the employee details to add them to your team."
      }
      className="sm:max-w-2xl"
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={form.handleSubmit(handleSubmit)}>
            {employee ? "Update Employee" : "Add Employee"}
          </Button>
        </>
      }
    >
      <form className="space-y-6 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input id="name" {...form.register("name")} placeholder="John Doe" />
            {form.formState.errors.name && (
              <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>
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
              <p className="text-xs text-red-500">{form.formState.errors.email.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input id="phone" {...form.register("phone")} placeholder="+1 (555) 123-4567" />
            {form.formState.errors.phone && (
              <p className="text-xs text-red-500">{form.formState.errors.phone.message}</p>
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
              <p className="text-xs text-red-500">{form.formState.errors.role.message}</p>
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
            <Input id="hireDate" type="date" {...form.register("hireDate")} />
            {form.formState.errors.hireDate && (
              <p className="text-xs text-red-500">{form.formState.errors.hireDate.message}</p>
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
              <p className="text-xs text-red-500">{form.formState.errors.salary.message}</p>
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
              <p className="text-xs text-red-500">{form.formState.errors.status.message}</p>
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
  );
}
