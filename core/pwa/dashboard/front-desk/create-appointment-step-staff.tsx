import { useEffect } from "react";
import { useFrontDeskStore } from "@/features/core/store/store.front-desk";
import { useEmployees } from "@/features/core/hooks/queries/queries.staff";
import { useServiceRelationships } from "@/features/core/hooks/queries/queries.services";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Users, User, Sparkles, Clock, ArrowRight } from "lucide-react";
import {
   findEmployeesForAllServices,
   findEmployeesForService,
   suggestAssignmentMode,
} from "@/features/core/lib/booking-utils";
import type { Employee } from "@/features/core/types/types.staff";

export function CreateAppointmentStepStaff() {
   const {
      bookingData,
      setAssignmentMode,
      setSingleStaff,
      updateServiceAssignment,
      updateBookingData,
   } = useFrontDeskStore();

   const { data: allEmployees = [] } = useEmployees();
   const { data: serviceRelationships = {} } = useServiceRelationships();

   // Filter only active employees
   const employees = allEmployees.filter((emp) => emp.status === "active");

   // Find employees who can handle all services
   const employeesForAll = findEmployeesForAllServices(employees, bookingData.serviceCart, serviceRelationships);

   // Suggest assignment mode on mount
   useEffect(() => {
      if (bookingData.assignmentMode === "auto") {
         const suggested = suggestAssignmentMode(employees, bookingData.serviceCart, serviceRelationships);
         setAssignmentMode(suggested);
      }
   }, []);

   const handleModeChange = (mode: "single" | "multiple") => {
      setAssignmentMode(mode);
      // Clear previous assignments
      setSingleStaff("", "");
      bookingData.serviceAssignments.forEach((assignment) => {
         updateServiceAssignment(assignment.serviceId, { staffId: null, staffName: null });
      });
   };

   const handleSelectSingleStaff = (employee: Employee) => {
      setSingleStaff(employee.id, employee.name);
   };

   const handleSelectStaffForService = (serviceId: string, employee: Employee) => {
      updateServiceAssignment(serviceId, {
         staffId: employee.id,
         staffName: employee.name,
      });
   };

   const renderSingleStaffMode = () => {
      if (employeesForAll.length === 0) {
         return (
            <div className="text-center py-8 text-muted-foreground">
               <p className="font-medium">No single employee can handle all selected services</p>
               <p className="text-sm mt-1">Please use "Different Staff per Service" mode</p>
            </div>
         );
      }

      return (
         <ScrollArea className="h-[300px]">
            <div className="space-y-2 p-2">
               {employeesForAll.map((employee) => (
                  <Card
                     key={employee.id}
                     className={`p-3 cursor-pointer transition-colors hover:bg-accent ${
                        bookingData.singleStaffId === employee.id ? "bg-primary/10 border-primary" : ""
                     }`}
                     onClick={() => handleSelectSingleStaff(employee)}
                  >
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                           <User className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                           <div className="flex items-center gap-2">
                              <span className="font-medium">{employee.name}</span>
                              <Badge variant="outline" className="text-xs">
                                 {employee.role}
                              </Badge>
                           </div>
                           <p className="text-xs text-muted-foreground">
                              Can handle all {bookingData.serviceCart.length} services
                           </p>
                        </div>
                        {bookingData.singleStaffId === employee.id && (
                           <Badge className="bg-primary">Selected</Badge>
                        )}
                     </div>
                  </Card>
               ))}
            </div>
         </ScrollArea>
      );
   };

   const renderMultipleStaffMode = () => {
      return (
         <ScrollArea className="h-[350px]">
            <div className="space-y-4 p-2">
               {bookingData.serviceAssignments.map((assignment, index) => {
                  const availableStaff = findEmployeesForService(
                     employees,
                     assignment.serviceId,
                     serviceRelationships,
                  );

                  return (
                     <div key={assignment.serviceId}>
                        {index > 0 && <Separator className="my-4" />}

                        <div className="space-y-3">
                           {/* Service header */}
                           <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{assignment.serviceName}</span>
                              <span className="text-sm text-muted-foreground">({assignment.duration}min)</span>
                              {assignment.staffId && (
                                 <Badge variant="secondary" className="ml-auto">
                                    Assigned
                                 </Badge>
                              )}
                           </div>

                           {/* Staff selection */}
                           {availableStaff.length === 0 ? (
                              <Card className="p-3 bg-yellow-500/10 border-yellow-500/20">
                                 <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                    No available staff for this service
                                 </p>
                              </Card>
                           ) : (
                              <div className="space-y-2">
                                 {availableStaff.map((employee) => (
                                    <Card
                                       key={employee.id}
                                       className={`p-2 cursor-pointer transition-colors hover:bg-accent ${
                                          assignment.staffId === employee.id ? "bg-primary/10 border-primary" : ""
                                       }`}
                                       onClick={() => handleSelectStaffForService(assignment.serviceId, employee)}
                                    >
                                       <div className="flex items-center gap-2">
                                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                             <User className="h-4 w-4 text-primary" />
                                          </div>
                                          <div className="flex-1 min-w-0">
                                             <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium truncate">{employee.name}</span>
                                                <Badge variant="outline" className="text-xs shrink-0">
                                                   {employee.role}
                                                </Badge>
                                             </div>
                                          </div>
                                          {assignment.staffId === employee.id && (
                                             <Badge className="bg-primary shrink-0 text-xs">Selected</Badge>
                                          )}
                                       </div>
                                    </Card>
                                 ))}
                              </div>
                           )}
                        </div>
                     </div>
                  );
               })}
            </div>
         </ScrollArea>
      );
   };

   return (
      <div className="space-y-4">
         {/* Info card */}
         <Card className="p-4 bg-blue-500/10 border-blue-500/20">
            <div className="flex items-start gap-3">
               <Sparkles className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
               <div className="space-y-1">
                  <p className="text-sm font-medium">Smart Staff Assignment</p>
                  <p className="text-xs text-muted-foreground">
                     {employeesForAll.length > 0 ? (
                        <>
                           <strong>{employeesForAll.length}</strong> staff member
                           {employeesForAll.length > 1 ? "s" : ""} can handle all your selected services.
                           Services will be scheduled back-to-back.
                        </>
                     ) : (
                        <>
                           Your selected services require different staff members. Appointments can be scheduled in
                           parallel for faster service.
                        </>
                     )}
                  </p>
               </div>
            </div>
         </Card>

         {/* Assignment mode selection */}
         <div className="space-y-3">
            <Label className="text-base font-semibold">Assignment Mode</Label>

            <RadioGroup
               value={bookingData.assignmentMode}
               onValueChange={(value) => handleModeChange(value as "single" | "multiple")}
               className="space-y-2"
            >
               <Card className="p-3">
                  <div className="flex items-start gap-3">
                     <RadioGroupItem value="single" id="single" className="mt-1" />
                     <Label htmlFor="single" className="cursor-pointer flex-1">
                        <div className="space-y-1">
                           <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              <span className="font-medium">Single Staff Member</span>
                              {employeesForAll.length > 0 && (
                                 <Badge variant="secondary" className="text-xs">
                                    {employeesForAll.length} available
                                 </Badge>
                              )}
                           </div>
                           <p className="text-xs text-muted-foreground">
                              One employee handles all services sequentially (back-to-back)
                           </p>
                        </div>
                     </Label>
                  </div>
               </Card>

               <Card className="p-3">
                  <div className="flex items-start gap-3">
                     <RadioGroupItem value="multiple" id="multiple" className="mt-1" />
                     <Label htmlFor="multiple" className="cursor-pointer flex-1">
                        <div className="space-y-1">
                           <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              <span className="font-medium">Different Staff per Service</span>
                           </div>
                           <p className="text-xs text-muted-foreground">
                              Assign different employees to each service (can run in parallel)
                           </p>
                        </div>
                     </Label>
                  </div>
               </Card>
            </RadioGroup>
         </div>

         <Separator />

         {/* Staff selection based on mode */}
         <div className="space-y-3">
            <Label className="text-base font-semibold">
               {bookingData.assignmentMode === "single" ? "Select Staff Member" : "Assign Staff to Services"}
            </Label>

            {bookingData.assignmentMode === "single" ? renderSingleStaffMode() : renderMultipleStaffMode()}
         </div>

         {/* Help text */}
         <p className="text-xs text-muted-foreground text-center">
            {bookingData.assignmentMode === "single"
               ? "Select one staff member to handle all services"
               : "Assign a staff member to each service"}
         </p>
      </div>
   );
}
