import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UserPlus, Phone, Mail, FileText } from "lucide-react";
import { useFrontDeskStore } from "@/features/core/store/store.front-desk";
import { newCustomerSchema } from "@/features/core/schemas/schemas.dashboard-front-desk";
import type { NewCustomer } from "@/features/core/types/types.dashboard-front-desk";

interface RegisterCustomerDialogProps {
   onRegister: (customerData: NewCustomer) => void;
}

export function RegisterCustomerDialog({ onRegister }: RegisterCustomerDialogProps) {
   const { isRegisterDialogOpen, closeRegisterDialog } = useFrontDeskStore();

   const {
      register,
      handleSubmit,
      reset,
      formState: { errors, isValid },
   } = useForm<NewCustomer>({
      resolver: zodResolver(newCustomerSchema),
      mode: "onChange",
   });

   const onSubmit = (data: NewCustomer) => {
      onRegister(data);
      handleClose();
   };

   const handleClose = () => {
      reset();
      closeRegisterDialog();
   };

   return (
      <Dialog open={isRegisterDialogOpen} onOpenChange={handleClose}>
         <DialogContent className="max-w-md">
            <DialogHeader>
               <DialogTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-primary" />
                  Register New Customer
               </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
               <div className="space-y-2">
                  <Label htmlFor="name">
                     Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                     id="name"
                     type="text"
                     placeholder="John Smith"
                     {...register("name")}
                     className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
               </div>

               <div className="space-y-2">
                  <Label htmlFor="phone">
                     Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                     <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                     <Input
                        id="phone"
                        type="tel"
                        placeholder="(555) 123-4567"
                        {...register("phone")}
                        className={errors.phone ? "border-red-500 pl-10" : "pl-10"}
                     />
                  </div>
                  {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
               </div>

               <div className="space-y-2">
                  <Label htmlFor="email">
                     Email Address <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                     <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                     <Input
                        id="email"
                        type="email"
                        placeholder="john.smith@email.com"
                        {...register("email")}
                        className={errors.email ? "border-red-500 pl-10" : "pl-10"}
                     />
                  </div>
                  {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
               </div>

               <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <div className="relative">
                     <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                     <Textarea
                        id="notes"
                        placeholder="Any preferences, allergies, or special notes..."
                        {...register("notes")}
                        rows={3}
                        className="pl-10"
                     />
                  </div>
               </div>

               <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                  <p className="text-xs text-blue-700 dark:text-blue-400">
                     The customer will receive a welcome SMS/email with their profile details.
                  </p>
               </div>

               <div className="flex gap-2 pt-2">
                  <Button type="submit" className="flex-1" disabled={!isValid}>
                     <UserPlus className="h-4 w-4 mr-2" />
                     Register Customer
                  </Button>
                  <Button type="button" variant="outline" onClick={handleClose}>
                     Cancel
                  </Button>
               </div>
            </form>
         </DialogContent>
      </Dialog>
   );
}
