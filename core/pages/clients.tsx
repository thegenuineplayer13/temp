"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  Users,
  TrendingUp,
  DollarSign,
  Edit2,
  Trash2,
  PlusCircle,
  UserPlus,
  UserCheck,
} from "lucide-react";
import { ResponsiveDialog } from "../components/shared/responsive-dialog";
import { IconBadge } from "../components/shared/icon-badge";
import { useClients } from "../hooks/queries/queries.clients";
import { useServices } from "../hooks/queries/queries.services";
import { clientFormSchema } from "../schemas/schemas.clients";
import type { Client, ClientForm } from "../types/types.clients";

export default function ClientsPage() {
  const { data: clients = [], isLoading: loadingClients } = useClients();
  const { data: services = [], isLoading: loadingServices } = useServices();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterType, setFilterType] = useState<"all" | "registered" | "walk-in">("all");

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  const form = useForm<ClientForm>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      type: "registered",
      preferences: [],
      specialNotes: [],
      birthday: "",
      address: "",
    },
  });

  // Filter and search clients
  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const matchesSearch =
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.phone.includes(searchQuery) ||
        (client.email && client.email.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesType = filterType === "all" || client.type === filterType;

      return matchesSearch && matchesType;
    });
  }, [clients, searchQuery, filterType]);

  // Pagination
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentClients = filteredClients.slice(startIndex, startIndex + itemsPerPage);

  // Stats
  const stats = useMemo(() => {
    const registeredClients = clients.filter((c) => c.type === "registered").length;
    const walkInClients = clients.filter((c) => c.type === "walk-in").length;
    const totalRevenue = clients.reduce((sum, c) => sum + c.totalSpent, 0);
    const averageSpending =
      clients.length > 0 ? Math.round(totalRevenue / clients.length) : 0;

    return {
      totalClients: clients.length,
      registeredClients,
      walkInClients,
      totalRevenue,
      averageSpending,
    };
  }, [clients]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get service by ID
  const getServiceById = (serviceId: string) => {
    return services.find((s) => s.id === serviceId);
  };

  // Handlers
  const handleAddClient = () => {
    setSelectedClient(null);
    form.reset({
      name: "",
      email: "",
      phone: "",
      type: "registered",
      preferences: [],
      specialNotes: [],
      birthday: "",
      address: "",
    });
    setIsFormDialogOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    form.reset({
      name: client.name,
      email: client.email || "",
      phone: client.phone,
      type: client.type,
      preferences: client.preferences,
      specialNotes: client.specialNotes,
      birthday: client.birthday || "",
      address: client.address || "",
    });
    setIsFormDialogOpen(true);
  };

  const handleDeleteClient = (client: Client) => {
    setClientToDelete(client);
    setIsDeleteDialogOpen(true);
  };

  const handleViewDetails = (client: Client) => {
    setSelectedClient(client);
    setIsViewDialogOpen(true);
  };

  const handleSubmit = (data: ClientForm) => {
    if (selectedClient) {
      console.log("Update client:", selectedClient.id, data);
    } else {
      console.log("Create client:", data);
    }
    setIsFormDialogOpen(false);
    setSelectedClient(null);
  };

  const handleConfirmDelete = () => {
    if (clientToDelete) {
      console.log("Delete client:", clientToDelete.id);
    }
    setIsDeleteDialogOpen(false);
    setClientToDelete(null);
  };

  const isLoading = loadingClients || loadingServices;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Users className="h-12 w-12 mx-auto text-muted-foreground animate-pulse" />
          <p className="text-muted-foreground">Loading clients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track your client relationships
          </p>
        </div>
        <Button onClick={handleAddClient} size="lg">
          <PlusCircle className="mr-2 h-5 w-5" />
          Add Client
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              Total Clients
            </CardDescription>
            <CardTitle className="text-3xl">{stats.totalClients}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-1">
              <UserCheck className="h-3 w-3" />
              Registered
            </CardDescription>
            <CardTitle className="text-3xl">{stats.registeredClients}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-1">
              <UserPlus className="h-3 w-3" />
              Walk-in
            </CardDescription>
            <CardTitle className="text-3xl">{stats.walkInClients}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              Avg Spending
            </CardDescription>
            <CardTitle className="text-3xl">{formatCurrency(stats.averageSpending)}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, phone, or email..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9"
              />
            </div>
            <Select
              value={filterType}
              onValueChange={(value: "all" | "registered" | "walk-in") => {
                setFilterType(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Client Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                <SelectItem value="registered">Registered</SelectItem>
                <SelectItem value="walk-in">Walk-in</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="pt-6">
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
                {currentClients.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No clients found
                    </TableCell>
                  </TableRow>
                ) : (
                  currentClients.map((client) => {
                    const service = client.lastServiceId
                      ? getServiceById(client.lastServiceId)
                      : null;

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
                              <div className="text-xs text-muted-foreground">
                                {client.email}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              client.type === "registered" ? "default" : "secondary"
                            }
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
                                  <IconBadge
                                    icon={service.icon}
                                    color={service.color}
                                    size="sm"
                                  />
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
                        <TableCell className="text-right font-medium">
                          {client.totalVisits}
                        </TableCell>
                        <TableCell className="text-right font-medium hidden sm:table-cell">
                          {formatCurrency(client.totalSpent)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(client)}
                            >
                              <Eye className="h-4 w-4" />
                              <span className="ml-2 hidden sm:inline">View</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditClient(client)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive"
                              onClick={() => handleDeleteClient(client)}
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
          {filteredClients.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Rows per page:</span>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => {
                    setItemsPerPage(Number(value));
                    setCurrentPage(1);
                  }}
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
                  Page {currentPage} of {totalPages} ({filteredClients.length} total)
                </span>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Client Form Dialog */}
      <ResponsiveDialog
        open={isFormDialogOpen}
        onOpenChange={setIsFormDialogOpen}
        title={selectedClient ? "Edit Client" : "Add New Client"}
        description={
          selectedClient
            ? "Update client information and preferences."
            : "Fill in the client details to add them to your records."
        }
        className="sm:max-w-2xl"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setIsFormDialogOpen(false);
                setSelectedClient(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={form.handleSubmit(handleSubmit)}>
              {selectedClient ? "Update Client" : "Add Client"}
            </Button>
          </>
        }
      >
        <form className="space-y-6 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                {...form.register("name")}
                placeholder="John Doe"
              />
              {form.formState.errors.name && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                {...form.register("phone")}
                placeholder="+1 (555) 123-4567"
              />
              {form.formState.errors.phone && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.phone.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...form.register("email")}
                placeholder="john@example.com"
              />
              {form.formState.errors.email && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Client Type *</Label>
              <Select
                value={form.watch("type")}
                onValueChange={(value: any) => form.setValue("type", value)}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="registered">Registered</SelectItem>
                  <SelectItem value="walk-in">Walk-in</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.type && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.type.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="birthday">Birthday</Label>
              <Input id="birthday" type="date" {...form.register("birthday")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                {...form.register("address")}
                placeholder="123 Main St"
              />
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Visit history and spending details will be tracked automatically
          </p>
        </form>
      </ResponsiveDialog>

      {/* Client Detail View Dialog */}
      <ResponsiveDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        title={selectedClient?.name || "Client Details"}
        className="sm:max-w-3xl"
        footer={
          <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
        }
      >
        {selectedClient && (
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
                  <span className="text-sm font-medium">{selectedClient.phone}</span>
                </div>
                {selectedClient.email && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Email:</span>
                    <span className="text-sm font-medium">{selectedClient.email}</span>
                  </div>
                )}
                {selectedClient.address && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Address:</span>
                    <span className="text-sm font-medium">{selectedClient.address}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Total Visits</CardDescription>
                  <CardTitle className="text-2xl">{selectedClient.totalVisits}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Total Spent</CardDescription>
                  <CardTitle className="text-2xl">
                    {formatCurrency(selectedClient.totalSpent)}
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>

            {/* Visit History */}
            {selectedClient.visitHistory && selectedClient.visitHistory.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Visit History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedClient.visitHistory.map((visit) => {
                      const service = getServiceById(visit.serviceId);
                      return (
                        <div
                          key={visit.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            {service && (
                              <IconBadge
                                icon={service.icon}
                                color={service.color}
                                size="md"
                              />
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
                            <p className="font-medium text-sm">
                              {formatCurrency(visit.amount)}
                            </p>
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
            {selectedClient.preferences.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedClient.preferences.map((pref, idx) => (
                      <li key={idx} className="text-sm">
                        {pref}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Special Notes */}
            {selectedClient.specialNotes.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Special Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedClient.specialNotes.map((note, idx) => (
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

      {/* Delete Confirmation Dialog */}
      <ResponsiveDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Client"
        description="Are you sure you want to delete this client? This action cannot be undone and will remove all visit history."
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setClientToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </>
        }
      >
        {clientToDelete && (
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              You are about to delete:
            </p>
            <p className="mt-2 font-semibold">{clientToDelete.name}</p>
            <p className="text-sm text-muted-foreground">{clientToDelete.phone}</p>
            {clientToDelete.totalVisits > 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                This client has {clientToDelete.totalVisits} visit(s) on record
              </p>
            )}
          </div>
        )}
      </ResponsiveDialog>
    </div>
  );
}
