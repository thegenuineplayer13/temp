import { Button } from "@/components/ui/button";
import { ResponsiveDialog } from "../shared/responsive-dialog";
import type { Employee } from "@/features/core/types/types.staff";

interface StaffDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
  onConfirm: () => void;
}

export function StaffDeleteDialog({
  open,
  onOpenChange,
  employee,
  onConfirm,
}: StaffDeleteDialogProps) {
  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete Employee"
      description="Are you sure you want to delete this employee? This action cannot be undone."
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </>
      }
    >
      {employee && (
        <div className="py-4">
          <p className="text-sm text-muted-foreground">You are about to delete:</p>
          <p className="mt-2 font-semibold">{employee.name}</p>
          <p className="text-sm text-muted-foreground">{employee.email}</p>
        </div>
      )}
    </ResponsiveDialog>
  );
}
