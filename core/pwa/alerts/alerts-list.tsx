import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Users, MessageSquare, Wrench, Package } from "lucide-react";
import type { Alert } from "@/mock/mock-alerts-data";

interface AlertsListProps {
  alerts: Alert[];
  selectedAlertId: string | null;
  onSelectAlert: (alertId: string) => void;
}

const alertIcons = {
  staff_absence: Users,
  customer_complaint: MessageSquare,
  equipment_failure: Wrench,
  inventory_low: Package,
};

const severityColors = {
  critical: "bg-destructive/10 text-destructive border-destructive/20",
  high: "bg-orange-500/10 text-orange-600 dark:text-orange-500 border-orange-500/20",
  medium:
    "bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border-yellow-500/20",
};

export function AlertsList({
  alerts,
  selectedAlertId,
  onSelectAlert,
}: AlertsListProps) {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60)
      );
      return `${diffInMinutes}m ago`;
    }
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-2 space-y-1">
        {alerts.map((alert) => {
          const Icon = alertIcons[alert.type];
          const isSelected = selectedAlertId === alert.id;

          return (
            <button
              key={alert.id}
              onClick={() => onSelectAlert(alert.id)}
              className={cn(
                "w-full text-left p-4 rounded-lg border transition-all hover:bg-accent/50",
                isSelected
                  ? "bg-accent border-primary shadow-sm"
                  : "bg-card border-border",
                alert.resolved && "opacity-60"
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "rounded-full p-2 flex-shrink-0",
                    severityColors[alert.severity]
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3
                      className={cn(
                        "font-semibold text-sm line-clamp-1",
                        alert.resolved && "line-through"
                      )}
                    >
                      {alert.title}
                    </h3>
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {formatTimestamp(alert.timestamp)}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                    {alert.message}
                  </p>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      variant={alert.resolved ? "secondary" : "default"}
                      className={cn(
                        "text-xs",
                        !alert.resolved && severityColors[alert.severity]
                      )}
                    >
                      {alert.resolved
                        ? "Resolved"
                        : alert.severity.toUpperCase()}
                    </Badge>

                    {alert.resolved && (
                      <span className="text-xs text-muted-foreground">
                        by {alert.resolvedBy}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </ScrollArea>
  );
}
