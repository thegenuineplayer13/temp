import { useMemo, useEffect } from "react";
import { useFrontDeskStore } from "@/features/core/store/store.front-desk";
import { useEmployees } from "@/features/core/hooks/queries/queries.staff";
import { useServiceRelationships } from "@/features/core/hooks/queries/queries.services";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { User, Users, CheckCircle2, XCircle } from "lucide-react";
import { findEmployeesForAllServices } from "@/features/core/lib/booking-utils";

export function CreateAppointmentStepAssignmentMode() {
   const { bookingData, setAssignmentMode } = useFrontDeskStore();
   const { data: allEmployees = [] } = useEmployees();
   const { data: serviceRelationships = {} } = useServiceRelationships();

   // Filter only active employees
   const employees = useMemo(
      () => allEmployees.filter((emp) => emp.status === "active"),
      [allEmployees]
   );

   // Find employees who can handle all services
   const employeesForAll = useMemo(
      () => findEmployeesForAllServices(employees, bookingData.serviceCart, serviceRelationships),
      [employees, bookingData.serviceCart, serviceRelationships]
   );

   const canUseSingleMode = employeesForAll.length > 0;

   // Auto-select mode if only one option available
   useEffect(() => {
      if (bookingData.assignmentMode === "auto") {
         if (canUseSingleMode) {
            setAssignmentMode("single");
         } else {
            setAssignmentMode("multiple");
         }
      }
   }, [canUseSingleMode, bookingData.assignmentMode, setAssignmentMode]);

   return (
      <div className="space-y-6">
         <div className="space-y-2">
            <h3 className="font-semibold text-lg">How would you like to assign staff?</h3>
            <p className="text-sm text-muted-foreground">
               Choose whether one staff member handles all services or different staff members for each service
            </p>
         </div>

         <RadioGroup
            value={bookingData.assignmentMode === "auto" ? (canUseSingleMode ? "single" : "multiple") : bookingData.assignmentMode}
            onValueChange={(value) => setAssignmentMode(value as "single" | "multiple")}
            className="space-y-3"
         >
            {/* Single staff option */}
            <Card
               className={`relative ${
                  !canUseSingleMode ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:border-primary/50"
               }`}
            >
               <label
                  className={`flex items-start gap-4 p-4 ${canUseSingleMode ? "cursor-pointer" : "cursor-not-allowed"}`}
               >
                  <RadioGroupItem value="single" id="single" disabled={!canUseSingleMode} className="mt-1" />

                  <div className="flex-1 space-y-3">
                     <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/10">
                           <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                           <Label htmlFor="single" className={`text-base font-semibold ${!canUseSingleMode ? "cursor-not-allowed" : "cursor-pointer"}`}>
                              Single Staff Member
                           </Label>
                           <p className="text-sm text-muted-foreground">
                              One employee handles all services back-to-back
                           </p>
                        </div>
                        {canUseSingleMode ? (
                           <Badge variant="secondary" className="gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              {employeesForAll.length} available
                           </Badge>
                        ) : (
                           <Badge variant="destructive" className="gap-1">
                              <XCircle className="h-3 w-3" />
                              Not available
                           </Badge>
                        )}
                     </div>

                     <div className="pl-11 space-y-2">
                        <div className="text-sm">
                           <strong>Pros:</strong>
                           <ul className="list-disc list-inside text-muted-foreground mt-1 space-y-1">
                              <li>Continuous session with same staff member</li>
                              <li>Better for related services (e.g., haircut + styling)</li>
                              <li>Easier scheduling - one time block</li>
                           </ul>
                        </div>
                        {!canUseSingleMode && (
                           <div className="text-sm text-destructive">
                              No staff member has all required specializations for the selected services
                           </div>
                        )}
                     </div>
                  </div>
               </label>
            </Card>

            {/* Multiple staff option */}
            <Card className="cursor-pointer hover:border-primary/50">
               <label className="flex items-start gap-4 p-4 cursor-pointer">
                  <RadioGroupItem value="multiple" id="multiple" className="mt-1" />

                  <div className="flex-1 space-y-3">
                     <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-green-500/10">
                           <Users className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                           <Label htmlFor="multiple" className="text-base font-semibold cursor-pointer">
                              Different Staff per Service
                           </Label>
                           <p className="text-sm text-muted-foreground">
                              Assign specialized staff to each service
                           </p>
                        </div>
                        <Badge variant="secondary" className="gap-1">
                           <CheckCircle2 className="h-3 w-3" />
                           Always available
                        </Badge>
                     </div>

                     <div className="pl-11 space-y-2">
                        <div className="text-sm">
                           <strong>Pros:</strong>
                           <ul className="list-disc list-inside text-muted-foreground mt-1 space-y-1">
                              <li>Appointments can run in parallel (faster completion)</li>
                              <li>Each service handled by specialized staff</li>
                              <li>More flexible scheduling options</li>
                           </ul>
                        </div>
                     </div>
                  </div>
               </label>
            </Card>
         </RadioGroup>

         {bookingData.serviceCart.length > 0 && (
            <div className="p-3 bg-muted rounded-lg text-sm">
               <p className="font-medium mb-2">Selected Services:</p>
               <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  {bookingData.serviceCart.map((service) => (
                     <li key={service.serviceId}>
                        {service.serviceName} ({service.duration}min)
                     </li>
                  ))}
               </ul>
            </div>
         )}
      </div>
   );
}
