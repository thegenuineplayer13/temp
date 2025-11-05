import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Save, User, Building2, Bell, Palette, Lock } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSettingsStore } from "@/features/core/store/store.settings";
import { useProfile } from "@/features/core/hooks/queries/queries.settings";
import { ProfileSection } from "../components/settings/profile-section";
import { BusinessSection } from "../components/settings/business-section";
import { NotificationsSection } from "../components/settings/notifications-section";
import { AppearanceSection } from "../components/settings/appearance-section";
import { SecuritySection } from "../components/settings/security-section";
import { cn } from "@/lib/utils";

const sections = [
   { id: "profile", label: "Profile", icon: User, component: ProfileSection },
   { id: "business", label: "Business", icon: Building2, component: BusinessSection },
   { id: "notifications", label: "Notifications", icon: Bell, component: NotificationsSection },
   { id: "appearance", label: "Appearance", icon: Palette, component: AppearanceSection },
   { id: "security", label: "Security", icon: Lock, component: SecuritySection },
];

export default function SettingsPage() {
   const isMobile = useIsMobile();
   const { activeSection, setActiveSection, resetProfile } = useSettingsStore();
   const { data: profileData } = useProfile();

   useEffect(() => {
      if (profileData) {
         resetProfile(profileData);
      }
   }, [profileData, resetProfile]);

   const handleSave = () => {
      console.log("Saving profile");
   };

   const ActiveComponent = sections.find((s) => s.id === activeSection)?.component || ProfileSection;

   if (isMobile) {
      return (
         <div className="h-full flex flex-col justify-between bg-background">
            <div>
               <div className="sticky top-0 z-10 bg-card border-b border-border">
                  <div className="px-4 py-4">
                     <h1 className="text-2xl font-bold text-foreground">Settings</h1>
                     <p className="text-sm text-muted-foreground mt-1">Manage your account and business preferences</p>
                  </div>

                  <div className="flex gap-2 px-4 pb-2">
                     {sections.map((section) => {
                        const Icon = section.icon;
                        return (
                           <button
                              key={section.id}
                              onClick={() => setActiveSection(section.id)}
                              className={cn(
                                 "flex-1 flex flex-col items-center gap-1.5 py-2 rounded-lg transition-colors",
                                 activeSection === section.id
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-muted"
                              )}
                           >
                              <Icon className="w-5 h-5" />
                           </button>
                        );
                     })}
                  </div>
               </div>

               <div className="p-4">
                  <ActiveComponent />
               </div>
            </div>

            <div className="left-0 right-0 bg-background border-t border-border p-4">
               <Button onClick={handleSave} className="w-full" size="lg">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
               </Button>
            </div>
         </div>
      );
   }

   return (
      <div className="bg-background">
         <div className="sticky top-0 z-10 bg-card border-b border-border">
            <div className="max-w-7xl mx-auto px-6 py-4">
               <h1 className="text-2xl font-bold text-foreground">Settings</h1>
               <p className="text-sm text-muted-foreground mt-1">Manage your account and business preferences</p>
            </div>
         </div>

         <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex gap-2 mb-6 p-1 bg-muted rounded-lg">
               {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                     <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={cn(
                           "flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md transition-all",
                           activeSection === section.id
                              ? "bg-background text-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                        )}
                     >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{section.label}</span>
                     </button>
                  );
               })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               <div className="lg:col-span-2">
                  <ActiveComponent />
               </div>

               <div className="lg:col-span-2 flex justify-end">
                  <Button onClick={handleSave} size="lg" className="min-w-[200px]">
                     <Save className="w-4 h-4 mr-2" />
                     Save Changes
                  </Button>
               </div>
            </div>
         </div>
      </div>
   );
}
