import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, Edit2, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { IconBadge } from "../shared/icon-badge";
import type { Client } from "@/features/core/types/types.clients";
import type { Service } from "@/features/core/types/types.services";

interface ClientsTableProps {
  clients: Client[];
  services: Service[];
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  totalFiltered: number;
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string) => string;
  onView: (client: Client) => void;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
}

export function ClientsTable({
  clients,
  services,
  currentPage,
  itemsPerPage,
  totalPages,
  totalFiltered,
  formatCurrency,
  formatDate,
  onView,
  onEdit,
  onDelete,
  onPageChange,
  onItemsPerPageChange,
}: ClientsTableProps) {
  const getServiceById = (serviceId: string) => {
    return services.find((s) => s.id === serviceId);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Contact</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="hidden lg:table-cell">Last Visit</TableHead>
              <TableHead className="text-right">Visits</TableHead>
              <TableHead className="text-right hidden sm:table-cell">Total Spent</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No clients found
                </TableCell>
              </TableRow>
            ) : (
              clients.map((client) => {
                const service = client.lastServiceId ? getServiceById(client.lastServiceId) : null;

                return (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div>{client.name}</div>
                        <div className="text-xs text-muted-foreground md:hidden">
                          {client.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="text-sm">
                        <div>{client.phone}</div>
                        {client.email && (
                          <div className="text-xs text-muted-foreground">{client.email}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={client.type === "registered" ? "default" : "secondary"}
                        className="capitalize"
                      >
                        {client.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {client.lastVisit ? (
                        <div className="text-sm">
                          <div>{formatDate(client.lastVisit)}</div>
                          {service && (
                            <div className="flex items-center gap-1.5 mt-1">
                              <IconBadge icon={service.icon} color={service.color} size="sm" />
                              <span className="text-xs text-muted-foreground">
                                {service.name}
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">No visits</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium">{client.totalVisits}</TableCell>
                    <TableCell className="text-right font-medium hidden sm:table-cell">
                      {formatCurrency(client.totalSpent)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => onView(client)}>
                          <Eye className="h-4 w-4" />
                          <span className="ml-2 hidden sm:inline">View</span>
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => onEdit(client)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => onDelete(client)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalFiltered > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Rows per page:</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => onItemsPerPageChange(Number(value))}
            >
              <SelectTrigger className="w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages} ({totalFiltered} total)
            </span>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
