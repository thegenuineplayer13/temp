import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ResponsiveDialog } from "../shared/responsive-dialog";
import { IconBadge, ICON_MAP, getColorClass } from "../shared/icon-badge";
import { specializationFormSchema } from "@/features/core/schemas/schemas.services";
import type { Specialization, SpecializationForm, IconName, Color } from "@/features/core/types/types.services";

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

interface SpecializationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  specialization: Specialization | null;
  onSubmit: (data: SpecializationForm) => void;
}

export function SpecializationFormDialog({
  open,
  onOpenChange,
  specialization,
  onSubmit,
}: SpecializationFormDialogProps) {
  const [showIconPicker, setShowIconPicker] = useState(false);

  const form = useForm<SpecializationForm>({
    resolver: zodResolver(specializationFormSchema),
    defaultValues: {
      name: "",
      icon: "Circle",
      color: "blue",
    },
  });

  useEffect(() => {
    if (specialization) {
      form.reset({
        name: specialization.name,
        icon: specialization.icon,
        color: specialization.color,
      });
    } else if (open) {
      form.reset({
        name: "",
        icon: "Circle",
        color: "blue",
      });
    }
  }, [specialization, open, form]);

  const handleSubmit = (data: SpecializationForm) => {
    onSubmit(data);
    onOpenChange(false);
  };

  const selectedIcon = form.watch("icon");
  const selectedColor = form.watch("color");

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title={specialization ? "Edit Specialization" : "New Specialization"}
      description="Create a category for grouping related services"
      className="sm:max-w-lg"
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={form.handleSubmit(handleSubmit)}>
            {specialization ? "Save Changes" : "Create"}
          </Button>
        </>
      }
    >
      <form className="space-y-6 py-4">
        {/* Preview Card */}
        <Card className="bg-accent/50 border-dashed">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <IconBadge icon={selectedIcon} color={selectedColor} size="lg" />
              <div>
                <p className="text-sm text-muted-foreground">Preview</p>
                <p className="font-semibold">{form.watch("name") || "Untitled"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="spec-name">Name *</Label>
          <Input
            id="spec-name"
            {...form.register("name")}
            placeholder="e.g., Hair Styling, Beard Grooming"
            autoFocus
          />
          {form.formState.errors.name && (
            <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>
          )}
        </div>

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
                <IconBadge icon={selectedIcon} color={selectedColor} size="sm" className="mr-2" />
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
            <p className="text-xs text-muted-foreground">Choose a visual identifier</p>
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
                  <div className={cn("h-6 w-6 rounded-sm", getColorClass(colorOption.value))} />
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Pick a theme color</p>
          </div>
        </div>
      </form>
    </ResponsiveDialog>
  );
}
