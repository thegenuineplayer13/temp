import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Palette } from "lucide-react";
import { useSettingsStore } from "@/features/core/store/store.settings";

export function AppearanceSection() {
   const { profile, updateProfile } = useSettingsStore();

   return (
      <Card className="p-4">
         <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
               <Palette className="w-5 h-5 text-primary" />
            </div>
            <div>
               <h2 className="text-lg font-semibold text-foreground">Appearance</h2>
               <p className="text-sm text-muted-foreground">Customize your app experience</p>
            </div>
         </div>

         <div className="space-y-4">
            <div className="space-y-2">
               <Label htmlFor="theme">Theme</Label>
               <Select
                  value={profile.appearance.theme}
                  onValueChange={(value) =>
                     updateProfile({
                        appearance: { ...profile.appearance, theme: value as any },
                     })
                  }
               >
                  <SelectTrigger>
                     <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="light">Light</SelectItem>
                     <SelectItem value="dark">Dark</SelectItem>
                     <SelectItem value="system">System</SelectItem>
                  </SelectContent>
               </Select>
            </div>

            <div className="space-y-2">
               <Label htmlFor="language">Language</Label>
               <Select
                  value={profile.appearance.language}
                  onValueChange={(value) =>
                     updateProfile({
                        appearance: { ...profile.appearance, language: value as any },
                     })
                  }
               >
                  <SelectTrigger>
                     <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="en">English</SelectItem>
                     <SelectItem value="es">Spanish</SelectItem>
                     <SelectItem value="fr">French</SelectItem>
                     <SelectItem value="de">German</SelectItem>
                  </SelectContent>
               </Select>
            </div>
         </div>
      </Card>
   );
}
