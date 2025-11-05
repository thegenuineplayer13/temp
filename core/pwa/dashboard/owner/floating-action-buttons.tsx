import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Megaphone, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface FloatingActionButtonsProps {
   onAnnouncement: () => void;
   onReport: () => void;
}

export function FloatingActionButtons({ onAnnouncement, onReport }: FloatingActionButtonsProps) {
   const [isExpanded, setIsExpanded] = useState(true);
   const isMobile = useIsMobile();

   if (isMobile) {
      return (
         <div className="fixed bottom-20 right-4 z-30 flex flex-col gap-2 items-end">
            <div
               className={cn(
                  "flex flex-col gap-2 transition-all duration-300 origin-bottom",
                  isExpanded ? "scale-100 opacity-100" : "scale-0 opacity-0 h-0"
               )}
            >
               <Button
                  size="sm"
                  onClick={onAnnouncement}
                  className="rounded-full shadow-lg h-12 w-12 p-0 bg-primary/90 hover:bg-primary text-primary-foreground"
                  title="Send Announcement"
               >
                  <Megaphone className="h-5 w-5" />
               </Button>
               <Button
                  size="sm"
                  onClick={onReport}
                  className="rounded-full shadow-lg h-12 w-12 p-0 bg-secondary/90 hover:bg-secondary text-secondary-foreground"
                  title="Generate Report"
               >
                  <FileText className="h-5 w-5" />
               </Button>
            </div>
            <Button
               size="sm"
               onClick={() => setIsExpanded(!isExpanded)}
               variant="outline"
               className="rounded-full shadow-md h-10 w-10 p-0 bg-card/80 backdrop-blur-sm border-border/50"
            >
               {isExpanded ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
         </div>
      );
   }

   return (
      <div className="fixed bottom-6 right-6 z-20 flex items-center gap-2">
         <div
            className={cn(
               "flex items-center gap-2 transition-all duration-300",
               isExpanded ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
            )}
         >
            <Button
               size="sm"
               onClick={onAnnouncement}
               className="rounded-full shadow-lg h-11 px-4 bg-primary/90 hover:bg-primary text-primary-foreground hover:scale-105 transition-all"
            >
               <Megaphone className="h-4 w-4 mr-2" />
               <span className="text-sm font-medium">Announcement</span>
            </Button>
            <Button
               size="sm"
               onClick={onReport}
               className="rounded-full shadow-lg h-11 px-4 bg-secondary/90 hover:bg-secondary text-secondary-foreground hover:scale-105 transition-all"
            >
               <FileText className="h-4 w-4 mr-2" />
               <span className="text-sm font-medium">Report</span>
            </Button>
         </div>
         <Button
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            variant="outline"
            className="rounded-full shadow-md h-11 w-11 p-0 bg-card/80 backdrop-blur-sm border-border/50 hover:bg-accent"
         >
            {isExpanded ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
         </Button>
      </div>
   );
}
