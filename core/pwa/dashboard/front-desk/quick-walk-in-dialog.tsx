import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import { useServices } from "@/features/core/hooks/queries/queries.services";
import { Users } from "lucide-react";

interface QuickWalkInDialogProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   onAddWalkIn: (name: string, serviceId?: string) => void;
}

export function QuickWalkInDialog({ open, onOpenChange, onAddWalkIn }: QuickWalkInDialogProps) {
   const isMobile = useIsMobile();
   const { data: services = [] } = useServices();
   const [name, setName] = useState("");
   const [serviceId, setServiceId] = useState<string>("");

   const handleSubmit = () => {
      if (name.trim()) {
         onAddWalkIn(name.trim(), serviceId || undefined);
         setName("");
         setServiceId("");
         onOpenChange(false);
      }
   };

   const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && name.trim()) {
         e.preventDefault();
         handleSubmit();
      }
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
            <Label htmlFor="walk-in-service">Requested Service (Optional)</Label>
            <Select value={serviceId} onValueChange={setServiceId}>
               <SelectTrigger>
                  <SelectValue placeholder="Select a service" />
               </SelectTrigger>
               <SelectContent>
                  {services.map((service) => (
                     <SelectItem key={service.id} value={service.id}>
                        {service.name} - ${service.price} ({service.duration}min)
                     </SelectItem>
                  ))}
               </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">You can assign a service later if unsure</p>
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
