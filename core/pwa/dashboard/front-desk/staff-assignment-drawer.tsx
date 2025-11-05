import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, Coffee, Sparkles } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useStaff } from "@/features/core/hooks/queries/queries.dashboard-front-desk";
import type { Staff } from "@/features/core/types/types.dashboard-front-desk";

interface StaffAssignmentDrawerProps {
   isOpen: boolean;
   onClose: () => void;
   preferredStaffId?: string;
   onAssign: (staffId: string | "first-available") => void;
}

function getStatusBadge(status: Staff["status"]) {
   switch (status) {
      case "available":
         return (
            <Badge className="bg-green-500/10 text-green-600 dark:text-green-500 border-green-500/20 text-xs">Available</Badge>
         );
      case "busy":
         return <Badge className="bg-red-500/10 text-red-600 dark:text-red-500 border-red-500/20 text-xs">Busy</Badge>;
      case "break":
         return (
            <Badge className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border-yellow-500/20 text-xs">On Break</Badge>
         );
      default:
         return null;
   }
}

export function StaffAssignmentDrawer({ isOpen, onClose, preferredStaffId, onAssign }: StaffAssignmentDrawerProps) {
   const isMobile = useIsMobile();
   const { data: staff = [] } = useStaff();

   const availableStaff = staff.filter((s) => s.status === "available");
   const busyStaff = staff.filter((s) => s.status === "busy");
   const onBreakStaff = staff.filter((s) => s.status === "break");

   const handleAssign = (staffId: string | "first-available") => {
      onAssign(staffId);
      onClose();
   };

   const content = (
      <div className="space-y-4 py-4">
         {availableStaff.length > 0 && (
            <Button onClick={() => handleAssign("first-available")} size="lg" className="w-full justify-start gap-3 h-auto py-4">
               <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-foreground/20">
                  <Sparkles className="h-5 w-5" />
               </div>
               <div className="flex-1 text-left">
                  <p className="font-semibold">First Available</p>
                  <p className="text-xs opacity-90">Automatically assign to next available staff</p>
               </div>
            </Button>
         )}

         {availableStaff.length > 0 && (
            <div className="space-y-3">
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <h4 className="font-semibold text-sm">Available Now</h4>
                  <Badge variant="secondary" className="ml-auto">
                     {availableStaff.length}
                  </Badge>
               </div>
               <div className="space-y-2">
                  {availableStaff.map((member) => (
                     <button
                        key={member.id}
                        onClick={() => handleAssign(member.id)}
                        className={cn(
                           "w-full p-3 rounded-lg border transition-all text-left hover:bg-accent/50",
                           preferredStaffId === member.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                        )}
                     >
                        <div className="flex items-center gap-3">
                           <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: member.color }} />
                           <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                 <p className="font-semibold text-sm truncate">{member.name}</p>
                                 {preferredStaffId === member.id && (
                                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5">
                                       PREFERRED
                                    </Badge>
                                 )}
                              </div>
                              <p className="text-xs text-green-600 dark:text-green-500 font-medium">Ready for walk-ins</p>
                           </div>
                           {getStatusBadge(member.status)}
                        </div>
                     </button>
                  ))}
               </div>
            </div>
         )}

         {busyStaff.length > 0 && (
            <div className="space-y-3">
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <h4 className="font-semibold text-sm">Currently Busy</h4>
                  <Badge variant="secondary" className="ml-auto">
                     {busyStaff.length}
                  </Badge>
               </div>
               <div className="space-y-2">
                  {busyStaff.map((member) => (
                     <div key={member.id} className="p-3 rounded-lg border border-border bg-muted/30 opacity-60">
                        <div className="flex items-center gap-3">
                           <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: member.color }} />
                           <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm truncate mb-1">{member.name}</p>
                              {member.currentClient && (
                                 <div className="space-y-0.5">
                                    <p className="text-xs text-muted-foreground truncate">
                                       With: <span className="text-foreground font-medium">{member.currentClient}</span>
                                    </p>
                                    {member.finishesAt && (
                                       <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                          <Clock className="h-3 w-3" />
                                          <span>Finishes {member.finishesAt}</span>
                                       </div>
                                    )}
                                 </div>
                              )}
                           </div>
                           {getStatusBadge(member.status)}
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         )}

         {onBreakStaff.length > 0 && (
            <div className="space-y-3">
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  <h4 className="font-semibold text-sm">On Break</h4>
                  <Badge variant="secondary" className="ml-auto">
                     {onBreakStaff.length}
                  </Badge>
               </div>
               <div className="space-y-2">
                  {onBreakStaff.map((member) => (
                     <div key={member.id} className="p-3 rounded-lg border border-border bg-muted/30 opacity-60">
                        <div className="flex items-center gap-3">
                           <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: member.color }} />
                           <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm truncate mb-1">{member.name}</p>
                              {member.finishesAt && (
                                 <p className="text-xs text-yellow-600 dark:text-yellow-500 font-medium flex items-center gap-1">
                                    <Coffee className="h-3 w-3" />
                                    Returns at {member.finishesAt}
                                 </p>
                              )}
                           </div>
                           {getStatusBadge(member.status)}
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         )}

         {availableStaff.length === 0 && (
            <div className="py-8 text-center">
               <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
               <p className="text-sm text-muted-foreground mb-1">No staff currently available</p>
               <p className="text-xs text-muted-foreground">Customer will be notified when someone is free</p>
            </div>
         )}
      </div>
   );

   if (isMobile) {
      return (
         <Drawer open={isOpen} onOpenChange={onClose}>
            <DrawerContent className="max-h-[85vh]">
               <DrawerHeader>
                  <DrawerTitle className="flex items-center gap-2">
                     <Users className="h-5 w-5 text-primary" />
                     Assign Staff
                  </DrawerTitle>
               </DrawerHeader>
               <div className="overflow-y-auto px-4 pb-8">{content}</div>
            </DrawerContent>
         </Drawer>
      );
   }

   return (
      <Dialog open={isOpen} onOpenChange={onClose}>
         <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
            <DialogHeader>
               <DialogTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Assign Staff
               </DialogTitle>
            </DialogHeader>
            {content}
         </DialogContent>
      </Dialog>
   );
}
