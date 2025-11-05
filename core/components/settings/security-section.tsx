import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Lock } from "lucide-react";
import { useSettingsStore } from "@/features/core/store/store.settings";

export function SecuritySection() {
   const { profile, updateProfile } = useSettingsStore();

   return (
      <Card className="p-4">
         <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
               <Lock className="w-5 h-5 text-primary" />
            </div>
            <div>
               <h2 className="text-lg font-semibold text-foreground">Security</h2>
               <p className="text-sm text-muted-foreground">Manage your account security</p>
            </div>
         </div>

         <div className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
               Change Password
            </Button>

            <div className="flex items-center justify-between py-3 border-t border-border">
               <div className="space-y-0.5">
                  <Label htmlFor="twoFactor" className="text-base cursor-pointer">
                     Two-Factor Authentication
                  </Label>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
               </div>
               <Switch
                  id="twoFactor"
                  checked={profile.security.twoFactor}
                  onCheckedChange={(checked) =>
                     updateProfile({
                        security: { ...profile.security, twoFactor: checked },
                     })
                  }
               />
            </div>

            <Button variant="destructive" className="w-full">
               Delete Account
            </Button>
         </div>
      </Card>
   );
}
