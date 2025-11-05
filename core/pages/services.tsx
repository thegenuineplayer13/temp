import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Trash2,
  Scissors,
  Palette,
  Wrench,
  Sparkles,
  Car,
  Zap,
  Droplet,
  Wind,
  Heart,
  Star,
  Circle,
  Square,
  Triangle,
  Home,
  User,
  Settings,
  Edit2,
  Link2,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const AVAILABLE_ICONS: Record<string, LucideIcon> = {
  Scissors,
  Palette,
  Wrench,
  Sparkles,
  Car,
  Zap,
  Droplet,
  Wind,
  Heart,
  Star,
  Circle,
  Square,
  Triangle,
  Home,
  User,
  Settings,
};

interface ColorOption {
  name: string;
  value: string;
  class: string;
}

const AVAILABLE_COLORS: ColorOption[] = [
  {
    name: "Blue",
    value: "blue",
    class: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  },
  {
    name: "Green",
    value: "green",
    class: "bg-green-500/10 text-green-600 border-green-500/20",
  },
  {
    name: "Purple",
    value: "purple",
    class: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  },
  {
    name: "Orange",
    value: "orange",
    class: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  },
  {
    name: "Pink",
    value: "pink",
    class: "bg-pink-500/10 text-pink-600 border-pink-500/20",
  },
  {
    name: "Red",
    value: "red",
    class: "bg-red-500/10 text-red-600 border-red-500/20",
  },
  {
    name: "Yellow",
    value: "yellow",
    class: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  },
  {
    name: "Indigo",
    value: "indigo",
    class: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
  },
  {
    name: "Teal",
    value: "teal",
    class: "bg-teal-500/10 text-teal-600 border-teal-500/20",
  },
  {
    name: "Cyan",
    value: "cyan",
    class: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
  },
];

