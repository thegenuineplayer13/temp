import { Button } from "@/components/ui/button";
import { ResponsiveDialog } from "../shared/responsive-dialog";
import type { Client } from "@/features/core/types/types.clients";

interface ClientsDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client | null;
  onConfirm: () => void;
}

export function ClientsDeleteDialog({
  open,
  onOpenChange,
  client,
  onConfirm,
}: ClientsDeleteDialogProps) {
  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete Client"
      description="Are you sure you want to delete this client? This action cannot be undone and will remove all visit history."
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
      {client && (
        <div className="py-4">
          <p className="text-sm text-muted-foreground">You are about to delete:</p>
          <p className="mt-2 font-semibold">{client.name}</p>
          <p className="text-sm text-muted-foreground">{client.phone}</p>
          {client.totalVisits > 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              This client has {client.totalVisits} visit(s) on record
            </p>
          )}
        </div>
      )}
    </ResponsiveDialog>
  );
}
