import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Send } from "lucide-react";
import type { NoteForm, NoteType } from "@/features/core/types/types.dashboard-employee";
import { noteFormSchema } from "@/features/core/schemas/schemas.dashboard-employee";

interface AddNoteDialogProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   noteType: NoteType;
}

const NOTE_CONFIG = {
   job: {
      title: "Add Job Note",
      description: "Record any observations or details about the current job",
      placeholder: "e.g., Used two bottles of shampoo, client requested extra conditioning...",
      badge: "Job Note",
      templates: ["Used extra product as needed", "Service took longer than expected", "Client very satisfied with results"],
   },
   client: {
      title: "Add Client Note",
      description: "Add a note to the client's profile",
      placeholder: "e.g., Prefers morning appointments, sensitive to strong scents...",
      badge: "Client Note",
   },
   completion: {
      title: "Completion Notes",
      description: "Document what was completed and any follow-up needed",
      placeholder: "e.g., Completed full service, recommended follow-up in 3 weeks...",
      badge: "Completion",
   },
   issue: {
      title: "Flag Issue",
      description: "Report a problem that requires manager attention",
      placeholder: "e.g., Equipment malfunction, customer complaint, safety concern...",
      badge: "Issue",
   },
   upsell: {
      title: "Log Upsell Opportunity",
      description: "Record customer interest in additional services or products",
      placeholder: "e.g., Client interested in premium package, asked about hair treatment...",
      badge: "Upsell",
      templates: ["Client interested in premium service", "Asked about additional treatments", "Interested in product purchase"],
   },
} as const;

export function AddNoteDialog({ open, onOpenChange, noteType }: AddNoteDialogProps) {
   const [isRecording, setIsRecording] = useState(false);
   const config = NOTE_CONFIG[noteType];

   const {
      register,
      handleSubmit,
      setValue,
      reset,
      formState: { errors, isValid },
   } = useForm<NoteForm>({
      resolver: zodResolver(noteFormSchema),
      defaultValues: {
         type: noteType,
         content: "",
      },
   });

   const onSubmit = (data: NoteForm) => {
      console.log(`${data.type} note:`, data.content);
      reset();
      onOpenChange(false);
   };

   const handleVoiceRecord = () => {
      setIsRecording(!isRecording);
      // Voice recording functionality would be implemented here
   };

   const handleTemplateClick = (template: string) => {
      setValue("content", template, { shouldValidate: true });
   };

   const handleClose = () => {
      reset();
      onOpenChange(false);
   };

   return (
      <Dialog open={open} onOpenChange={handleClose}>
         <DialogContent className="sm:max-w-lg">
            <DialogHeader>
               <DialogTitle>{config.title}</DialogTitle>
               <DialogDescription>{config.description}</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)}>
               <div className="space-y-4 py-4">
                  <div>
                     <Textarea {...register("content")} placeholder={config.placeholder} rows={6} className="resize-none" />
                     {errors.content && <p className="text-sm text-destructive mt-1">{errors.content.message}</p>}
                  </div>

                  <div className="flex items-center justify-between">
                     <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleVoiceRecord}
                        className={isRecording ? "text-red-600 dark:text-red-500" : ""}
                     >
                        <Mic className="h-4 w-4 mr-2" />
                        {isRecording ? "Stop Recording" : "Voice Note"}
                     </Button>
                     {isRecording && (
                        <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-500">
                           <div className="w-2 h-2 rounded-full bg-red-600 dark:bg-red-500 animate-pulse" />
                           Recording...
                        </div>
                     )}
                  </div>

                  {"templates" in config && config.templates && (
                     <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Quick Templates</p>
                        <div className="flex flex-wrap gap-2">
                           {config.templates.map((template) => (
                              <Button
                                 key={template}
                                 type="button"
                                 variant="outline"
                                 size="sm"
                                 onClick={() => handleTemplateClick(template)}
                              >
                                 {template}
                              </Button>
                           ))}
                        </div>
                     </div>
                  )}
               </div>

               <DialogFooter>
                  <Button type="button" variant="outline" onClick={handleClose}>
                     Cancel
                  </Button>
                  <Button
                     type="submit"
                     disabled={!isValid}
                     className={
                        noteType === "issue"
                           ? "bg-red-600 hover:bg-red-700 text-white"
                           : noteType === "upsell"
                           ? "bg-green-600 hover:bg-green-700 text-white"
                           : ""
                     }
                  >
                     <Send className="h-4 w-4 mr-2" />
                     Save Note
                  </Button>
               </DialogFooter>
            </form>
         </DialogContent>
      </Dialog>
   );
}
