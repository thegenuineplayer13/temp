import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Clock, Phone, User, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { StaffAssignmentDrawer } from "./staff-assignment-drawer";
import { useWalkIns, useStaff } from "@/features/core/hooks/queries/queries.dashboard-front-desk";

interface WalkInQueueProps {
   onAssignStaff: (walkInId: string, staffId: string | "first-available") => void;
   onViewCustomer: (walkInId: string) => void;
}

export function WalkInQueue({ onAssignStaff, onViewCustomer }: WalkInQueueProps) {
   const { data: walkIns = [] } = useWalkIns();
   const { data: staff = [] } = useStaff();
   const [assigningWalkInId, setAssigningWalkInId] = useState<string | null>(null);
   const [selectedPreferredStaff, setSelectedPreferredStaff] = useState<string | undefined>();

   const handleOpenAssignment = (walkInId: string, preferredStaffId?: string) => {
      setAssigningWalkInId(walkInId);
      setSelectedPreferredStaff(preferredStaffId);
   };

   const handleAssign = (staffId: string | "first-available") => {
      if (assigningWalkInId) {
         onAssignStaff(assigningWalkInId, staffId);
         setAssigningWalkInId(null);
         setSelectedPreferredStaff(undefined);
      }
   };

   return (
      <>
         <Card className="h-fit lg:sticky lg:top-24">
            <CardHeader>
               <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                     <UserPlus className="h-5 w-5 text-primary" />
                     Walk-In Queue
                  </CardTitle>
                  <Badge variant="secondary">{walkIns.length}</Badge>
               </div>
            </CardHeader>
            <CardContent className="space-y-4">
               {walkIns.length === 0 ? (
                  <div className="py-8 text-center">
                     <UserPlus className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-50" />
                     <p className="text-sm text-muted-foreground">No walk-ins waiting</p>
                  </div>
               ) : (
                  <>
                     {walkIns.map((walkIn, index) => (
                        <div
                           key={walkIn.id}
                           className="p-3 rounded-lg border border-border bg-card hover:bg-accent/5 transition-colors"
                        >
                           <div className="space-y-2">
                              <div className="flex items-start justify-between gap-2">
                                 <div className="flex justify-between flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                       <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
                                          {index + 1}
                                       </div>
                                       <h4 className="font-semibold text-sm truncate">{walkIn.customerName}</h4>
                                       {walkIn.isNewClient && (
                                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 text-primary">
                                             NEW
                                          </Badge>
                                       )}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground pl-8">
                                       <Phone className="h-3 w-3" />
                                       <span>{walkIn.customerPhone}</span>
                                    </div>
                                 </div>
                              </div>

                              <div className="border-b-1 pb-2 pl-4 flex gap-2 items-center justify-between">
                                 <div className="flex items-center gap-2">
                                    <Clock className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                                    <p className="text-xs text-muted-foreground">Arrived at {walkIn.arrivedAt}</p>
                                 </div>
                                 <div
                                    className={cn(
                                       "flex items-center gap-2 px-2 py-1 rounded text-xs font-medium",
                                       walkIn.estimatedWait <= 15
                                          ? "bg-green-500/10 text-green-600 dark:text-green-500"
                                          : walkIn.estimatedWait <= 30
                                          ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-500"
                                          : "bg-red-500/10 text-red-600 dark:text-red-500"
                                    )}
                                 >
                                    <Clock className="h-3 w-3" />
                                    <span>~{walkIn.estimatedWait} min wait</span>
                                 </div>
                              </div>

                              <div className="flex justify-between items-center pl-4">
                                 <div className="flex items-center gap-2">
                                    <Star className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                                    <p className="text-xs font-medium">{walkIn.requestedService}</p>
                                 </div>
                                 {walkIn.preferredStaff && (
                                    <div className="pl-8">
                                       <div className="flex items-center gap-2 text-xs">
                                          <User className="h-3.5 w-3.5 text-muted-foreground" />
                                          <span className="text-muted-foreground">
                                             Prefers:{" "}
                                             <span className="font-medium text-foreground">
                                                {staff.find((s) => s.id === walkIn.preferredStaff)?.name}
                                             </span>
                                          </span>
                                       </div>
                                    </div>
                                 )}
                              </div>

                              <div className="flex gap-3 justify-between items-center border-border">
                                 <Button
                                    onClick={() => handleOpenAssignment(walkIn.id, walkIn.preferredStaff)}
                                    size="sm"
                                    className="flex-1 h-8 text-xs"
                                 >
                                    <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                                    Assign Staff
                                 </Button>

                                 <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onViewCustomer(walkIn.id)}
                                    className="flex-1 h-8 text-xs"
                                 >
                                    View Customer Info
                                 </Button>
                              </div>
                           </div>
                        </div>
                     ))}
                  </>
               )}
            </CardContent>
         </Card>

         <StaffAssignmentDrawer
            isOpen={assigningWalkInId !== null}
            onClose={() => {
               setAssigningWalkInId(null);
               setSelectedPreferredStaff(undefined);
            }}
            preferredStaffId={selectedPreferredStaff}
            onAssign={handleAssign}
         />
      </>
   );
}
