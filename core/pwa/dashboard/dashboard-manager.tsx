import { useState, useEffect } from "react";
import { LiveScheduleTimeline } from "./manager/LiveScheduleTimeline";
import { QuickOverviewStats } from "./manager/QuickOverviewStats";
import { AlertsPanel } from "./manager/AlertsPanel";
import { ApprovalQueue } from "./manager/ApprovalQueue";
import { InventoryStatus } from "./manager/InventoryStatus";
import { CustomerQuickLookup } from "./manager/CustomerQuickLookup";
import {
  mockManagerData,
  type Appointment,
  type StaffMember,
  type Alert,
  type ApprovalRequest,
  type CustomerQuickInfo,
} from "@/mock/manager-dashboard-mock";

export default function ManagerDashboard() {
  const [isMobile, setIsMobile] = useState(false);
  const [data, setData] = useState(mockManagerData);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handler functions
  const handleAppointmentClick = (appointment: Appointment) => {
    console.log("Appointment clicked:", appointment);
    // In production, this would open a modal with appointment details
    alert(
      `Appointment Details:\n\nClient: ${appointment.clientName}\nService: ${appointment.service}\nTime: ${appointment.startTime} - ${appointment.endTime}\nStatus: ${appointment.status}\n\nActions: View full details, Reassign, Cancel, Add notes`
    );
  };

  const handleStaffClick = (staff: StaffMember) => {
    console.log("Staff clicked:", staff);
    // In production, this would open a modal with full staff schedule
    alert(
      `Staff Details:\n\n${staff.name}\nRole: ${staff.role}\nStatus: ${staff.status}\nUtilization: ${staff.utilizationPercent}%\n\nActions: View full schedule, Assign appointment, Send message`
    );
  };

  const handleAlertResolve = (alertId: string) => {
    setData((prevData) => ({
      ...prevData,
      alerts: prevData.alerts.map((alert) =>
        alert.id === alertId ? { ...alert, resolved: true } : alert
      ),
    }));
    console.log("Alert resolved:", alertId);
  };

  const handleAlertDetails = (alert: Alert) => {
    console.log("Alert details:", alert);
    // alert(`Alert Details:\n\n${alert.title}\n${alert.description}\n\nPriority: ${alert.priority}\nType: ${alert.type}\nTime: ${alert.timestamp}\n\nActions: Resolve, Escalate, Add notes`);
  };

  const handleApprovalApprove = (requestId: string) => {
    setData((prevData) => ({
      ...prevData,
      approvalRequests: prevData.approvalRequests.map((req) =>
        req.id === requestId ? { ...req, status: "approved" as const } : req
      ),
    }));
    console.log("Request approved:", requestId);

    const request = data.approvalRequests.find((r) => r.id === requestId);
    if (request) {
      alert(
        `✓ Approved: ${request.type} for ${request.staffName}\n\n${
          request.affectedAppointments > 0
            ? `Note: ${request.affectedAppointments} appointments will need to be rescheduled.`
            : "No appointments affected."
        }`
      );
    }
  };

  const handleApprovalDeny = (requestId: string) => {
    setData((prevData) => ({
      ...prevData,
      approvalRequests: prevData.approvalRequests.map((req) =>
        req.id === requestId ? { ...req, status: "denied" as const } : req
      ),
    }));
    console.log("Request denied:", requestId);

    const request = data.approvalRequests.find((r) => r.id === requestId);
    if (request) {
      alert(
        `✗ Denied: ${request.type} for ${request.staffName}\n\nThe staff member will be notified.`
      );
    }
  };

  const handleApprovalDetails = (request: ApprovalRequest) => {
    console.log("Request details:", request);
    alert(
      `Request Details:\n\n${request.staffName}\nType: ${request.type}\nDate: ${
        request.requestedDate
      }\n${request.requestedTime ? `Time: ${request.requestedTime}\n` : ""}${
        request.duration ? `Duration: ${request.duration} min\n` : ""
      }\nReason: ${request.reason}\n\nAffected Appointments: ${
        request.affectedAppointments
      }\n\nActions: Approve, Deny, Request more info`
    );
  };

  const handleInventoryReorder = (itemId: string) => {
    console.log("Reorder item:", itemId);
    const item = data.inventory.find((i) => i.id === itemId);
    if (item) {
      alert(
        `Quick Reorder Initiated:\n\n${item.name}\nCategory: ${item.category}\n\nCurrent: ${item.currentStock} ${item.unit}\nMinimum: ${item.minThreshold} ${item.unit}\n\nReorder quantity will be calculated based on usage patterns.`
      );
    }
  };

  const handleCustomerAddNote = (customerId: string, note: string) => {
    console.log("Add note for customer:", customerId, note);
    const customer = data.customers.find((c) => c.id === customerId);
    if (customer) {
      alert(
        `Add Note for ${customer.name}:\n\nThis would open a modal to add a new special note or update customer preferences.\n\nExamples:\n- Prefers specific stylist\n- Special requests\n- Important reminders\n- Service preferences`
      );
    }
  };

  // Calculate stats
  const workingStaff = data.staff.filter(
    (s) => s.status === "working" || s.status === "break" || s.status === "late"
  );
  const unresolvedAlerts = data.alerts.filter((a) => !a.resolved);
  const urgentAlerts = unresolvedAlerts.filter((a) => a.priority === "high");
  const pendingApprovals = data.approvalRequests.filter(
    (r) => r.status === "pending"
  );

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background p-4 space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">
            Manager Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Operations command center
          </p>
        </div>

        {/* Quick Stats */}
        <QuickOverviewStats
          totalStaff={data.staff.length}
          workingStaff={workingStaff.length}
          totalAlerts={unresolvedAlerts.length}
          urgentAlerts={urgentAlerts.length}
          pendingApprovals={pendingApprovals.length}
        />

        {/* Live Schedule */}
        <LiveScheduleTimeline
          staff={data.staff}
          appointments={data.appointments}
          currentTime={data.currentTime}
          onAppointmentClick={handleAppointmentClick}
          onStaffClick={handleStaffClick}
          isMobile={isMobile}
        />

        {/* Alerts Panel */}
        {unresolvedAlerts.length > 0 && (
          <AlertsPanel
            alerts={data.alerts}
            onResolve={handleAlertResolve}
            onViewDetails={handleAlertDetails}
            isMobile={isMobile}
          />
        )}

        {/* Approval Queue */}
        {pendingApprovals.length > 0 && (
          <ApprovalQueue
            requests={data.approvalRequests}
            onApprove={handleApprovalApprove}
            onDeny={handleApprovalDeny}
            onViewDetails={handleApprovalDetails}
            isMobile={isMobile}
          />
        )}

        {/* Inventory Status */}
        <InventoryStatus
          items={data.inventory}
          onReorder={handleInventoryReorder}
          isMobile={isMobile}
        />

        {/* Customer Lookup */}
        <CustomerQuickLookup
          customers={data.customers}
          onAddNote={handleCustomerAddNote}
          isMobile={isMobile}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Manager Dashboard</h1>
        <p className="text-muted-foreground">
          Real-time operations management and control center
        </p>
      </div>

      {/* Quick Stats */}
      <QuickOverviewStats
        totalStaff={data.staff.length}
        workingStaff={workingStaff.length}
        totalAlerts={unresolvedAlerts.length}
        urgentAlerts={urgentAlerts.length}
        pendingApprovals={pendingApprovals.length}
      />

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Schedule and Alerts */}
        <div className="xl:col-span-2 space-y-6">
          {/* Live Schedule */}
          <LiveScheduleTimeline
            staff={data.staff}
            appointments={data.appointments}
            currentTime={data.currentTime}
            onAppointmentClick={handleAppointmentClick}
            onStaffClick={handleStaffClick}
            isMobile={isMobile}
          />

          {/* Alerts Panel */}
          <AlertsPanel
            alerts={data.alerts}
            onResolve={handleAlertResolve}
            onViewDetails={handleAlertDetails}
            isMobile={isMobile}
          />
        </div>

        {/* Right Column - Approvals, Inventory, Customer Lookup */}
        <div className="xl:col-span-1 space-y-6">
          {/* Approval Queue */}
          <ApprovalQueue
            requests={data.approvalRequests}
            onApprove={handleApprovalApprove}
            onDeny={handleApprovalDeny}
            onViewDetails={handleApprovalDetails}
            isMobile={isMobile}
          />

          {/* Inventory Status */}
          <InventoryStatus
            items={data.inventory}
            onReorder={handleInventoryReorder}
            isMobile={isMobile}
          />

          {/* Customer Lookup */}
          <CustomerQuickLookup
            customers={data.customers}
            onAddNote={handleCustomerAddNote}
            isMobile={isMobile}
          />
        </div>
      </div>
    </div>
  );
}
