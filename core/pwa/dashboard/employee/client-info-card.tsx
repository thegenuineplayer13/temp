import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Calendar, AlertTriangle, Star, FileText } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import type { ClientHistory } from "@/features/core/types/types.dashboard-employee";

interface ClientInfoCardProps {
   clientHistory: ClientHistory;
}

export function ClientInfoCard({ clientHistory }: ClientInfoCardProps) {
   const isMobile = useIsMobile();

   if (isMobile) {
      return (
         <Card>
            <CardHeader className="pb-3">
               <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                     <User className="h-4 w-4 text-primary" />
                     Client Profile
                  </CardTitle>
                  <Badge variant="outline" className="font-semibold">
                     <Star className="h-3 w-3 mr-1 fill-yellow-500 text-yellow-500" />
                     {clientHistory.averageRating}
                  </Badge>
               </div>
            </CardHeader>
            <CardContent className="space-y-4">
               {/* Last Visit */}
               <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                     <Calendar className="h-3.5 w-3.5" />
                     Last Visit
                  </div>
                  <div className="pl-5">
                     <p className="text-sm font-semibold">{clientHistory.lastVisit.date}</p>
                     <p className="text-xs text-muted-foreground">{clientHistory.lastVisit.service}</p>
                  </div>
               </div>

               {/* Preferences */}
               {clientHistory.preferences.length > 0 && (
                  <div className="space-y-2">
                     <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        <Star className="h-3.5 w-3.5" />
                        Preferences
                     </div>
                     <div className="pl-5 space-y-1">
                        {clientHistory.preferences.map((pref, idx) => (
                           <div key={idx} className="flex items-start gap-2">
                              <div className="w-1 h-1 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                              <p className="text-xs text-foreground">{pref}</p>
                           </div>
                        ))}
                     </div>
                  </div>
               )}

               {/* Special Notes */}
               {clientHistory.specialNotes.length > 0 && (
                  <div className="space-y-2">
                     <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        <FileText className="h-3.5 w-3.5" />
                        Special Notes
                     </div>
                     <div className="pl-5 space-y-1">
                        {clientHistory.specialNotes.map((note, idx) => (
                           <div key={idx} className="flex items-start gap-2">
                              <div className="w-1 h-1 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                              <p className="text-xs text-foreground">{note}</p>
                           </div>
                        ))}
                     </div>
                  </div>
               )}

               {/* Past Issues */}
               {clientHistory.pastIssues.length > 0 && (
                  <div className="space-y-2 p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
                     <div className="flex items-center gap-2 text-xs font-medium text-red-600 dark:text-red-500 uppercase tracking-wide">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        Past Issues
                     </div>
                     <div className="space-y-1">
                        {clientHistory.pastIssues.map((issue, idx) => (
                           <div key={idx} className="flex items-start gap-2">
                              <div className="w-1 h-1 rounded-full bg-red-600 dark:bg-red-500 mt-1.5 flex-shrink-0" />
                              <p className="text-xs text-red-700 dark:text-red-400">{issue}</p>
                           </div>
                        ))}
                     </div>
                  </div>
               )}

               {/* Visit Count */}
               <div className="pt-3 border-t">
                  <p className="text-xs text-muted-foreground">
                     Total Visits: <span className="font-bold text-foreground">{clientHistory.totalVisits}</span>
                  </p>
               </div>
            </CardContent>
         </Card>
      );
   }

   return (
      <Card className="h-fit sticky top-6">
         <CardHeader>
            <div className="flex items-center justify-between">
               <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Client Profile
               </CardTitle>
               <Badge variant="outline" className="font-semibold">
                  <Star className="h-3 w-3 mr-1 fill-yellow-500 text-yellow-500" />
                  {clientHistory.averageRating}
               </Badge>
            </div>
         </CardHeader>
         <CardContent className="space-y-5">
            {/* Last Visit */}
            <div className="space-y-2">
               <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  <Calendar className="h-4 w-4" />
                  Last Visit
               </div>
               <div className="pl-6">
                  <p className="text-sm font-semibold">{clientHistory.lastVisit.date}</p>
                  <p className="text-sm text-muted-foreground">{clientHistory.lastVisit.service}</p>
               </div>
            </div>

            {/* Preferences */}
            {clientHistory.preferences.length > 0 && (
               <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                     <Star className="h-4 w-4" />
                     Preferences
                  </div>
                  <div className="pl-6 space-y-2">
                     {clientHistory.preferences.map((pref, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                           <p className="text-sm text-foreground leading-relaxed">{pref}</p>
                        </div>
                     ))}
                  </div>
               </div>
            )}

            {/* Special Notes */}
            {clientHistory.specialNotes.length > 0 && (
               <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                     <FileText className="h-4 w-4" />
                     Special Notes
                  </div>
                  <div className="pl-6 space-y-2">
                     {clientHistory.specialNotes.map((note, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                           <p className="text-sm text-foreground leading-relaxed">{note}</p>
                        </div>
                     ))}
                  </div>
               </div>
            )}

            {/* Past Issues */}
            {clientHistory.pastIssues.length > 0 && (
               <div className="space-y-2 p-4 bg-red-500/5 border border-red-500/20 rounded-lg">
                  <div className="flex items-center gap-2 text-xs font-medium text-red-600 dark:text-red-500 uppercase tracking-wide">
                     <AlertTriangle className="h-4 w-4" />
                     Past Issues
                  </div>
                  <div className="space-y-2">
                     {clientHistory.pastIssues.map((issue, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-red-600 dark:bg-red-500 mt-1.5 flex-shrink-0" />
                           <p className="text-sm text-red-700 dark:text-red-400 leading-relaxed">{issue}</p>
                        </div>
                     ))}
                  </div>
               </div>
            )}

            {/* Visit Count */}
            <div className="pt-4 border-t">
               <p className="text-sm text-muted-foreground">
                  Total Visits: <span className="font-bold text-foreground">{clientHistory.totalVisits}</span>
               </p>
            </div>
         </CardContent>
      </Card>
   );
}
