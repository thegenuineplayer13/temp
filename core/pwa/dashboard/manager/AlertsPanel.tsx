import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  UserX,
  Clock,
  Package,
  MessageSquare,
  Calendar,
  ChevronDown,
  ChevronUp,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Alert } from "@/mock/manager-dashboard-mock";

interface AlertsPanelProps {
  alerts: Alert[];
  onResolve: (alertId: string) => void;
  onViewDetails: (alert: Alert) => void;
  isMobile: boolean;
}

export function AlertsPanel({
  alerts,
  onResolve,
  onViewDetails,
  isMobile,
}: AlertsPanelProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(
    "high"
  );

  const getAlertIcon = (type: Alert["type"]) => {
    switch (type) {
      case "no-show":
        return <UserX className="h-4 w-4" />;
      case "late":
        return <Clock className="h-4 w-4" />;
      case "inventory":
        return <Package className="h-4 w-4" />;
      case "complaint":
        return <MessageSquare className="h-4 w-4" />;
      case "schedule-conflict":
        return <Calendar className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: Alert["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-400";
      case "medium":
        return "bg-yellow-500/10 border-yellow-500/30 text-yellow-700 dark:text-yellow-400";
      case "low":
        return "bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-400";
      default:
        return "bg-muted border-border text-muted-foreground";
    }
  };

  const getPriorityBadgeVariant = (priority: Alert["priority"]) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "outline";
      case "low":
        return "secondary";
      default:
        return "outline";
    }
  };

  const unresolvedAlerts = alerts.filter((alert) => !alert.resolved);
  const highPriorityAlerts = unresolvedAlerts.filter(
    (alert) => alert.priority === "high"
  );
  const mediumPriorityAlerts = unresolvedAlerts.filter(
    (alert) => alert.priority === "medium"
  );
  const lowPriorityAlerts = unresolvedAlerts.filter(
    (alert) => alert.priority === "low"
  );

  const categories = [
    {
      id: "high",
      name: "Urgent Items",
      alerts: highPriorityAlerts,
      icon: <AlertTriangle className="h-4 w-4" />,
      color: "text-red-600 dark:text-red-500",
    },
    {
      id: "medium",
      name: "Needs Attention",
      alerts: mediumPriorityAlerts,
      icon: <Clock className="h-4 w-4" />,
      color: "text-yellow-600 dark:text-yellow-500",
    },
    {
      id: "low",
      name: "For Review",
      alerts: lowPriorityAlerts,
      icon: <MessageSquare className="h-4 w-4" />,
      color: "text-blue-600 dark:text-blue-500",
    },
  ];

  if (isMobile) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-500" />
              Active Alerts
            </CardTitle>
            <Badge
              variant={
                unresolvedAlerts.length > 0 ? "destructive" : "secondary"
              }
            >
              {unresolvedAlerts.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {unresolvedAlerts.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <Check className="h-8 w-8 mx-auto mb-2 text-green-600 dark:text-green-500" />
              <p className="text-sm font-medium">All Clear!</p>
              <p className="text-xs mt-1">No active alerts</p>
            </div>
          ) : (
            categories.map(
              (category) =>
                category.alerts.length > 0 && (
                  <div key={category.id} className="space-y-2">
                    <button
                      onClick={() =>
                        setExpandedCategory(
                          expandedCategory === category.id ? null : category.id
                        )
                      }
                      className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <div className={category.color}>{category.icon}</div>
                        <span className="text-sm font-semibold">
                          {category.name}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {category.alerts.length}
                        </Badge>
                      </div>
                      {expandedCategory === category.id ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>

                    {expandedCategory === category.id && (
                      <div className="space-y-2 pl-2">
                        {category.alerts.map((alert) => (
                          <div
                            key={alert.id}
                            className={cn(
                              "p-3 rounded-lg border cursor-pointer hover:shadow-sm transition-all",
                              getPriorityColor(alert.priority)
                            )}
                            onClick={() => onViewDetails(alert)}
                          >
                            <div className="flex items-start gap-2">
                              <div className="flex-shrink-0 mt-0.5">
                                {getAlertIcon(alert.type)}
                              </div>
                              <div className="flex-1 min-w-0 space-y-1">
                                <p className="text-sm font-semibold leading-tight">
                                  {alert.title}
                                </p>
                                <p className="text-xs leading-relaxed">
                                  {alert.description}
                                </p>
                                <p className="text-xs opacity-75">
                                  {alert.timestamp}
                                </p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full mt-2 h-7 text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                onResolve(alert.id);
                              }}
                            >
                              <Check className="h-3 w-3 mr-1" />
                              Resolve
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
            )
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-500" />
            Active Alerts
          </CardTitle>
          <Badge
            variant={unresolvedAlerts.length > 0 ? "destructive" : "secondary"}
            className="font-semibold"
          >
            {unresolvedAlerts.length} Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {unresolvedAlerts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Check className="h-12 w-12 mx-auto mb-3 text-green-600 dark:text-green-500" />
            <p className="text-base font-medium">All Clear!</p>
            <p className="text-sm mt-1">No active alerts at the moment</p>
          </div>
        ) : (
          categories.map(
            (category) =>
              category.alerts.length > 0 && (
                <div key={category.id} className="space-y-3">
                  <button
                    onClick={() =>
                      setExpandedCategory(
                        expandedCategory === category.id ? null : category.id
                      )
                    }
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors border border-border"
                  >
                    <div className="flex items-center gap-3">
                      <div className={category.color}>{category.icon}</div>
                      <span className="text-sm font-semibold">
                        {category.name}
                      </span>
                      <Badge variant="outline">{category.alerts.length}</Badge>
                    </div>
                    {expandedCategory === category.id ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>

                  {expandedCategory === category.id && (
                    <div className="space-y-3 pl-4">
                      {category.alerts.map((alert) => (
                        <div
                          key={alert.id}
                          className={cn(
                            "p-4 rounded-lg border cursor-pointer hover:shadow-md transition-all group",
                            getPriorityColor(alert.priority)
                          )}
                          onClick={() => onViewDetails(alert)}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              <div className="flex-shrink-0 mt-1">
                                {getAlertIcon(alert.type)}
                              </div>
                              <div className="flex-1 min-w-0 space-y-2">
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-semibold">
                                    {alert.title}
                                  </p>
                                  <Badge
                                    variant={getPriorityBadgeVariant(
                                      alert.priority
                                    )}
                                    className="text-xs"
                                  >
                                    {alert.priority}
                                  </Badge>
                                </div>
                                <p className="text-sm leading-relaxed">
                                  {alert.description}
                                </p>
                                <p className="text-xs opacity-75">
                                  {alert.timestamp}
                                </p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                onResolve(alert.id);
                              }}
                              className="flex-shrink-0"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Resolve
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
          )
        )}
      </CardContent>
    </Card>
  );
}
