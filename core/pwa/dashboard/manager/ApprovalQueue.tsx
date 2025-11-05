import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, AlertCircle, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ApprovalRequest } from "@/mock/manager-dashboard-mock";

interface ApprovalQueueProps {
  requests: ApprovalRequest[];
  onApprove: (requestId: string) => void;
  onDeny: (requestId: string) => void;
  onViewDetails: (request: ApprovalRequest) => void;
  isMobile: boolean;
}

export function ApprovalQueue({
  requests,
  onApprove,
  onDeny,
  onViewDetails,
  isMobile,
}: ApprovalQueueProps) {
  const pendingRequests = requests.filter((req) => req.status === "pending");

  const getRequestIcon = (type: ApprovalRequest["type"]) => {
    switch (type) {
      case "break":
        return <Clock className="h-4 w-4" />;
      case "day-off":
        return <Calendar className="h-4 w-4" />;
      case "schedule-change":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: ApprovalRequest["type"]) => {
    switch (type) {
      case "break":
        return "Break Request";
      case "day-off":
        return "Day Off";
      case "schedule-change":
        return "Schedule Change";
      default:
        return type;
    }
  };

  const getTypeColor = (type: ApprovalRequest["type"]) => {
    switch (type) {
      case "break":
        return "bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-400";
      case "day-off":
        return "bg-purple-500/10 border-purple-500/30 text-purple-700 dark:text-purple-400";
      case "schedule-change":
        return "bg-orange-500/10 border-orange-500/30 text-orange-700 dark:text-orange-400";
      default:
        return "bg-muted border-border text-foreground";
    }
  };

  if (isMobile) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
              Pending Approvals
            </CardTitle>
            <Badge
              variant={pendingRequests.length > 0 ? "outline" : "secondary"}
            >
              {pendingRequests.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {pendingRequests.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <Check className="h-8 w-8 mx-auto mb-2 text-green-600 dark:text-green-500" />
              <p className="text-sm font-medium">All Caught Up!</p>
              <p className="text-xs mt-1">No pending approvals</p>
            </div>
          ) : (
            pendingRequests.map((request) => (
              <div
                key={request.id}
                className={cn(
                  "p-3 rounded-lg border cursor-pointer hover:shadow-sm transition-all",
                  getTypeColor(request.type)
                )}
                onClick={() => onViewDetails(request)}
              >
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                      <div className="flex-shrink-0 mt-0.5">
                        {getRequestIcon(request.type)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold leading-tight">
                          {request.staffName}
                        </p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {getTypeLabel(request.type)}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3 w-3 flex-shrink-0" />
                      <span className="font-medium">
                        {request.requestedDate}
                        {request.requestedTime && ` • ${request.requestedTime}`}
                      </span>
                    </div>
                    {request.duration && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3 flex-shrink-0" />
                        <span>{request.duration} minutes</span>
                      </div>
                    )}
                    <p className="leading-relaxed mt-2">{request.reason}</p>
                  </div>

                  {/* Impact Warning */}
                  {request.affectedAppointments > 0 && (
                    <div className="flex items-center gap-1.5 text-xs p-2 bg-red-500/10 border border-red-500/20 rounded">
                      <AlertCircle className="h-3 w-3 text-red-600 dark:text-red-500 flex-shrink-0" />
                      <span className="text-red-700 dark:text-red-400 font-medium">
                        {request.affectedAppointments} appointments affected
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t border-current/10">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 h-8 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeny(request.id);
                      }}
                    >
                      <X className="h-3 w-3 mr-1" />
                      Deny
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 h-8 text-xs bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        onApprove(request.id);
                      }}
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Approve
                    </Button>
                  </div>

                  {/* Submitted Time */}
                  <p className="text-xs opacity-75 pt-1">
                    Submitted {request.submittedAt}
                  </p>
                </div>
              </div>
            ))
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
            <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
            Pending Approvals
          </CardTitle>
          <Badge
            variant={pendingRequests.length > 0 ? "outline" : "secondary"}
            className="font-semibold"
          >
            {pendingRequests.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {pendingRequests.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Check className="h-12 w-12 mx-auto mb-3 text-green-600 dark:text-green-500" />
            <p className="text-base font-medium">All Caught Up!</p>
            <p className="text-sm mt-1">No pending approvals</p>
          </div>
        ) : (
          pendingRequests.map((request) => (
            <div
              key={request.id}
              className={cn(
                "p-4 rounded-lg border cursor-pointer hover:shadow-md transition-all",
                getTypeColor(request.type)
              )}
              onClick={() => onViewDetails(request)}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="flex-shrink-0 mt-1">
                      {getRequestIcon(request.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-semibold">
                        {request.staffName}
                      </p>
                      <Badge variant="outline" className="text-xs mt-1.5">
                        {getTypeLabel(request.type)}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm pl-9">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 flex-shrink-0" />
                    <span className="font-medium">
                      {request.requestedDate}
                      {request.requestedTime && ` • ${request.requestedTime}`}
                    </span>
                  </div>
                  {request.duration && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 flex-shrink-0" />
                      <span>{request.duration} minutes duration</span>
                    </div>
                  )}
                  <p className="leading-relaxed mt-3">{request.reason}</p>
                </div>

                {/* Impact Warning */}
                {request.affectedAppointments > 0 && (
                  <div className="flex items-center gap-2 text-sm p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-500 flex-shrink-0" />
                    <span className="text-red-700 dark:text-red-400 font-medium">
                      {request.affectedAppointments} appointments will be
                      affected
                    </span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-3 border-t border-current/10">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeny(request.id);
                    }}
                  >
                    <X className="h-4 w-4 mr-1.5" />
                    Deny
                  </Button>
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      onApprove(request.id);
                    }}
                  >
                    <Check className="h-4 w-4 mr-1.5" />
                    Approve
                  </Button>
                </div>

                {/* Submitted Time */}
                <p className="text-xs opacity-75 pt-2">
                  Submitted {request.submittedAt}
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
