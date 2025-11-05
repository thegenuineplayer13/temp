import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertTriangle,
  Users,
  Wrench,
  Package,
  Clock,
  DollarSign,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  ArrowRight,
  TrendingDown,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  Alert,
  StaffAbsenceAlert,
  CustomerComplaintAlert,
  EquipmentFailureAlert,
  InventoryLowAlert,
} from "@/mock/mock-alerts-data";

interface AlertDetailProps {
  alert: Alert | null;
  onResolve?: (alertId: string) => void;
  onReassign?: (alertId: string, staffId: string) => void;
  onContact?: (customerId: string) => void;
}

const severityColors = {
  critical: "destructive",
  high: "orange",
  medium: "yellow",
};

export function AlertDetail({ alert, onResolve }: AlertDetailProps) {
  if (!alert) {
    return (
      <div className="h-full flex items-center justify-center text-center p-8">
        <div className="space-y-2">
          <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto" />
          <h3 className="font-semibold text-lg">No Alert Selected</h3>
          <p className="text-sm text-muted-foreground">
            Select an alert from the list to view details
          </p>
        </div>
      </div>
    );
  }

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant={alert.resolved ? "secondary" : "default"}
                  className={cn(
                    !alert.resolved &&
                      severityColors[alert.severity] === "destructive" &&
                      "bg-destructive/10 text-destructive",
                    !alert.resolved &&
                      severityColors[alert.severity] === "orange" &&
                      "bg-orange-500/10 text-orange-600 dark:text-orange-500",
                    !alert.resolved &&
                      severityColors[alert.severity] === "yellow" &&
                      "bg-yellow-500/10 text-yellow-600 dark:text-yellow-500"
                  )}
                >
                  {alert.resolved ? "Resolved" : alert.severity.toUpperCase()}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {alert.type.replace("_", " ")}
                </Badge>
              </div>
              <h1 className="text-2xl font-bold">{alert.title}</h1>
              <p className="text-muted-foreground">{alert.message}</p>
            </div>
            {!alert.resolved && (
              <Button onClick={() => onResolve?.(alert.id)}>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Mark Resolved
              </Button>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {formatDateTime(alert.timestamp)}
            </div>
            {alert.resolved && (
              <>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" />
                  Resolved by {alert.resolvedBy} on{" "}
                  {formatDateTime(alert.resolvedAt!)}
                </div>
              </>
            )}
          </div>
        </div>

        <Separator />

        {/* Type-specific content */}
        {alert.type === "staff_absence" && (
          <StaffAbsenceDetail alert={alert as StaffAbsenceAlert} />
        )}
        {alert.type === "customer_complaint" && (
          <CustomerComplaintDetail alert={alert as CustomerComplaintAlert} />
        )}
        {alert.type === "equipment_failure" && (
          <EquipmentFailureDetail alert={alert as EquipmentFailureAlert} />
        )}
        {alert.type === "inventory_low" && (
          <InventoryLowDetail alert={alert as InventoryLowAlert} />
        )}
      </div>
    </ScrollArea>
  );
}

// Staff Absence Detail Component
function StaffAbsenceDetail({ alert }: { alert: StaffAbsenceAlert }) {
  const totalRevenue = alert.data.affectedAppointments.reduce(
    (sum, apt) => sum + apt.revenue,
    0
  );

  return (
    <div className="space-y-6">
      {/* Staff Member Info */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg bg-primary/10">
              {alert.data.staffAvatar}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{alert.data.staffName}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                variant={
                  alert.data.reason === "no_show" ? "destructive" : "secondary"
                }
              >
                {alert.data.reason.replace("_", " ").toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Impact Summary */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-destructive/10 p-2">
              <Calendar className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Affected Appointments
              </p>
              <p className="text-2xl font-bold">
                {alert.data.affectedAppointments.length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-destructive/10 p-2">
              <DollarSign className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Revenue at Risk</p>
              <p className="text-2xl font-bold">${totalRevenue}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Affected Appointments */}
      <div className="space-y-3">
        <h3 className="font-semibold">Affected Appointments</h3>
        <div className="space-y-2">
          {alert.data.affectedAppointments.map((apt) => (
            <Card key={apt.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">{apt.time}</span>
                    <Badge variant="outline" className="text-xs">
                      {apt.duration}
                    </Badge>
                  </div>
                  <p className="font-medium">{apt.customerName}</p>
                  <p className="text-sm text-muted-foreground">{apt.service}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-lg">${apt.revenue}</p>
                  <Button size="sm" variant="outline" className="mt-2">
                    Reassign
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Suggested Replacements */}
      <div className="space-y-3">
        <h3 className="font-semibold">Suggested Replacement Staff</h3>
        <div className="space-y-2">
          {alert.data.suggestedReplacements.map((staff) => (
            <Card key={staff.staffId} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10">
                      {staff.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{staff.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant={
                          staff.availability === "available"
                            ? "default"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {staff.availability === "available"
                          ? "Available"
                          : "Partially Booked"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {staff.currentBookings} current bookings
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-sm font-semibold">
                      {staff.matchScore}% match
                    </span>
                  </div>
                  <Button size="sm">Assign All</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// Customer Complaint Detail Component
function CustomerComplaintDetail({ alert }: { alert: CustomerComplaintAlert }) {
  const sentimentColors = {
    angry: "bg-red-500/10 text-red-600 dark:text-red-500 border-red-500/20",
    disappointed:
      "bg-orange-500/10 text-orange-600 dark:text-orange-500 border-orange-500/20",
    frustrated:
      "bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border-yellow-500/20",
  };

  return (
    <div className="space-y-6">
      {/* Customer Info */}
      <Card className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg bg-primary/10">
                {alert.data.customerName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">
                {alert.data.customerName}
              </h3>
              <Badge
                className={cn("mt-1", sentimentColors[alert.data.sentiment])}
              >
                {alert.data.sentiment.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{alert.data.customerEmail}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{alert.data.customerPhone}</span>
          </div>
        </div>
      </Card>

      {/* Customer Value */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">Previous Visits</p>
          <p className="text-2xl font-bold">{alert.data.previousVisits}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">Lifetime Value</p>
          <p className="text-2xl font-bold">${alert.data.lifetimeValue}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">This Visit</p>
          <p className="text-2xl font-bold">${alert.data.amount}</p>
        </Card>
      </div>

      {/* Complaint Details */}
      <div className="space-y-3">
        <h3 className="font-semibold">Complaint Details</h3>
        <Card className="p-4 space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">
                {alert.data.complaintCategory.replace("_", " ").toUpperCase()}
              </Badge>
            </div>
            <p className="text-sm leading-relaxed">
              {alert.data.complaintText}
            </p>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Service</p>
              <p className="font-medium">{alert.data.service}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Staff Member</p>
              <p className="font-medium">{alert.data.staffMember}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Appointment Date</p>
              <p className="font-medium">
                {new Date(alert.data.appointmentDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Appointment ID</p>
              <p className="font-medium">{alert.data.appointmentId}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <h3 className="font-semibold">Recommended Actions</h3>
        <div className="grid gap-2">
          <Button className="w-full justify-start">
            <Phone className="h-4 w-4 mr-2" />
            Call Customer Immediately
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Mail className="h-4 w-4 mr-2" />
            Send Apology Email
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <DollarSign className="h-4 w-4 mr-2" />
            Issue Refund or Discount
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Follow-up Appointment
          </Button>
        </div>
      </div>
    </div>
  );
}

// Equipment Failure Detail Component
function EquipmentFailureDetail({ alert }: { alert: EquipmentFailureAlert }) {
  const statusColors = {
    scheduled: "bg-blue-500/10 text-blue-600 dark:text-blue-500",
    in_progress: "bg-orange-500/10 text-orange-600 dark:text-orange-500",
    awaiting_parts: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-500",
  };

  return (
    <div className="space-y-6">
      {/* Equipment Info */}
      <Card className="p-4">
        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-destructive/10 p-3">
            <Wrench className="h-8 w-8 text-destructive" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">
              {alert.data.equipmentName}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{alert.data.location}</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Badge
                variant={
                  alert.data.failureType === "safety_issue"
                    ? "destructive"
                    : "secondary"
                }
              >
                {alert.data.failureType.replace("_", " ").toUpperCase()}
              </Badge>
              <Badge className={statusColors[alert.data.maintenanceStatus]}>
                {alert.data.maintenanceStatus.replace("_", " ").toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Impact Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Estimated Downtime</p>
          </div>
          <p className="text-xl font-bold">{alert.data.estimatedDowntime}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Impacted Appointments
            </p>
          </div>
          <p className="text-xl font-bold">{alert.data.impactedAppointments}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="h-4 w-4 text-destructive" />
            <p className="text-sm text-muted-foreground">Revenue Loss</p>
          </div>
          <p className="text-xl font-bold text-destructive">
            ${alert.data.estimatedRevenueLoss}
          </p>
        </Card>
      </div>

      {/* Maintenance Info */}
      <Card className="p-4 space-y-4">
        <h3 className="font-semibold">Maintenance Information</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground mb-1">Last Maintenance</p>
            <p className="font-medium">
              {new Date(alert.data.lastMaintenance).toLocaleDateString()}
            </p>
          </div>
          {alert.data.technician && (
            <div>
              <p className="text-muted-foreground mb-1">Technician</p>
              <p className="font-medium">{alert.data.technician}</p>
            </div>
          )}
          {alert.data.technicianETA && (
            <div>
              <p className="text-muted-foreground mb-1">Estimated Arrival</p>
              <p className="font-medium">{alert.data.technicianETA}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Affected Services */}
      <div className="space-y-3">
        <h3 className="font-semibold">Affected Services</h3>
        <div className="flex flex-wrap gap-2">
          {alert.data.affectedServices.map((service) => (
            <Badge key={service} variant="outline">
              {service}
            </Badge>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <h3 className="font-semibold">Actions</h3>
        <div className="grid gap-2">
          <Button className="w-full justify-start">
            <Phone className="h-4 w-4 mr-2" />
            Contact Technician
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Users className="h-4 w-4 mr-2" />
            Notify Affected Customers
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Calendar className="h-4 w-4 mr-2" />
            Reschedule Appointments
          </Button>
        </div>
      </div>
    </div>
  );
}

// Inventory Low Detail Component
function InventoryLowDetail({ alert }: { alert: InventoryLowAlert }) {
  const urgencyColors = {
    immediate: "bg-destructive/10 text-destructive border-destructive/20",
    within_week:
      "bg-orange-500/10 text-orange-600 dark:text-orange-500 border-orange-500/20",
    within_month:
      "bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border-yellow-500/20",
  };

  const statusColors = {
    not_ordered: "bg-red-500/10 text-red-600 dark:text-red-500",
    ordered: "bg-blue-500/10 text-blue-600 dark:text-blue-500",
    in_transit: "bg-green-500/10 text-green-600 dark:text-green-500",
  };

  const stockPercentage =
    (alert.data.currentStock / alert.data.minimumStock) * 100;

  return (
    <div className="space-y-6">
      {/* Item Info */}
      <Card className="p-4">
        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-orange-500/10 p-3">
            <Package className="h-8 w-8 text-orange-600 dark:text-orange-500" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{alert.data.itemName}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {alert.data.category}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={urgencyColors[alert.data.urgency]}>
                {alert.data.urgency.replace("_", " ").toUpperCase()}
              </Badge>
              <Badge className={statusColors[alert.data.orderStatus]}>
                {alert.data.orderStatus.replace("_", " ").toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Stock Level */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Current Stock Level</h3>
            <span className="text-2xl font-bold">
              {alert.data.currentStock} {alert.data.unit}
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Minimum required: {alert.data.minimumStock} {alert.data.unit}
              </span>
              <span className="font-semibold text-destructive">
                {stockPercentage.toFixed(0)}%
              </span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  stockPercentage < 30
                    ? "bg-destructive"
                    : stockPercentage < 60
                    ? "bg-orange-500"
                    : "bg-green-500"
                )}
                style={{ width: `${Math.min(stockPercentage, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Supplier Info */}
      <Card className="p-4 space-y-4">
        <h3 className="font-semibold">Supplier Information</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Supplier</span>
            <span className="font-medium">{alert.data.supplier}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Contact</span>
            <div className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5" />
              <span className="font-medium">{alert.data.supplierContact}</span>
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Last Order</span>
            <span className="font-medium">
              {new Date(alert.data.lastOrderDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Estimated Delivery</span>
            <span className="font-medium">
              {new Date(alert.data.estimatedDelivery).toLocaleDateString()}
            </span>
          </div>
        </div>
      </Card>

      {/* Affected Services */}
      <div className="space-y-3">
        <h3 className="font-semibold">Affected Services</h3>
        <div className="flex flex-wrap gap-2">
          {alert.data.affectedServices.map((service) => (
            <Badge key={service} variant="outline">
              {service}
            </Badge>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <h3 className="font-semibold">Actions</h3>
        <div className="grid gap-2">
          {alert.data.orderStatus === "not_ordered" && (
            <Button className="w-full justify-start">
              <Package className="h-4 w-4 mr-2" />
              Place Emergency Order
            </Button>
          )}
          <Button variant="outline" className="w-full justify-start">
            <Phone className="h-4 w-4 mr-2" />
            Contact Supplier
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <ArrowRight className="h-4 w-4 mr-2" />
            Track Shipment
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Users className="h-4 w-4 mr-2" />
            Notify Staff
          </Button>
        </div>
      </div>
    </div>
  );
}
