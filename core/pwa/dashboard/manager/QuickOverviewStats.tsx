import { Users, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickOverviewStatsProps {
  totalStaff: number;
  workingStaff: number;
  totalAlerts: number;
  urgentAlerts: number;
  pendingApprovals: number;
}

export function QuickOverviewStats({
  totalStaff,
  workingStaff,
  totalAlerts,
  urgentAlerts,
  pendingApprovals,
}: QuickOverviewStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      {/* Staff Status */}
      <div className="relative group p-4 bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-all">
        <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-500" />
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
            <Users className="h-4 w-4" />
            <span>Staff</span>
          </div>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-bold tracking-tight">{workingStaff}</p>
            <span className="text-lg font-semibold text-muted-foreground mb-0.5">
              / {totalStaff}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-500" />
            <span className="text-xs text-muted-foreground">Working now</span>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="relative group p-4 bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-all">
        <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/5 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-500" />
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
            <AlertTriangle className="h-4 w-4" />
            <span>Alerts</span>
          </div>
          <div className="flex items-end gap-2">
            <p
              className={cn(
                "text-3xl font-bold tracking-tight",
                totalAlerts > 0
                  ? "text-red-600 dark:text-red-500"
                  : "text-foreground"
              )}
            >
              {totalAlerts}
            </p>
          </div>
          <div className="flex items-center gap-1">
            {urgentAlerts > 0 ? (
              <>
                <div className="h-2 w-2 rounded-full bg-red-600 dark:bg-red-500 animate-pulse" />
                <span className="text-xs text-red-600 dark:text-red-500 font-semibold">
                  {urgentAlerts} urgent
                </span>
              </>
            ) : (
              <span className="text-xs text-muted-foreground">All clear</span>
            )}
          </div>
        </div>
      </div>

      {/* Pending Approvals */}
      <div className="relative group p-4 bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-all">
        <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-500/5 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-500" />
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
            <Clock className="h-4 w-4" />
            <span>Pending</span>
          </div>
          <div className="flex items-end gap-2">
            <p
              className={cn(
                "text-3xl font-bold tracking-tight",
                pendingApprovals > 0
                  ? "text-yellow-600 dark:text-yellow-500"
                  : "text-foreground"
              )}
            >
              {pendingApprovals}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground">
              Awaiting approval
            </span>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="relative group p-4 bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-all">
        <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/5 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-500" />
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
            <CheckCircle className="h-4 w-4" />
            <span>Status</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-600 dark:bg-green-500 animate-pulse" />
            <p className="text-lg font-bold text-green-600 dark:text-green-500">
              Operational
            </p>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground">
              All systems normal
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
