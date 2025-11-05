import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { User, Calendar, Star, FileText, AlertTriangle, Phone, Mail } from "lucide-react";
import type { ClientHistory } from "@/features/core/types/types.dashboard-employee";

interface ClientProfileDrawerProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   clientHistory: ClientHistory;
}

export function ClientProfileDrawer({ open, onOpenChange, clientHistory }: ClientProfileDrawerProps) {
   return (
      <Drawer open={open} onOpenChange={onOpenChange}>
         <DrawerContent className="max-h-[85vh]">
            <DrawerHeader>
               <div className="flex items-center justify-between">
                  <DrawerTitle className="text-xl">{clientHistory.clientName}</DrawerTitle>
                  <Badge variant="outline" className="font-semibold">
                     <Star className="h-3 w-3 mr-1 fill-yellow-500 text-yellow-500" />
                     {clientHistory.averageRating}
                  </Badge>
               </div>
            </DrawerHeader>

            <div className="overflow-y-auto px-4 pb-8 space-y-4">
               {/* Contact Info */}
               {(clientHistory.clientPhone || clientHistory.clientEmail) && (
                  <div className="space-y-2">
                     {clientHistory.clientPhone && (
                        <Button variant="outline" className="w-full justify-start gap-2" asChild>
                           <a href={`tel:${clientHistory.clientPhone}`}>
                              <Phone className="h-4 w-4" />
                              {clientHistory.clientPhone}
                           </a>
                        </Button>
                     )}
                     {clientHistory.clientEmail && (
                        <Button variant="outline" className="w-full justify-start gap-2" asChild>
                           <a href={`mailto:${clientHistory.clientEmail}`}>
                              <Mail className="h-4 w-4" />
                              {clientHistory.clientEmail}
                           </a>
                        </Button>
                     )}
                  </div>
               )}

               <Separator />

               {/* Visit Stats */}
               <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-muted/50 border">
                     <div className="flex items-center gap-2 mb-1">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground uppercase">Total Visits</span>
                     </div>
                     <p className="text-2xl font-bold">{clientHistory.totalVisits}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 border">
                     <div className="flex items-center gap-2 mb-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-medium text-muted-foreground uppercase">Avg Rating</span>
                     </div>
                     <p className="text-2xl font-bold">{clientHistory.averageRating}</p>
                  </div>
               </div>

               {/* Last Visit */}
               <div className="p-4 rounded-lg bg-accent/5 border">
                  <div className="flex items-center gap-2 mb-2">
                     <Calendar className="h-4 w-4 text-muted-foreground" />
                     <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Last Visit</span>
                  </div>
                  <p className="text-sm font-semibold mb-0.5">{clientHistory.lastVisit.date}</p>
                  <p className="text-sm text-muted-foreground">{clientHistory.lastVisit.service}</p>
               </div>

               {/* Preferences */}
               {clientHistory.preferences.length > 0 && (
                  <div className="space-y-2">
                     <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-primary" />
                        <span className="text-sm font-semibold uppercase tracking-wide">Preferences</span>
                     </div>
                     <div className="space-y-2 pl-6">
                        {clientHistory.preferences.map((pref, idx) => (
                           <div key={idx} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                              <p className="text-sm text-foreground leading-relaxed">{pref}</p>
                           </div>
                        ))}
                     </div>
                  </div>
               )}

               {/* Special Notes */}
               {clientHistory.specialNotes.length > 0 && (
                  <div className="space-y-2">
                     <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-accent" />
                        <span className="text-sm font-semibold uppercase tracking-wide">Special Notes</span>
                     </div>
                     <div className="space-y-2 pl-6">
                        {clientHistory.specialNotes.map((note, idx) => (
                           <div key={idx} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                              <p className="text-sm text-foreground leading-relaxed">{note}</p>
                           </div>
                        ))}
                     </div>
                  </div>
               )}

               {/* Past Issues */}
               {clientHistory.pastIssues.length > 0 && (
                  <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20 space-y-2">
                     <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-500" />
                        <span className="text-sm font-semibold text-red-600 dark:text-red-500 uppercase tracking-wide">
                           Past Issues
                        </span>
                     </div>
                     <div className="space-y-2">
                        {clientHistory.pastIssues.map((issue, idx) => (
                           <div key={idx} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-red-600 dark:bg-red-500 mt-2 flex-shrink-0" />
                              <p className="text-sm text-red-700 dark:text-red-400 leading-relaxed">{issue}</p>
                           </div>
                        ))}
                     </div>
                  </div>
               )}
            </div>
         </DrawerContent>
      </Drawer>
   );
}
