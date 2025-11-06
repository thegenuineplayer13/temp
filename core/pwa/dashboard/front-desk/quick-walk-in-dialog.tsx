import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useIsMobile } from "@/hooks/use-mobile";
import { useServices } from "@/features/core/hooks/queries/queries.services";
import { IconBadge } from "@/features/core/components/shared/icon-badge";
import { cn } from "@/lib/utils";
import { Users } from "lucide-react";

interface QuickWalkInDialogProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   onAddWalkIn: (name: string, serviceIds?: string[]) => void;
}

export function QuickWalkInDialog({ open, onOpenChange, onAddWalkIn }: QuickWalkInDialogProps) {
   const isMobile = useIsMobile();
   const { data: services = [] } = useServices();
   const [name, setName] = useState("");
   const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);

   const handleSubmit = () => {
      if (name.trim()) {
         onAddWalkIn(name.trim(), selectedServiceIds.length > 0 ? selectedServiceIds : undefined);
         setName("");
         setSelectedServiceIds([]);
         onOpenChange(false);
      }
   };

   const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && name.trim()) {
         e.preventDefault();
         handleSubmit();
      }
   };

   const handleToggleService = (serviceId: string) => {
      setSelectedServiceIds((prev) =>
         prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId]
      );
   };

   const content = (
      <div className="space-y-4">
         <div className="space-y-2">
            <Label htmlFor="walk-in-name">Customer Name *</Label>
            <Input
               id="walk-in-name"
               placeholder="Enter customer name"
               value={name}
               onChange={(e) => setName(e.target.value)}
               onKeyDown={handleKeyDown}
               autoFocus
            />
         </div>
         <div className="space-y-2">
            <Label>Requested Services (Optional)</Label>
            <div className="max-h-[300px] overflow-y-auto border border-border rounded-lg p-2">
               <div className="space-y-1.5">
                  {services.map((service) => {
                     const selected = selectedServiceIds.includes(service.id);
                     return (
                        <div
                           key={service.id}
                           className={cn(
                              "group relative flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition-all cursor-pointer",
                              selected ? "bg-accent border-foreground/20 shadow-sm" : "hover:bg-accent/50 border-transparent"
                           )}
                           onClick={() => handleToggleService(service.id)}
                        >
                           <Checkbox
                              checked={selected}
                              onCheckedChange={() => handleToggleService(service.id)}
                              onClick={(e) => e.stopPropagation()}
                           />
                           <IconBadge icon={service.icon} color={service.color} size="sm" />
                           <div className="flex-1 min-w-0">
                              <p className="font-medium leading-none">{service.name}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                 ${service.price.toFixed(2)}
                                 {service.duration && ` • ${service.duration}min`}
                              </p>
                           </div>
                        </div>
                     );
                  })}
               </div>
            </div>
            <p className="text-xs text-muted-foreground">Select services the customer is interested in</p>
         </div>
      </div>
   );

   const footer = (
      <div className="flex gap-2 w-full">
         <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Cancel
         </Button>
         <Button onClick={handleSubmit} disabled={!name.trim()} className="flex-1">
            Add to Queue
         </Button>
      </div>
   );

   if (isMobile) {
      return (
         <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent>
               <DrawerHeader>
                  <DrawerTitle className="flex items-center gap-2">
                     <Users className="h-5 w-5 text-primary" />
                     Quick Walk-in
                  </DrawerTitle>
                  <DrawerDescription>Add a customer to the walk-in queue without full registration</DrawerDescription>
               </DrawerHeader>
               <div className="px-4 py-4">{content}</div>
               <DrawerFooter>{footer}</DrawerFooter>
            </DrawerContent>
         </Drawer>
      );
   }

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent className="sm:max-w-md">
            <DialogHeader>
               <DialogTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Quick Walk-in
               </DialogTitle>
               <DialogDescription>Add a customer to the walk-in queue without full registration</DialogDescription>
            </DialogHeader>
            <div className="py-4">{content}</div>
            <DialogFooter>{footer}</DialogFooter>
         </DialogContent>
      </Dialog>
   );
}
