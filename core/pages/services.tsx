"use client";

import { useMemo } from "react";
import { Briefcase } from "lucide-react";
import { ServicesStatsCards } from "../components/services/services-stats-cards";
import { SpecializationList } from "../components/services/specialization-list";
import { ServiceList } from "../components/services/service-list";
import { SpecializationFormDialog } from "../components/services/specialization-form-dialog";
import { ServiceFormDialog } from "../components/services/service-form-dialog";
import { useServicesStore } from "../store/store.services";
import {
  useSpecializations,
  useServices,
  useServiceRelationships,
} from "../hooks/queries/queries.services";
import type { SpecializationForm, ServiceForm } from "../types/types.services";

export default function ServicesPage() {
  const { data: specializations = [], isLoading: loadingSpecs } = useSpecializations();
  const { data: services = [], isLoading: loadingServices } = useServices();
  const { data: relationships = {}, isLoading: loadingRels } = useServiceRelationships();

  const store = useServicesStore();

  // Helper functions
  const getLinkedServices = (specId: string) => relationships[specId] || [];

  const getLinkedSpecs = (serviceId: string) => {
    return Object.keys(relationships).filter((specId) =>
      relationships[specId]?.includes(serviceId)
    );
  };

  const isServiceLinked = (serviceId: string) => {
    if (!store.selectedSpecializationId) return false;
    return getLinkedServices(store.selectedSpecializationId).includes(serviceId);
  };

  const isServiceHighlighted = (serviceId: string) => {
    if (store.hoveredSpecializationId) {
      return getLinkedServices(store.hoveredSpecializationId).includes(serviceId);
    }
    return false;
  };

  const isSpecHighlighted = (specId: string) => {
    if (store.hoveredServiceId) {
      return getLinkedSpecs(store.hoveredServiceId).includes(specId);
    }
    return false;
  };

  // Handlers
  const handleToggleLink = (serviceId: string) => {
    if (!store.selectedSpecializationId) return;
    // In a real app, this would trigger a mutation
    console.log("Toggle link:", store.selectedSpecializationId, serviceId);
  };

  const handleSubmitSpec = (data: SpecializationForm) => {
    if (store.editingSpecialization) {
      console.log("Update specialization:", store.editingSpecialization.id, data);
    } else {
      console.log("Create specialization:", data);
    }
  };

  const handleSubmitService = (data: ServiceForm) => {
    if (store.editingService) {
      console.log("Update service:", store.editingService.id, data);
    } else {
      console.log("Create service:", data);
    }
  };

  const handleDeleteSpec = (specId: string) => {
    const spec = specializations.find((s) => s.id === specId);
    if (spec && confirm(`Delete "${spec.name}"?`)) {
      console.log("Delete specialization:", specId);
      if (store.selectedSpecializationId === specId) {
        store.setSelectedSpecializationId(null);
      }
    }
  };

  const handleDeleteService = (serviceId: string) => {
    const service = services.find((s) => s.id === serviceId);
    if (service && confirm(`Delete "${service.name}"?`)) {
      console.log("Delete service:", serviceId);
    }
  };

  const isLoading = loadingSpecs || loadingServices || loadingRels;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Briefcase className="h-12 w-12 mx-auto text-muted-foreground animate-pulse" />
          <p className="text-muted-foreground">Loading services...</p>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalServices = services.length;
  const totalSpecializations = specializations.length;
  const avgPrice = useMemo(() => {
    return services.length > 0
      ? Math.round(services.reduce((sum, s) => sum + s.price, 0) / services.length)
      : 0;
  }, [services]);
  const avgDuration = useMemo(() => {
    return services.length > 0
      ? Math.round(services.reduce((sum, s) => sum + (s.duration || 0), 0) / services.length)
      : 0;
  }, [services]);

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Service Management
          </h1>
          <p className="text-muted-foreground mt-1">
            {store.selectedSpecializationId
              ? "Click services to link or unlink them"
              : "Select a specialization to manage links"}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <ServicesStatsCards
        totalSpecializations={totalSpecializations}
        totalServices={totalServices}
        avgPrice={avgPrice}
        avgDuration={avgDuration}
      />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Specializations */}
        <SpecializationList
          specializations={specializations}
          selectedSpecializationId={store.selectedSpecializationId}
          hoveredSpecializationId={store.hoveredSpecializationId}
          onSelectSpecialization={(id) =>
            store.setSelectedSpecializationId(
              store.selectedSpecializationId === id ? null : id
            )
          }
          onHoverSpecialization={store.setHoveredSpecializationId}
          onAddSpecialization={() => store.openSpecializationDialog(null)}
          onEditSpecialization={(spec) => store.openSpecializationDialog(spec)}
          onDeleteSpecialization={handleDeleteSpec}
          getLinkedServicesCount={(id) => getLinkedServices(id).length}
          isSpecHighlighted={isSpecHighlighted}
        />

        {/* Services */}
        <ServiceList
          services={services}
          selectedSpecializationId={store.selectedSpecializationId}
          hoveredServiceId={store.hoveredServiceId}
          onToggleLink={handleToggleLink}
          onHoverService={store.setHoveredServiceId}
          onAddService={() => store.openServiceDialog(null)}
          onEditService={(service) => store.openServiceDialog(service)}
          onDeleteService={handleDeleteService}
          isServiceLinked={isServiceLinked}
          isServiceHighlighted={isServiceHighlighted}
        />
      </div>

      {/* Specialization Form Dialog */}
      <SpecializationFormDialog
        open={store.isSpecializationDialogOpen}
        onOpenChange={(open) => !open && store.closeSpecializationDialog()}
        specialization={store.editingSpecialization}
        onSubmit={handleSubmitSpec}
      />

      {/* Service Form Dialog */}
      <ServiceFormDialog
        open={store.isServiceDialogOpen}
        onOpenChange={(open) => !open && store.closeServiceDialog()}
        service={store.editingService}
        onSubmit={handleSubmitService}
      />
    </div>
  );
}