interface Specialization {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface Service {
  id: string;
  name: string;
  price: number;
  icon: string;
  color: string;
}

type Relationships = Record<string, string[]>;

const initialSpecializations: Specialization[] = [
  { id: "1", name: "Hair Styling", icon: "Scissors", color: "blue" },
  { id: "2", name: "Beard Grooming", icon: "Sparkles", color: "green" },
  { id: "3", name: "Hair Coloring", icon: "Palette", color: "purple" },
];

const initialServices: Service[] = [
  { id: "a", name: "Haircut", price: 25, icon: "Scissors", color: "blue" },
  { id: "b", name: "Beard Trim", price: 15, icon: "Sparkles", color: "green" },
  { id: "c", name: "Hair Wash", price: 10, icon: "Droplet", color: "cyan" },
  { id: "d", name: "Full Color", price: 80, icon: "Palette", color: "purple" },
  { id: "e", name: "Highlights", price: 60, icon: "Star", color: "yellow" },
];

const initialRelationships: Relationships = {
  "1": ["a", "c"],
  "2": ["b"],
  "3": ["d", "e"],
};

interface FormData {
  name: string;
  icon: string;
  color: string;
  price: string;
}

const getColorClass = (color: string) => {
  return (
    AVAILABLE_COLORS.find((c) => c.value === color)?.class ||
    AVAILABLE_COLORS[0].class
  );
};

export default function SpecializationManager() {
  const [specializations, setSpecializations] = useState<Specialization[]>(
    initialSpecializations
  );
  const [services, setServices] = useState<Service[]>(initialServices);
  const [relationships, setRelationships] =
    useState<Relationships>(initialRelationships);

  const [selectedSpecId, setSelectedSpecId] = useState<string | null>(null);
  const [hoveredSpecId, setHoveredSpecId] = useState<string | null>(null);
  const [hoveredServiceId, setHoveredServiceId] = useState<string | null>(null);

  const [specDialogOpen, setSpecDialogOpen] = useState(false);
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [editingSpec, setEditingSpec] = useState<Specialization | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    icon: "Circle",
    color: "blue",
    price: "",
  });

  const [showIconPicker, setShowIconPicker] = useState(false);

  const getLinkedServices = (specId: string) => relationships[specId] || [];

  const getLinkedSpecs = (serviceId: string) => {
    return Object.keys(relationships).filter((specId) =>
      relationships[specId].includes(serviceId)
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
    setRelationships((prev) => {
      const currentLinks = prev[selectedSpecId] || [];
      const newLinks = currentLinks.includes(serviceId)
        ? currentLinks.filter((id) => id !== serviceId)
        : [...currentLinks, serviceId];
      return { ...prev, [selectedSpecId]: newLinks };
    });
  };

  const handleCreateSpec = () => {
    setEditingSpec(null);
    setFormData({ name: "", icon: "Circle", color: "blue", price: "" });
    setSpecDialogOpen(true);
  };

  const handleEditSpec = (spec: Specialization) => {
    setEditingSpec(spec);
    setFormData({
      name: spec.name,
      icon: spec.icon,
      color: spec.color,
      price: "",
    });
    setSpecDialogOpen(true);
  };

  const handleSaveSpec = () => {
    if (!formData.name.trim()) return;

    if (editingSpec) {
      setSpecializations(
        specializations.map((s) =>
          s.id === editingSpec.id
            ? {
                ...s,
                name: formData.name,
                icon: formData.icon,
                color: formData.color,
              }
            : s
        )
      );
    } else {
      const newSpec: Specialization = {
        id: Date.now().toString(),
        name: formData.name,
        icon: formData.icon,
        color: formData.color,
      };
      setSpecializations([...specializations, newSpec]);
      setRelationships({ ...relationships, [newSpec.id]: [] });
    }

    setSpecDialogOpen(false);
    setEditingSpec(null);
  };

  const handleDeleteSpec = (id: string) => {
    const spec = specializations.find((s) => s.id === id);
    if (spec && confirm(`Delete "${spec.name}"?`)) {
      setSpecializations(specializations.filter((s) => s.id !== id));
      const newRelationships = { ...relationships };
      delete newRelationships[id];
      setRelationships(newRelationships);
      if (selectedSpecId === id) setSelectedSpecId(null);
    }
  };

  const handleCreateService = () => {
    setEditingService(null);
    setFormData({ name: "", icon: "Circle", color: "blue", price: "" });
    setServiceDialogOpen(true);
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      icon: service.icon,
      color: service.color,
      price: service.price.toString(),
    });
    setServiceDialogOpen(true);
  };

  const handleSaveService = () => {
    if (!formData.name.trim()) return;

    if (editingService) {
      setServices(
        services.map((s) =>
          s.id === editingService.id
            ? {
                ...s,
                name: formData.name,
                price: parseFloat(formData.price) || 0,
                icon: formData.icon,
                color: formData.color,
              }
            : s
        )
      );
    } else {
      const newService: Service = {
        id: Date.now().toString(),
        name: formData.name,
        price: parseFloat(formData.price) || 0,
        icon: formData.icon,
        color: formData.color,
      };
      setServices([...services, newService]);
    }

    setServiceDialogOpen(false);
    setEditingService(null);
  };

  const handleDeleteService = (id: string) => {
    const service = services.find((s) => s.id === id);
    if (service && confirm(`Delete "${service.name}"?`)) {
      setServices(services.filter((s) => s.id !== id));
      const newRelationships = { ...relationships };
      Object.keys(newRelationships).forEach((specId) => {
        newRelationships[specId] = newRelationships[specId].filter(
          (sId) => sId !== id
        );
      });
      setRelationships(newRelationships);
    }
  };

  const IconComponent = AVAILABLE_ICONS[formData.icon] || Circle;

  return (
    <div className="space-y-4 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Service Management
        </h1>
        <p className="text-sm text-muted-foreground">
          {selectedSpecId
            ? "Click services to link or unlink them"
            : "Select a specialization to manage links"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Specializations */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-muted-foreground">
              Specializations
            </h2>
            <Button onClick={handleCreateSpec} size="sm" variant="outline">
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Add
            </Button>
          </div>

          <div className="space-y-1.5">
            {specializations.map((spec) => {
              const SpecIcon = AVAILABLE_ICONS[spec.icon] || Circle;
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
                  <div
                    className={cn(
                      "p-1.5 rounded-md border",
                      getColorClass(spec.color)
                    )}
                  >
                    <SpecIcon className="h-4 w-4" />
                  </div>
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
                        handleDeleteSpec(spec.id);
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Services */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-muted-foreground">
              Services
            </h2>
            <Button onClick={handleCreateService} size="sm" variant="outline">
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Add
            </Button>
          </div>

          <div className="space-y-1.5">
            {services.map((service) => {
              const ServiceIcon = AVAILABLE_ICONS[service.icon] || Circle;
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
                  <div
                    className={cn(
                      "p-1.5 rounded-md border",
                      getColorClass(service.color)
                    )}
                  >
                    <ServiceIcon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium leading-none">{service.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      ${service.price.toFixed(2)}
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
                        handleDeleteService(service.id);
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Specialization Dialog */}
      <Dialog open={specDialogOpen} onOpenChange={setSpecDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingSpec ? "Edit Specialization" : "New Specialization"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="spec-name">Name</Label>
              <Input
                id="spec-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter name"
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
                    <IconComponent className="h-4 w-4 mr-2" />
                    <span className="text-sm">{formData.icon}</span>
                  </Button>
                  {showIconPicker && (
                    <Card className="absolute z-50 mt-1 w-64 p-2 border shadow-lg">
                      <div className="grid grid-cols-6 gap-1">
                        {Object.entries(AVAILABLE_ICONS).map(([name, Icon]) => (
                          <Button
                            key={name}
                            type="button"
                            variant={
                              formData.icon === name ? "default" : "ghost"
                            }
                            size="icon"
                            className="h-9 w-9"
                            onClick={() => {
                              setFormData({ ...formData, icon: name });
                              setShowIconPicker(false);
                            }}
                          >
                            <Icon className="h-4 w-4" />
                          </Button>
                        ))}
                      </div>
                    </Card>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Color</Label>
                <div className="grid grid-cols-5 gap-1.5">
                  {AVAILABLE_COLORS.map((color) => (
                    <Button
                      key={color.value}
                      type="button"
                      variant="outline"
                      size="icon"
                      className={cn(
                        "h-9 w-9 border-2",
                        formData.color === color.value
                          ? "border-foreground"
                          : "border-transparent hover:border-muted-foreground/30"
                      )}
                      onClick={() =>
                        setFormData({ ...formData, color: color.value })
                      }
                    >
                      <div className={cn("h-5 w-5 rounded-sm", color.class)} />
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSpecDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSpec} disabled={!formData.name.trim()}>
              {editingSpec ? "Save" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Service Dialog */}
      <Dialog open={serviceDialogOpen} onOpenChange={setServiceDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingService ? "Edit Service" : "New Service"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="service-name">Name</Label>
              <Input
                id="service-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="service-price">Price</Label>
              <Input
                id="service-price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="0.00"
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
                    <IconComponent className="h-4 w-4 mr-2" />
                    <span className="text-sm">{formData.icon}</span>
                  </Button>
                  {showIconPicker && (
                    <Card className="absolute z-50 mt-1 w-64 p-2 border shadow-lg">
                      <div className="grid grid-cols-6 gap-1">
                        {Object.entries(AVAILABLE_ICONS).map(([name, Icon]) => (
                          <Button
                            key={name}
                            type="button"
                            variant={
                              formData.icon === name ? "default" : "ghost"
                            }
                            size="icon"
                            className="h-9 w-9"
                            onClick={() => {
                              setFormData({ ...formData, icon: name });
                              setShowIconPicker(false);
                            }}
                          >
                            <Icon className="h-4 w-4" />
                          </Button>
                        ))}
                      </div>
                    </Card>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Color</Label>
                <div className="grid grid-cols-5 gap-1.5">
                  {AVAILABLE_COLORS.map((color) => (
                    <Button
                      key={color.value}
                      type="button"
                      variant="outline"
                      size="icon"
                      className={cn(
                        "h-9 w-9 border-2",
                        formData.color === color.value
                          ? "border-foreground"
                          : "border-transparent hover:border-muted-foreground/30"
                      )}
                      onClick={() =>
                        setFormData({ ...formData, color: color.value })
                      }
                    >
                      <div className={cn("h-5 w-5 rounded-sm", color.class)} />
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setServiceDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveService}
              disabled={!formData.name.trim()}
            >
              {editingService ? "Save" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
