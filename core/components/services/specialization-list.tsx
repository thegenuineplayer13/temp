import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconBadge } from "../shared/icon-badge";
import type { Specialization } from "@/features/core/types/types.services";

interface SpecializationListProps {
  specializations: Specialization[];
  selectedSpecializationId: string | null;
  hoveredSpecializationId: string | null;
  getLinkedServicesCount: (specId: string) => number;
  isSpecializationHighlighted: (specId: string) => boolean;
  onSelectSpecialization: (specId: string) => void;
  onHoverSpecialization: (specId: string | null) => void;
  onAddSpecialization: () => void;
  onEditSpecialization: (spec: Specialization) => void;
  onDeleteSpecialization: (spec: Specialization) => void;
}

export function SpecializationList({
  specializations,
  selectedSpecializationId,
  hoveredSpecializationId,
  getLinkedServicesCount,
  isSpecializationHighlighted,
  onSelectSpecialization,
  onHoverSpecialization,
  onAddSpecialization,
  onEditSpecialization,
  onDeleteSpecialization,
}: SpecializationListProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Specializations</CardTitle>
          <Button onClick={onAddSpecialization} size="sm" variant="outline">
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Add
          </Button>
        </div>
        <CardDescription>Manage specialization categories</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-1.5">
          {specializations.map((spec) => {
            const isSelected = selectedSpecializationId === spec.id;
            const isHighlighted = isSpecializationHighlighted(spec.id);
            const linkedCount = getLinkedServicesCount(spec.id);

            return (
              <div
                key={spec.id}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition-all cursor-pointer",
                  isSelected
                    ? "bg-accent border-foreground/20 shadow-sm"
                    : isHighlighted
                    ? "bg-accent/50 border-accent-foreground/10"
                    : "hover:bg-accent/50 border-transparent"
                )}
                onClick={() => onSelectSpecialization(spec.id)}
                onMouseEnter={() => onHoverSpecialization(spec.id)}
                onMouseLeave={() => onHoverSpecialization(null)}
              >
                <IconBadge icon={spec.icon} color={spec.color} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium leading-none">{spec.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {linkedCount} {linkedCount === 1 ? "service" : "services"}
                  </p>
                </div>
                <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditSpecialization(spec);
                    }}
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSpecialization(spec);
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
