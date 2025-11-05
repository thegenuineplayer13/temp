"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusCircle, Users } from "lucide-react";
import { ClientsStatsCards } from "../components/clients/clients-stats-cards";
import { ClientsFilters } from "../components/clients/clients-filters";
import { ClientsTable } from "../components/clients/clients-table";
import { ClientsFormDialog } from "../components/clients/clients-form-dialog";
import { ClientsDetailDialog } from "../components/clients/clients-detail-dialog";
import { ClientsDeleteDialog } from "../components/clients/clients-delete-dialog";
import { useClientsStore } from "../store/store.clients";
import { useClients } from "../hooks/queries/queries.clients";
import { useServices } from "../hooks/queries/queries.services";
import type { ClientForm } from "../types/types.clients";

export default function ClientsPage() {
  const { data: clients = [], isLoading: loadingClients } = useClients();
  const { data: services = [], isLoading: loadingServices } = useServices();

  const store = useClientsStore();

  // Filter and search clients
  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const matchesSearch =
        client.name.toLowerCase().includes(store.searchQuery.toLowerCase()) ||
        client.phone.includes(store.searchQuery) ||
        (client.email && client.email.toLowerCase().includes(store.searchQuery.toLowerCase()));

      const matchesType = store.filterType === "all" || client.type === store.filterType;

      return matchesSearch && matchesType;
    });
  }, [clients, store.searchQuery, store.filterType]);

  // Pagination
  const totalPages = Math.ceil(filteredClients.length / store.itemsPerPage);
  const startIndex = (store.currentPage - 1) * store.itemsPerPage;
  const currentClients = filteredClients.slice(startIndex, startIndex + store.itemsPerPage);

  // Stats
  const stats = useMemo(() => {
    const registeredClients = clients.filter((c) => c.type === "registered").length;
    const walkInClients = clients.filter((c) => c.type === "walk-in").length;
    const totalRevenue = clients.reduce((sum, c) => sum + c.totalSpent, 0);
    const averageSpending = clients.length > 0 ? Math.round(totalRevenue / clients.length) : 0;

    return {
      totalClients: clients.length,
      registeredClients,
      walkInClients,
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

  // Handlers
  const handleAddClient = () => {
    store.openFormDialog(null);
  };

  const handleEditClient = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    if (client) {
      store.openFormDialog(client);
    }
  };

  const handleViewDetails = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    if (client) {
      store.openViewDialog(client);
    }
  };

  const handleDeleteClient = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    if (client) {
      store.openDeleteDialog(client);
    }
  };

  const handleSubmit = (data: ClientForm) => {
    if (store.selectedClient) {
      console.log("Update client:", store.selectedClient.id, data);
    } else {
      console.log("Create client:", data);
    }
  };

  const handleConfirmDelete = () => {
    if (store.clientToDelete) {
      console.log("Delete client:", store.clientToDelete.id);
    }
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
      <ClientsStatsCards
        totalClients={stats.totalClients}
        registeredClients={stats.registeredClients}
        walkInClients={stats.walkInClients}
        averageSpending={stats.averageSpending}
        formatCurrency={formatCurrency}
      />

      {/* Filters */}
      <ClientsFilters />

      {/* Table */}
      <Card>
        <div className="p-6">
          <ClientsTable
            clients={currentClients}
            services={services}
            currentPage={store.currentPage}
            itemsPerPage={store.itemsPerPage}
            totalPages={totalPages}
            totalClients={filteredClients.length}
            onView={handleViewDetails}
            onEdit={handleEditClient}
            onDelete={handleDeleteClient}
            onPageChange={store.setCurrentPage}
            onItemsPerPageChange={(value) => {
              store.setItemsPerPage(value);
              store.setCurrentPage(1);
            }}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
          />
        </div>
      </Card>

      {/* Client Form Dialog */}
      <ClientsFormDialog
        open={store.isFormDialogOpen}
        onOpenChange={(open) => !open && store.closeFormDialog()}
        client={store.selectedClient}
        onSubmit={handleSubmit}
      />

      {/* Client Detail View Dialog */}
      <ClientsDetailDialog
        open={store.isViewDialogOpen}
        onOpenChange={(open) => !open && store.closeViewDialog()}
        client={store.selectedClient}
        services={services}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
      />

      {/* Delete Confirmation Dialog */}
      <ClientsDeleteDialog
        open={store.isDeleteDialogOpen}
        onOpenChange={(open) => !open && store.closeDeleteDialog()}
        client={store.clientToDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
