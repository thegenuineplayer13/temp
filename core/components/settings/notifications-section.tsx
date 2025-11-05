import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bell } from "lucide-react";
import { useSettingsStore } from "@/features/core/store/store.settings";

export function NotificationsSection() {
   const { profile, updateProfile } = useSettingsStore();

   return (
      <Card className="p-4">
         <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
               <Bell className="w-5 h-5 text-primary" />
            </div>
            <div>
               <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
               <p className="text-sm text-muted-foreground">Manage your notification preferences</p>
            </div>
         </div>

         <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-border">
               <div className="space-y-0.5">
                  <Label htmlFor="emailNotifications" className="text-base cursor-pointer">
                     Email Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">Receive booking updates via email</p>
               </div>
               <Switch
                  id="emailNotifications"
                  checked={profile.notifications.email}
                  onCheckedChange={(checked) =>
                     updateProfile({
                        notifications: { ...profile.notifications, email: checked },
                     })
                  }
               />
            </div>

            <div className="flex items-center justify-between py-3 border-b border-border">
               <div className="space-y-0.5">
                  <Label htmlFor="smsNotifications" className="text-base cursor-pointer">
                     SMS Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">Get text messages for appointments</p>
               </div>
               <Switch
                  id="smsNotifications"
                  checked={profile.notifications.sms}
                  onCheckedChange={(checked) =>
                     updateProfile({
                        notifications: { ...profile.notifications, sms: checked },
                     })
                  }
               />
            </div>

            <div className="flex items-center justify-between py-3 border-b border-border">
               <div className="space-y-0.5">
                  <Label htmlFor="pushNotifications" className="text-base cursor-pointer">
                     Push Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">Receive push notifications on your device</p>
               </div>
               <Switch
                  id="pushNotifications"
                  checked={profile.notifications.push}
                  onCheckedChange={(checked) =>
                     updateProfile({
                        notifications: { ...profile.notifications, push: checked },
                     })
                  }
               />
            </div>

            <div className="flex items-center justify-between py-3">
               <div className="space-y-0.5">
                  <Label htmlFor="marketingEmails" className="text-base cursor-pointer">
                     Marketing Emails
                  </Label>
                  <p className="text-sm text-muted-foreground">Receive tips and promotional content</p>
               </div>
               <Switch
                  id="marketingEmails"
                  checked={profile.notifications.marketing}
                  onCheckedChange={(checked) =>
                     updateProfile({
                        notifications: { ...profile.notifications, marketing: checked },
                     })
                  }
               />
            </div>
         </div>
      </Card>
   );
}
