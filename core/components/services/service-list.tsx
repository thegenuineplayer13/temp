import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconBadge } from "../shared/icon-badge";
import type { Service } from "@/features/core/types/types.services";

interface ServiceListProps {
  services: Service[];
  selectedSpecializationId: string | null;
  isServiceLinked: (serviceId: string) => boolean;
  isServiceHighlighted: (serviceId: string) => boolean;
  onToggleLink: (serviceId: string) => void;
  onHoverService: (serviceId: string | null) => void;
  onAddService: () => void;
  onEditService: (service: Service) => void;
  onDeleteService: (service: Service) => void;
}

export function ServiceList({
  services,
  selectedSpecializationId,
  isServiceLinked,
  isServiceHighlighted,
  onToggleLink,
  onHoverService,
  onAddService,
  onEditService,
  onDeleteService,
}: ServiceListProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Services</CardTitle>
          <Button onClick={onAddService} size="sm" variant="outline">
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Add
          </Button>
        </div>
        <CardDescription>Manage available services</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-1.5">
          {services.map((service) => {
            const isLinked = isServiceLinked(service.id);
            const isHighlighted = isServiceHighlighted(service.id);
            const isGrayedOut = selectedSpecializationId && !isLinked;
            const canToggle = selectedSpecializationId !== null;

            return (
              <div
                key={service.id}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition-all",
                  canToggle && "cursor-pointer",
                  isLinked
                    ? "bg-accent border-foreground/20 shadow-sm"
                    : isHighlighted
                    ? "bg-accent/50 border-accent-foreground/10"
                    : isGrayedOut
                    ? "opacity-40 hover:opacity-70 border-transparent"
                    : "hover:bg-accent/50 border-transparent"
                )}
                onClick={() => canToggle && onToggleLink(service.id)}
                onMouseEnter={() => onHoverService(service.id)}
                onMouseLeave={() => onHoverService(null)}
              >
                <IconBadge icon={service.icon} color={service.color} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium leading-none">{service.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    ${service.price.toFixed(2)}
                    {service.duration && ` • ${service.duration}min`}
                  </p>
                </div>
                <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditService(service);
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
                      onDeleteService(service);
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
