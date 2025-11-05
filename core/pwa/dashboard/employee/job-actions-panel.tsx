import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Flag, TrendingUp, Camera, CheckCircle2, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { AddNoteDialog } from "./add-note-dialog";
import { PhotoUpload } from "./photo-upload";
import { useIsMobile } from "@/hooks/use-mobile";
import type { NoteType } from "@/features/core/types/types.dashboard-employee";

export function JobActionsPanel() {
   const isMobile = useIsMobile();
   const [noteDialogOpen, setNoteDialogOpen] = useState(false);
   const [noteType, setNoteType] = useState<NoteType>("job");
   const [photoUploadOpen, setPhotoUploadOpen] = useState(false);
   const [fabOpen, setFabOpen] = useState(false);

   const openNoteDialog = (type: NoteType) => {
      setNoteType(type);
      setNoteDialogOpen(true);
      setFabOpen(false);
   };

   const openPhotoUpload = () => {
      setPhotoUploadOpen(true);
      setFabOpen(false);
   };

   const actions = [
      {
         icon: FileText,
         label: "Add Note",
         color: "text-primary",
         bgColor: "bg-primary/10 hover:bg-primary/20",
         onClick: () => openNoteDialog("job"),
      },
      {
         icon: CheckCircle2,
         label: "Completion",
         color: "text-primary",
         bgColor: "bg-primary/10 hover:bg-primary/20",
         onClick: () => openNoteDialog("completion"),
      },
      {
         icon: Camera,
         label: "Photos",
         color: "text-accent",
         bgColor: "bg-accent/10 hover:bg-accent/20",
         onClick: openPhotoUpload,
      },
      {
         icon: Flag,
         label: "Flag Issue",
         color: "text-red-600 dark:text-red-500",
         bgColor: "bg-red-500/10 hover:bg-red-500/20",
         onClick: () => openNoteDialog("issue"),
      },
      {
         icon: TrendingUp,
         label: "Upsell",
         color: "text-green-600 dark:text-green-500",
         bgColor: "bg-green-500/10 hover:bg-green-500/20",
         onClick: () => openNoteDialog("upsell"),
      },
   ];

   if (isMobile) {
      return (
         <>
            <div className="fixed bottom-6 right-6 z-50">
               <div
                  className={cn(
                     "absolute bottom-16 right-0 space-y-3 transition-all duration-300",
                     fabOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"
                  )}
               >
                  {actions.map((action, index) => (
                     <div
                        key={action.label}
                        className="flex items-center gap-3 justify-end"
                        style={{
                           transitionDelay: fabOpen ? `${index * 50}ms` : "0ms",
                        }}
                     >
                        <span
                           className={cn(
                              "text-sm font-medium bg-background px-3 py-1.5 rounded-full shadow-lg border whitespace-nowrap transition-all",
                              fabOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                           )}
                        >
                           {action.label}
                        </span>
                        <button
                           onClick={action.onClick}
                           className={cn(
                              "rounded-full p-3 shadow-lg transition-all hover:scale-110",
                              action.bgColor,
                              "border-2 border-background"
                           )}
                        >
                           <action.icon className={cn("h-5 w-5", action.color)} />
                        </button>
                     </div>
                  ))}
               </div>

               <button
                  onClick={() => setFabOpen(!fabOpen)}
                  className={cn(
                     "rounded-full p-4 shadow-2xl transition-all hover:scale-110 border-2 border-background",
                     fabOpen ? "bg-muted rotate-45" : "bg-primary hover:bg-primary/90"
                  )}
               >
                  {fabOpen ? <X className="h-6 w-6 text-foreground" /> : <Plus className="h-6 w-6 text-primary-foreground" />}
               </button>
            </div>

            {fabOpen && (
               <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40" onClick={() => setFabOpen(false)} />
            )}

            <AddNoteDialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen} noteType={noteType} />

            <PhotoUpload open={photoUploadOpen} onOpenChange={setPhotoUploadOpen} />
         </>
      );
   }

   return (
      <>
         <Card className="overflow-hidden">
            <CardContent className="p-0">
               <div className="flex divide-x divide-border">
                  {actions.map((action) => (
                     <button
                        key={action.label}
                        onClick={action.onClick}
                        className="flex-1 flex flex-col items-center gap-3 p-4 hover:bg-accent/5 transition-colors group"
                     >
                        <div className={cn("rounded-xl p-3 transition-all group-hover:scale-110", action.bgColor)}>
                           <action.icon className={cn("h-5 w-5", action.color)} />
                        </div>
                        <span className="text-sm font-medium">{action.label}</span>
                     </button>
                  ))}
               </div>
            </CardContent>
         </Card>

         <AddNoteDialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen} noteType={noteType} />

         <PhotoUpload open={photoUploadOpen} onOpenChange={setPhotoUploadOpen} />
      </>
   );
}
