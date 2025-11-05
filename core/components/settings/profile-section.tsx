import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, Mail, Phone } from "lucide-react";
import { useSettingsStore } from "@/features/core/store/store.settings";

export function ProfileSection() {
   const { profile, updateProfile } = useSettingsStore();

   return (
      <Card className="p-4">
         <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
               <User className="w-5 h-5 text-primary" />
            </div>
            <div>
               <h2 className="text-lg font-semibold text-foreground">Profile Information</h2>
               <p className="text-sm text-muted-foreground">Update your personal details</p>
            </div>
         </div>

         <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
               <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                     id="firstName"
                     value={profile.firstName}
                     onChange={(e) => updateProfile({ firstName: e.target.value })}
                     placeholder="Enter first name"
                  />
               </div>
               <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                     id="lastName"
                     value={profile.lastName}
                     onChange={(e) => updateProfile({ lastName: e.target.value })}
                     placeholder="Enter last name"
                  />
               </div>
            </div>

            <div className="space-y-2">
               <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
               </Label>
               <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => updateProfile({ email: e.target.value })}
                  placeholder="your@email.com"
               />
            </div>

            <div className="space-y-2">
               <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone
               </Label>
               <Input
                  id="phone"
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => updateProfile({ phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
               />
            </div>

            <div className="space-y-2">
               <Label htmlFor="bio">Bio</Label>
               <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => updateProfile({ bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  rows={3}
               />
            </div>
         </div>
      </Card>
   );
}
