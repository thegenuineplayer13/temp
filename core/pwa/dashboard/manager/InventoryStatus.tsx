import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, AlertTriangle, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import type { InventoryItem } from "@/mock/manager-dashboard-mock";

interface InventoryStatusProps {
  items: InventoryItem[];
  onReorder: (itemId: string) => void;
  isMobile: boolean;
}

export function InventoryStatus({
  items,
  onReorder,
  isMobile,
}: InventoryStatusProps) {
  const criticalItems = items.filter(
    (item) => item.status === "critical" || item.status === "low"
  );

  const getStatusColor = (status: InventoryItem["status"]) => {
    switch (status) {
      case "critical":
        return "bg-red-500/10 border-red-500 text-red-700 dark:text-red-400";
      case "low":
        return "bg-yellow-500/10 border-yellow-500 text-yellow-700 dark:text-yellow-400";
      default:
        return "bg-muted border-border text-foreground";
    }
  };

  const getStockPercentage = (item: InventoryItem) => {
    return Math.min((item.currentStock / item.minThreshold) * 100, 100);
  };

  if (isMobile) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Package className="h-4 w-4 text-red-600 dark:text-red-500" />
              Inventory Alerts
            </CardTitle>
            <Badge
              variant={criticalItems.length > 0 ? "destructive" : "secondary"}
            >
              {criticalItems.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {criticalItems.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <Package className="h-8 w-8 mx-auto mb-2 text-green-600 dark:text-green-500" />
              <p className="text-sm font-medium">Stock Levels Good</p>
              <p className="text-xs mt-1">No critical items</p>
            </div>
          ) : (
            criticalItems.map((item) => {
              const percentage = getStockPercentage(item);

              return (
                <div
                  key={item.id}
                  className={cn(
                    "p-3 rounded-lg border",
                    getStatusColor(item.status)
                  )}
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                          <p className="text-sm font-semibold leading-tight truncate">
                            {item.name}
                          </p>
                        </div>
                        <p className="text-xs mt-1 opacity-75">
                          {item.category}
                        </p>
                      </div>
                      <Badge
                        variant={
                          item.status === "critical" ? "destructive" : "outline"
                        }
                        className="text-xs flex-shrink-0"
                      >
                        {item.status}
                      </Badge>
                    </div>

                    {/* Stock Level */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium">Current Stock</span>
                        <span className="font-bold">
                          {item.currentStock} / {item.minThreshold} {item.unit}
                        </span>
                      </div>
                      <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all",
                            item.status === "critical"
                              ? "bg-red-600 dark:bg-red-500"
                              : "bg-yellow-600 dark:bg-yellow-500"
                          )}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Action */}
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full h-8 text-xs"
                      onClick={() => onReorder(item.id)}
                    >
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      Quick Reorder
                    </Button>
                  </div>
                </div>
              );
            })
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
            <Package className="h-5 w-5 text-red-600 dark:text-red-500" />
            Critical Inventory
          </CardTitle>
          <Badge
            variant={criticalItems.length > 0 ? "destructive" : "secondary"}
            className="font-semibold"
          >
            {criticalItems.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {criticalItems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-3 text-green-600 dark:text-green-500" />
            <p className="text-base font-medium">Stock Levels Good</p>
            <p className="text-sm mt-1">All items adequately stocked</p>
          </div>
        ) : (
          criticalItems.map((item) => {
            const percentage = getStockPercentage(item);

            return (
              <div
                key={item.id}
                className={cn(
                  "p-4 rounded-lg border hover:shadow-md transition-all",
                  getStatusColor(item.status)
                )}
              >
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-semibold truncate">
                          {item.name}
                        </p>
                        <p className="text-sm mt-1 opacity-75">
                          {item.category}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        item.status === "critical" ? "destructive" : "outline"
                      }
                      className="flex-shrink-0"
                    >
                      {item.status}
                    </Badge>
                  </div>

                  {/* Stock Level */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Current Stock</span>
                      <span className="font-bold">
                        {item.currentStock} / {item.minThreshold} {item.unit}
                      </span>
                    </div>
                    <div className="h-3 bg-muted/50 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          item.status === "critical"
                            ? "bg-red-600 dark:bg-red-500"
                            : "bg-yellow-600 dark:bg-yellow-500"
                        )}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Action */}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onReorder(item.id)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-1.5" />
                    Quick Reorder
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
