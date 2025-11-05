"use client";

import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Edit2,
  Trash2,
  Briefcase,
  DollarSign,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ResponsiveDialog } from "../components/shared/responsive-dialog";
import { IconBadge, ICON_MAP, getColorClass } from "../components/shared/icon-badge";
import {
  useSpecializations,
  useServices,
  useServiceRelationships,
} from "../hooks/queries/queries.services";
import { specializationFormSchema, serviceFormSchema } from "../schemas/schemas.services";
import type {
  Specialization,
  Service,
  SpecializationForm,
  ServiceForm,
  IconName,
  Color,
} from "../types/types.services";

const COLOR_OPTIONS: Array<{ value: Color; name: string }> = [
  { value: "blue", name: "Blue" },
  { value: "green", name: "Green" },
  { value: "purple", name: "Purple" },
  { value: "orange", name: "Orange" },
  { value: "pink", name: "Pink" },
  { value: "red", name: "Red" },
  { value: "yellow", name: "Yellow" },
  { value: "indigo", name: "Indigo" },
  { value: "teal", name: "Teal" },
  { value: "cyan", name: "Cyan" },
];

export default function ServicesPage() {
  const { data: specializations = [], isLoading: loadingSpecs } = useSpecializations();
  const { data: services = [], isLoading: loadingServices } = useServices();
  const { data: relationships = {}, isLoading: loadingRels } = useServiceRelationships();

  const [selectedSpecId, setSelectedSpecId] = useState<string | null>(null);
  const [hoveredSpecId, setHoveredSpecId] = useState<string | null>(null);
  const [hoveredServiceId, setHoveredServiceId] = useState<string | null>(null);

  const [specDialogOpen, setSpecDialogOpen] = useState(false);
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [editingSpec, setEditingSpec] = useState<Specialization | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [showIconPicker, setShowIconPicker] = useState(false);

  const specForm = useForm<SpecializationForm>({
    resolver: zodResolver(specializationFormSchema),
    defaultValues: {
      name: "",
      icon: "Circle",
      color: "blue",
    },
  });

  const serviceForm = useForm<ServiceForm>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      name: "",
      price: 0,
      duration: 30,
      icon: "Circle",
      color: "blue",
      description: "",
    },
  });

  // Helper functions
  const getLinkedServices = (specId: string) => relationships[specId] || [];

  const getLinkedSpecs = (serviceId: string) => {
    return Object.keys(relationships).filter((specId) =>
      relationships[specId]?.includes(serviceId)
    );
  };

  const isServiceLinked = (serviceId: string) => {
    if (!selectedSpecId) return false;
    return getLinkedServices(selectedSpecId).includes(serviceId);
  };

  const isServiceHighlighted = (serviceId: string) => {
    if (hoveredSpecId) {
      return getLinkedServices(hoveredSpecId).includes(serviceId);
    }
    return false;
  };

  const isSpecHighlighted = (specId: string) => {
    if (hoveredServiceId) {
      return getLinkedSpecs(hoveredServiceId).includes(specId);
    }
    return false;
  };

  const toggleLink = (serviceId: string) => {
    if (!selectedSpecId) return;
    // In a real app, this would trigger a mutation
    console.log("Toggle link:", selectedSpecId, serviceId);
  };

  // Specialization handlers
  const handleCreateSpec = () => {
    setEditingSpec(null);
    specForm.reset({ name: "", icon: "Circle", color: "blue" });
    setSpecDialogOpen(true);
  };

  const handleEditSpec = (spec: Specialization) => {
    setEditingSpec(spec);
    specForm.reset({
      name: spec.name,
      icon: spec.icon,
      color: spec.color,
    });
    setSpecDialogOpen(true);
  };

  const handleSubmitSpec = (data: SpecializationForm) => {
    if (editingSpec) {
      console.log("Update specialization:", editingSpec.id, data);
    } else {
      console.log("Create specialization:", data);
    }
    setSpecDialogOpen(false);
    setEditingSpec(null);
  };

  const handleDeleteSpec = (spec: Specialization) => {
    if (confirm(`Delete "${spec.name}"?`)) {
      console.log("Delete specialization:", spec.id);
      if (selectedSpecId === spec.id) setSelectedSpecId(null);
    }
  };

  // Service handlers
  const handleCreateService = () => {
    setEditingService(null);
    serviceForm.reset({
      name: "",
      price: 0,
      duration: 30,
      icon: "Circle",
      color: "blue",
      description: "",
    });
    setServiceDialogOpen(true);
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    serviceForm.reset({
      name: service.name,
      price: service.price,
      duration: service.duration,
      icon: service.icon,
      color: service.color,
      description: service.description,
    });
    setServiceDialogOpen(true);
  };

  const handleSubmitService = (data: ServiceForm) => {
    if (editingService) {
      console.log("Update service:", editingService.id, data);
    } else {
      console.log("Create service:", data);
    }
    setServiceDialogOpen(false);
    setEditingService(null);
  };

  const handleDeleteService = (service: Service) => {
    if (confirm(`Delete "${service.name}"?`)) {
      console.log("Delete service:", service.id);
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
  const avgPrice = services.length > 0
    ? Math.round(services.reduce((sum, s) => sum + s.price, 0) / services.length)
    : 0;
  const avgDuration = services.length > 0
    ? Math.round(services.reduce((sum, s) => sum + (s.duration || 0), 0) / services.length)
    : 0;

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Service Management
          </h1>
          <p className="text-muted-foreground mt-1">
            {selectedSpecId
              ? "Click services to link or unlink them"
              : "Select a specialization to manage links"}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Specializations</CardDescription>
            <CardTitle className="text-3xl">{totalSpecializations}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Services</CardDescription>
            <CardTitle className="text-3xl">{totalServices}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              Avg Price
            </CardDescription>
            <CardTitle className="text-3xl">${avgPrice}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Avg Duration
            </CardDescription>
            <CardTitle className="text-3xl">{avgDuration}m</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Specializations */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Specializations</CardTitle>
              <Button onClick={handleCreateSpec} size="sm" variant="outline">
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Add
              </Button>
            </div>
            <CardDescription>
              Manage specialization categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1.5">
              {specializations.map((spec) => {
                const isSelected = selectedSpecId === spec.id;
                const isHighlighted = isSpecHighlighted(spec.id);
                const linkedCount = getLinkedServices(spec.id).length;

                return (
                  <div
                    key={spec.id}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition-all cursor-pointer",
                      isSelected
                        ? "bg-accent border-foreground/20 shadow-sm"
                        : isHighlighted
                        ? "bg-accent/50 border-accent-foreground/10"
                        : "hover:bg-accent/50 border-transparent"
                    )}
                    onClick={() => setSelectedSpecId(isSelected ? null : spec.id)}
                    onMouseEnter={() => setHoveredSpecId(spec.id)}
                    onMouseLeave={() => setHoveredSpecId(null)}
                  >
                    <IconBadge icon={spec.icon} color={spec.color} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium leading-none">{spec.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {linkedCount} {linkedCount === 1 ? "service" : "services"}
                      </p>
                    </div>
                    <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditSpec(spec);
                        }}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSpec(spec);
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Services */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Services</CardTitle>
              <Button onClick={handleCreateService} size="sm" variant="outline">
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Add
              </Button>
            </div>
            <CardDescription>
              Manage available services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1.5">
              {services.map((service) => {
                const isLinked = isServiceLinked(service.id);
                const isHighlighted = isServiceHighlighted(service.id);
                const isGrayedOut = selectedSpecId && !isLinked;
                const canToggle = selectedSpecId !== null;

                return (
                  <div
                    key={service.id}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition-all",
                      canToggle && "cursor-pointer",
                      isLinked
                        ? "bg-accent border-foreground/20 shadow-sm"
                        : isHighlighted
                        ? "bg-accent/50 border-accent-foreground/10"
                        : isGrayedOut
                        ? "opacity-40 hover:opacity-70 border-transparent"
                        : "hover:bg-accent/50 border-transparent"
                    )}
                    onClick={() => canToggle && toggleLink(service.id)}
                    onMouseEnter={() => setHoveredServiceId(service.id)}
                    onMouseLeave={() => setHoveredServiceId(null)}
                  >
                    <IconBadge icon={service.icon} color={service.color} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium leading-none">{service.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        ${service.price.toFixed(2)}
                        {service.duration && ` • ${service.duration}min`}
                      </p>
                    </div>
                    <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditService(service);
                        }}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteService(service);
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Specialization Dialog */}
      <ResponsiveDialog
        open={specDialogOpen}
        onOpenChange={setSpecDialogOpen}
        title={editingSpec ? "Edit Specialization" : "New Specialization"}
        footer={
          <>
            <Button variant="outline" onClick={() => setSpecDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={specForm.handleSubmit(handleSubmitSpec)}>
              {editingSpec ? "Save" : "Create"}
            </Button>
          </>
        }
      >
        <form className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="spec-name">Name</Label>
            <Input
              id="spec-name"
              {...specForm.register("name")}
              placeholder="Enter name"
            />
            {specForm.formState.errors.name && (
              <p className="text-xs text-red-500">
                {specForm.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Icon</Label>
              <div className="relative">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start h-9"
                  onClick={() => setShowIconPicker(!showIconPicker)}
                >
                  <IconBadge
                    icon={specForm.watch("icon")}
                    color={specForm.watch("color")}
                    size="sm"
                    className="mr-2"
                  />
                  <span className="text-sm">{specForm.watch("icon")}</span>
                </Button>
                {showIconPicker && (
                  <Card className="absolute z-50 mt-1 w-64 p-2 border shadow-lg">
                    <CardContent className="p-0">
                      <div className="grid grid-cols-6 gap-1">
                        {(Object.keys(ICON_MAP) as IconName[]).map((iconName) => {
                          const Icon = ICON_MAP[iconName];
                          return (
                            <Button
                              key={iconName}
                              type="button"
                              variant={
                                specForm.watch("icon") === iconName ? "default" : "ghost"
                              }
                              size="icon"
                              className="h-9 w-9"
                              onClick={() => {
                                specForm.setValue("icon", iconName);
                                setShowIconPicker(false);
                              }}
                            >
                              <Icon className="h-4 w-4" />
                            </Button>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Color</Label>
              <div className="grid grid-cols-5 gap-1.5">
                {COLOR_OPTIONS.map((colorOption) => (
                  <Button
                    key={colorOption.value}
                    type="button"
                    variant="outline"
                    size="icon"
                    className={cn(
                      "h-9 w-9 border-2",
                      specForm.watch("color") === colorOption.value
                        ? "border-foreground"
                        : "border-transparent hover:border-muted-foreground/30"
                    )}
                    onClick={() => specForm.setValue("color", colorOption.value)}
                  >
                    <div
                      className={cn("h-5 w-5 rounded-sm", getColorClass(colorOption.value))}
                    />
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </form>
      </ResponsiveDialog>

      {/* Service Dialog */}
      <ResponsiveDialog
        open={serviceDialogOpen}
        onOpenChange={setServiceDialogOpen}
        title={editingService ? "Edit Service" : "New Service"}
        footer={
          <>
            <Button variant="outline" onClick={() => setServiceDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={serviceForm.handleSubmit(handleSubmitService)}>
              {editingService ? "Save" : "Create"}
            </Button>
          </>
        }
      >
        <form className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="service-name">Name</Label>
            <Input
              id="service-name"
              {...serviceForm.register("name")}
              placeholder="Enter name"
            />
            {serviceForm.formState.errors.name && (
              <p className="text-xs text-red-500">
                {serviceForm.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="service-price">Price ($)</Label>
              <Input
                id="service-price"
                type="number"
                step="0.01"
                {...serviceForm.register("price", { valueAsNumber: true })}
                placeholder="0.00"
              />
              {serviceForm.formState.errors.price && (
                <p className="text-xs text-red-500">
                  {serviceForm.formState.errors.price.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="service-duration">Duration (min)</Label>
              <Input
                id="service-duration"
                type="number"
                {...serviceForm.register("duration", { valueAsNumber: true })}
                placeholder="30"
              />
              {serviceForm.formState.errors.duration && (
                <p className="text-xs text-red-500">
                  {serviceForm.formState.errors.duration.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="service-description">Description (optional)</Label>
            <Textarea
              id="service-description"
              {...serviceForm.register("description")}
              placeholder="Enter description"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Icon</Label>
              <div className="relative">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start h-9"
                  onClick={() => setShowIconPicker(!showIconPicker)}
                >
                  <IconBadge
                    icon={serviceForm.watch("icon")}
                    color={serviceForm.watch("color")}
                    size="sm"
                    className="mr-2"
                  />
                  <span className="text-sm">{serviceForm.watch("icon")}</span>
                </Button>
                {showIconPicker && (
                  <Card className="absolute z-50 mt-1 w-64 p-2 border shadow-lg">
                    <CardContent className="p-0">
                      <div className="grid grid-cols-6 gap-1">
                        {(Object.keys(ICON_MAP) as IconName[]).map((iconName) => {
                          const Icon = ICON_MAP[iconName];
                          return (
                            <Button
                              key={iconName}
                              type="button"
                              variant={
                                serviceForm.watch("icon") === iconName
                                  ? "default"
                                  : "ghost"
                              }
                              size="icon"
                              className="h-9 w-9"
                              onClick={() => {
                                serviceForm.setValue("icon", iconName);
                                setShowIconPicker(false);
                              }}
                            >
                              <Icon className="h-4 w-4" />
                            </Button>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Color</Label>
              <div className="grid grid-cols-5 gap-1.5">
                {COLOR_OPTIONS.map((colorOption) => (
                  <Button
                    key={colorOption.value}
                    type="button"
                    variant="outline"
                    size="icon"
                    className={cn(
                      "h-9 w-9 border-2",
                      serviceForm.watch("color") === colorOption.value
                        ? "border-foreground"
                        : "border-transparent hover:border-muted-foreground/30"
                    )}
                    onClick={() => serviceForm.setValue("color", colorOption.value)}
                  >
                    <div
                      className={cn("h-5 w-5 rounded-sm", getColorClass(colorOption.value))}
                    />
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </form>
      </ResponsiveDialog>
    </div>
  );
}
