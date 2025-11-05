import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import type { LucideIcon } from "lucide-react";

export interface ScrollAction {
  icon: LucideIcon;
  label: string;
  color: string;
  bgColor: string;
  onClick: () => void;
}

interface ScrollActionPanelProps {
  actions: ScrollAction[];
  /** Position of floating button. Default: "bottom-right" */
  floatingPosition?: "bottom-right" | "bottom-left" | "bottom-center";
  /** Force floating button mode even on desktop. Default: false */
  forceFloating?: boolean;
  /** Custom className for the component */
  className?: string;
}

export function ScrollActionPanel({
  actions,
  floatingPosition = "bottom-right",
  forceFloating = false,
  className,
}: ScrollActionPanelProps) {
  const isMobile = useIsMobile();
  const [fabOpen, setFabOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const getPositionClasses = () => {
    switch (floatingPosition) {
      case "bottom-left":
        return "fixed bottom-6 left-6";
      case "bottom-center":
        return "fixed bottom-6 left-1/2 -translate-x-1/2";
      case "bottom-right":
      default:
        return "fixed bottom-6 right-6";
    }
  };

  if (isMobile) {
    return (
      <>
        <div ref={panelRef} className={cn(getPositionClasses(), "z-50 transition-all duration-300", className)}>
          <div
            className={cn(
              "absolute bottom-16 space-y-3 transition-all duration-300",
              floatingPosition === "bottom-left" ? "left-0" : floatingPosition === "bottom-center" ? "left-1/2 -translate-x-1/2" : "right-0",
              fabOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"
            )}
          >
            {actions.map((action, index) => (
              <div
                key={action.label}
                className={cn(
                  "flex items-center gap-3",
                  floatingPosition === "bottom-right" ? "justify-end" : floatingPosition === "bottom-left" ? "justify-start" : "justify-center"
                )}
                style={{
                  transitionDelay: fabOpen ? `${index * 50}ms` : "0ms",
                }}
              >
                {floatingPosition !== "bottom-left" && (
                  <span
                    className={cn(
                      "text-sm font-medium bg-background px-3 py-1.5 rounded-full shadow-lg border whitespace-nowrap transition-all",
                      fabOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                    )}
                  >
                    {action.label}
                  </span>
                )}
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
                {floatingPosition === "bottom-left" && (
                  <span
                    className={cn(
                      "text-sm font-medium bg-background px-3 py-1.5 rounded-full shadow-lg border whitespace-nowrap transition-all",
                      fabOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                    )}
                  >
                    {action.label}
                  </span>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={() => setFabOpen(!fabOpen)}
            className={cn(
              "rounded-full p-3.5 shadow-xl transition-all hover:scale-110 border-2",
              fabOpen
                ? "bg-background border-border rotate-45 hover:bg-accent"
                : "bg-primary/90 border-primary hover:bg-primary"
            )}
          >
            {fabOpen ? (
              <X className="h-5 w-5 text-foreground" />
            ) : (
              <Plus className="h-5 w-5 text-primary-foreground" />
            )}
          </button>
        </div>

        {fabOpen && (
          <div className="fixed inset-0 bg-background/60 backdrop-blur-[2px] z-20" onClick={() => setFabOpen(false)} />
        )}
      </>
    );
  }

  // Desktop view - if forceFloating is true, use floating button, otherwise horizontal card layout
  if (forceFloating) {
    return (
      <>
        <div className={cn(getPositionClasses(), "z-50 transition-all duration-300", className)}>
          <>
            <div
              className={cn(
                "absolute bottom-16 space-y-3 transition-all duration-300",
                floatingPosition === "bottom-left" ? "left-0" : floatingPosition === "bottom-center" ? "left-1/2 -translate-x-1/2" : "right-0",
                fabOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"
              )}
            >
              {actions.map((action, index) => (
                <div
                  key={action.label}
                  className={cn(
                    "flex items-center gap-3",
                    floatingPosition === "bottom-right" ? "justify-end" : floatingPosition === "bottom-left" ? "justify-start" : "justify-center"
                  )}
                  style={{
                    transitionDelay: fabOpen ? `${index * 50}ms` : "0ms",
                  }}
                >
                  {floatingPosition !== "bottom-left" && (
                    <span
                      className={cn(
                        "text-sm font-medium bg-background px-3 py-1.5 rounded-full shadow-lg border whitespace-nowrap transition-all",
                        fabOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                      )}
                    >
                      {action.label}
                    </span>
                  )}
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
                  {floatingPosition === "bottom-left" && (
                    <span
                      className={cn(
                        "text-sm font-medium bg-background px-3 py-1.5 rounded-full shadow-lg border whitespace-nowrap transition-all",
                        fabOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                      )}
                    >
                      {action.label}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => setFabOpen(!fabOpen)}
              className={cn(
                "rounded-full p-3.5 shadow-xl transition-all hover:scale-110 border-2",
                fabOpen
                  ? "bg-background border-border rotate-45 hover:bg-accent"
                  : "bg-primary/90 border-primary hover:bg-primary"
              )}
            >
              {fabOpen ? (
                <X className="h-5 w-5 text-foreground" />
              ) : (
                <Plus className="h-5 w-5 text-primary-foreground" />
              )}
            </button>
          </>
        </div>

        {fabOpen && (
          <div className="fixed inset-0 bg-background/60 backdrop-blur-[2px] z-20" onClick={() => setFabOpen(false)} />
        )}
      </>
    );
  }

  // Desktop view - horizontal card layout
  return (
    <Card className={cn("overflow-hidden", className)}>
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
  );
}
