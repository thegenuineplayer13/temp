import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit2, Trash2 } from "lucide-react";
import { IconBadge } from "../shared/icon-badge";
import type { Employee } from "@/features/core/types/types.staff";
import type { Specialization } from "@/features/core/types/types.services";

interface StaffTableProps {
  employees: Employee[];
  specializations: Specialization[];
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export function StaffTable({ employees, specializations, onEdit, onDelete }: StaffTableProps) {
  const getSpecializationNames = (specIds: string[]) => {
    return specIds
      .map((id) => specializations.find((s) => s.id === id))
      .filter(Boolean);
  };

  return (
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
                      <div className="text-xs text-muted-foreground">{employee.email}</div>
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
                      <Button variant="ghost" size="sm" onClick={() => onEdit(employee)}>
                        <Edit2 className="h-4 w-4" />
                        <span className="ml-2 hidden sm:inline">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => onDelete(employee)}
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
  );
}
