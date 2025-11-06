import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useIsMobile } from "@/hooks/use-mobile";
import { Users } from "lucide-react";

interface QuickWalkInDialogProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   onAddWalkIn: (name: string, service?: string) => void;
}

export function QuickWalkInDialog({ open, onOpenChange, onAddWalkIn }: QuickWalkInDialogProps) {
   const isMobile = useIsMobile();
   const [name, setName] = useState("");
   const [service, setService] = useState("");

   const handleSubmit = () => {
      if (name.trim()) {
         onAddWalkIn(name.trim(), service.trim() || undefined);
         setName("");
         setService("");
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
            <Input
               id="walk-in-service"
               placeholder="e.g., Haircut"
               value={service}
               onChange={(e) => setService(e.target.value)}
               onKeyDown={handleKeyDown}
            />
            <p className="text-xs text-muted-foreground">You can assign a specific service later</p>
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
