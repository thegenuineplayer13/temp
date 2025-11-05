import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveDialog } from "../shared/responsive-dialog";
import { IconBadge } from "../shared/icon-badge";
import type { Client } from "@/features/core/types/types.clients";
import type { Service } from "@/features/core/types/types.services";

interface ClientsDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client | null;
  services: Service[];
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string) => string;
}

export function ClientsDetailDialog({
  open,
  onOpenChange,
  client,
  services,
  formatCurrency,
  formatDate,
}: ClientsDetailDialogProps) {
  const getServiceById = (serviceId: string) => {
    return services.find((s) => s.id === serviceId);
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title={client?.name || "Client Details"}
      className="sm:max-w-3xl"
      footer={<Button onClick={() => onOpenChange(false)}>Close</Button>}
    >
      {client && (
        <div className="space-y-6 py-4">
          {/* Contact Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Phone:</span>
                <span className="text-sm font-medium">{client.phone}</span>
              </div>
              {client.email && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Email:</span>
                  <span className="text-sm font-medium">{client.email}</span>
                </div>
              )}
              {client.address && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Address:</span>
                  <span className="text-sm font-medium">{client.address}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <CardDescription>Total Visits</CardDescription>
                <CardTitle className="text-2xl mt-2">{client.totalVisits}</CardTitle>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <CardDescription>Total Spent</CardDescription>
                <CardTitle className="text-2xl mt-2">{formatCurrency(client.totalSpent)}</CardTitle>
              </CardContent>
            </Card>
          </div>

          {/* Visit History */}
          {client.visitHistory && client.visitHistory.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Visit History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {client.visitHistory.map((visit) => {
                    const service = getServiceById(visit.serviceId);
                    return (
                      <div
                        key={visit.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {service && (
                            <IconBadge icon={service.icon} color={service.color} size="md" />
                          )}
                          <div>
                            <p className="font-medium text-sm">{visit.serviceName}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(visit.date)}
                              {visit.staffName && ` • ${visit.staffName}`}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm">{formatCurrency(visit.amount)}</p>
                          {visit.rating && (
                            <p className="text-xs text-muted-foreground">
                              ⭐ {visit.rating.toFixed(1)}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Preferences */}
          {client.preferences.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Preferences
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-1">
                  {client.preferences.map((pref, idx) => (
                    <li key={idx} className="text-sm">
                      {pref}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Special Notes */}
          {client.specialNotes.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Special Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-1">
                  {client.specialNotes.map((note, idx) => (
                    <li key={idx} className="text-sm">
                      {note}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </ResponsiveDialog>
  );
}
