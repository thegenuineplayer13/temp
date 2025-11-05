import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Building2, MapPin, Clock } from "lucide-react";
import { useSettingsStore } from "@/features/core/store/store.settings";
import { useBusinessTypes, useWorkingHours } from "@/features/core/hooks/queries/queries.settings";

export function BusinessSection() {
   const { profile, updateProfile } = useSettingsStore();
   const { data: businessTypes = [] } = useBusinessTypes();
   const { data: workingHours = [] } = useWorkingHours();

   return (
      <Card className="p-4">
         <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
               <Building2 className="w-5 h-5 text-primary" />
            </div>
            <div>
               <h2 className="text-lg font-semibold text-foreground">Business Details</h2>
               <p className="text-sm text-muted-foreground">Manage your business information</p>
            </div>
         </div>

         <div className="space-y-4">
            <div className="space-y-2">
               <Label htmlFor="businessName">Business Name</Label>
               <Input
                  id="businessName"
                  value={profile.businessName}
                  onChange={(e) => updateProfile({ businessName: e.target.value })}
                  placeholder="Your Business Name"
               />
            </div>

            <div className="space-y-2">
               <Label htmlFor="businessType">Service Type</Label>
               <Select value={profile.businessType} onValueChange={(value) => updateProfile({ businessType: value as any })}>
                  <SelectTrigger>
                     <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                     {businessTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                           {type.label}
                        </SelectItem>
                     ))}
                  </SelectContent>
               </Select>
            </div>

            <div className="space-y-2">
               <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Address
               </Label>
               <Input
                  id="address"
                  value={profile.address}
                  onChange={(e) => updateProfile({ address: e.target.value })}
                  placeholder="123 Main St, City, State"
               />
            </div>

            <div className="space-y-2">
               <Label className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Working Hours
               </Label>
               <div className="grid sm:grid-cols-2 gap-4">
                  <Select
                     value={profile.workingHours.start}
                     onValueChange={(value) =>
                        updateProfile({
                           workingHours: { ...profile.workingHours, start: value },
                        })
                     }
                  >
                     <SelectTrigger>
                        <SelectValue placeholder="Start time" />
                     </SelectTrigger>
                     <SelectContent>
                        {workingHours.map((time) => (
                           <SelectItem key={time} value={time}>
                              {time}
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>
                  <Select
                     value={profile.workingHours.end}
                     onValueChange={(value) =>
                        updateProfile({
                           workingHours: { ...profile.workingHours, end: value },
                        })
                     }
                  >
                     <SelectTrigger>
                        <SelectValue placeholder="End time" />
                     </SelectTrigger>
                     <SelectContent>
                        {workingHours.map((time) => (
                           <SelectItem key={time} value={time}>
                              {time}
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>
               </div>
            </div>

            <div className="space-y-2">
               <Label htmlFor="description">Business Description</Label>
               <Textarea
                  id="description"
                  value={profile.businessDescription}
                  onChange={(e) => updateProfile({ businessDescription: e.target.value })}
                  placeholder="Describe your business and services..."
                  rows={4}
               />
            </div>
         </div>
      </Card>
   );
}
