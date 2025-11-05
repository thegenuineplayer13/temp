import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/label";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ResponsiveDialog } from "../shared/responsive-dialog";
import { clientFormSchema } from "@/features/core/schemas/schemas.clients";
import type { Client, ClientForm } from "@/features/core/types/types.clients";

interface ClientsFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client | null;
  onSubmit: (data: ClientForm) => void;
}

export function ClientsFormDialog({
  open,
  onOpenChange,
  client,
  onSubmit,
}: ClientsFormDialogProps) {
  const form = useForm<ClientForm>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      type: "registered",
      preferences: [],
      specialNotes: [],
      birthday: "",
      address: "",
    },
  });

  useEffect(() => {
    if (client) {
      form.reset({
        name: client.name,
        email: client.email || "",
        phone: client.phone,
        type: client.type,
        preferences: client.preferences,
        specialNotes: client.specialNotes,
        birthday: client.birthday || "",
        address: client.address || "",
      });
    } else if (open) {
      form.reset({
        name: "",
        email: "",
        phone: "",
        type: "registered",
        preferences: [],
        specialNotes: [],
        birthday: "",
        address: "",
      });
    }
  }, [client, open, form]);

  const handleSubmit = (data: ClientForm) => {
    onSubmit(data);
    onOpenChange(false);
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title={client ? "Edit Client" : "Add New Client"}
      description={
        client
          ? "Update client information and preferences."
          : "Fill in the client details to add them to your records."
      }
      className="sm:max-w-2xl"
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={form.handleSubmit(handleSubmit)}>
            {client ? "Update Client" : "Add Client"}
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
            <Label htmlFor="phone">Phone Number *</Label>
            <Input id="phone" {...form.register("phone")} placeholder="+1 (555) 123-4567" />
            {form.formState.errors.phone && (
              <p className="text-xs text-red-500">{form.formState.errors.phone.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
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

          <div className="space-y-2">
            <Label htmlFor="type">Client Type *</Label>
            <Select
              value={form.watch("type")}
              onValueChange={(value: any) => form.setValue("type", value)}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="registered">Registered</SelectItem>
                <SelectItem value="walk-in">Walk-in</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.type && (
              <p className="text-xs text-red-500">{form.formState.errors.type.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="birthday">Birthday</Label>
            <Input id="birthday" type="date" {...form.register("birthday")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" {...form.register("address")} placeholder="123 Main St" />
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Visit history and spending details will be tracked automatically
        </p>
      </form>
    </ResponsiveDialog>
  );
}
