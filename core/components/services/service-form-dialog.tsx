import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ResponsiveDialog } from "../shared/responsive-dialog";
import { IconBadge, ICON_MAP, getColorClass } from "../shared/icon-badge";
import { serviceFormSchema } from "@/features/core/schemas/schemas.services";
import type { Service, ServiceForm, IconName, Color } from "@/features/core/types/types.services";

const COLOR_OPTIONS: Array<{ value: Color; name: string }> = [
  { value: "blue", name: "Blue" },
  { value: "green", name: "Green" },
  { value: "purple", name: "Purple" },
  { value: "orange", name: "Orange" },
  { value: "pink", name: "Pink" },
  { value: "red", name: "Red" },
  { value: "yellow", name: "Yellow" },
  { value: "indigo", name: "Indigo" },
  { value: "teal", name: "Teal" },
  { value: "cyan", name: "Cyan" },
];

interface ServiceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: Service | null;
  onSubmit: (data: ServiceForm) => void;
}

export function ServiceFormDialog({
  open,
  onOpenChange,
  service,
  onSubmit,
}: ServiceFormDialogProps) {
  const [showIconPicker, setShowIconPicker] = useState(false);

  const form = useForm<ServiceForm>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      name: "",
      price: 0,
      duration: 30,
      icon: "Circle",
      color: "blue",
      description: "",
    },
  });

  useEffect(() => {
    if (service) {
      form.reset({
        name: service.name,
        price: service.price,
        duration: service.duration,
        icon: service.icon,
        color: service.color,
        description: service.description,
      });
    } else if (open) {
      form.reset({
        name: "",
        price: 0,
        duration: 30,
        icon: "Circle",
        color: "blue",
        description: "",
      });
    }
  }, [service, open, form]);

  const handleSubmit = (data: ServiceForm) => {
    onSubmit(data);
    onOpenChange(false);
  };

  const selectedIcon = form.watch("icon");
  const selectedColor = form.watch("color");
  const price = form.watch("price");
  const duration = form.watch("duration");

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title={service ? "Edit Service" : "New Service"}
      description="Define a service that can be offered to clients"
      className="sm:max-w-2xl"
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={form.handleSubmit(handleSubmit)}>
            {service ? "Save Changes" : "Create"}
          </Button>
        </>
      }
    >
      <form className="space-y-6 py-4">
        {/* Preview Card */}
        <Card className="bg-accent/50 border-dashed">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <IconBadge icon={selectedIcon} color={selectedColor} size="lg" />
                <div>
                  <p className="font-semibold">{form.watch("name") || "Untitled Service"}</p>
                  <p className="text-sm text-muted-foreground">
                    ${price?.toFixed(2) || "0.00"}
                    {duration ? ` • ${duration} min` : ""}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Preview</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Details */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="service-name">Service Name *</Label>
            <Input
              id="service-name"
              {...form.register("name")}
              placeholder="e.g., Haircut, Beard Trim, Manicure"
              autoFocus
            />
            {form.formState.errors.name && (
              <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="service-price">Price ($) *</Label>
              <Input
                id="service-price"
                type="number"
                step="0.01"
                {...form.register("price", { valueAsNumber: true })}
                placeholder="25.00"
              />
              {form.formState.errors.price && (
                <p className="text-xs text-red-500">{form.formState.errors.price.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="service-duration">Duration (minutes)</Label>
              <Input
                id="service-duration"
                type="number"
                {...form.register("duration", { valueAsNumber: true })}
                placeholder="30"
              />
              {form.formState.errors.duration && (
                <p className="text-xs text-red-500">{form.formState.errors.duration.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="service-description">Description (optional)</Label>
            <Textarea
              id="service-description"
              {...form.register("description")}
              placeholder="Brief description of the service..."
              rows={2}
            />
          </div>
        </div>

        {/* Visual Customization */}
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-3">Visual Customization</h4>
            <div className="grid grid-cols-2 gap-4">
              {/* Icon Picker */}
              <div className="space-y-2">
                <Label>Icon</Label>
                <div className="relative">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-start h-10"
                    onClick={() => setShowIconPicker(!showIconPicker)}
                  >
                    <IconBadge
                      icon={selectedIcon}
                      color={selectedColor}
                      size="sm"
                      className="mr-2"
                    />
                    <span className="text-sm">{selectedIcon}</span>
                  </Button>
                  {showIconPicker && (
                    <Card className="absolute z-50 mt-2 w-72 border shadow-lg">
                      <CardContent className="p-3">
                        <div className="grid grid-cols-6 gap-1.5">
                          {(Object.keys(ICON_MAP) as IconName[]).map((iconName) => {
                            const Icon = ICON_MAP[iconName];
                            return (
                              <Button
                                key={iconName}
                                type="button"
                                variant={selectedIcon === iconName ? "default" : "ghost"}
                                size="icon"
                                className="h-10 w-10"
                                onClick={() => {
                                  form.setValue("icon", iconName);
                                  setShowIconPicker(false);
                                }}
                              >
                                <Icon className="h-4 w-4" />
                              </Button>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Choose an icon</p>
              </div>

              {/* Color Picker */}
              <div className="space-y-2">
                <Label>Color</Label>
                <div className="grid grid-cols-5 gap-1.5">
                  {COLOR_OPTIONS.map((colorOption) => (
                    <Button
                      key={colorOption.value}
                      type="button"
                      variant="outline"
                      size="icon"
                      className={cn(
                        "h-10 w-10 border-2 transition-all",
                        selectedColor === colorOption.value
                          ? "border-foreground ring-2 ring-offset-2 ring-foreground/20"
                          : "border-transparent hover:border-muted-foreground/30"
                      )}
                      onClick={() => form.setValue("color", colorOption.value)}
                      title={colorOption.name}
                    >
                      <div
                        className={cn("h-6 w-6 rounded-sm", getColorClass(colorOption.value))}
                      />
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">Pick a color</p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </ResponsiveDialog>
  );
}
