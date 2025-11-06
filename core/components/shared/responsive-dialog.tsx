import * as React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface ResponsiveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

/**
 * ResponsiveDialog component that renders a Dialog on desktop and a Drawer on mobile
 * This ensures consistent UX patterns across all screen sizes
 */
export function ResponsiveDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  className,
}: ResponsiveDialogProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[90vh] flex flex-col">
          <DrawerHeader className="flex-shrink-0">
            <DrawerTitle>{title}</DrawerTitle>
            {description && <DrawerDescription>{description}</DrawerDescription>}
          </DrawerHeader>
          <div className={`overflow-y-auto px-4 flex-1 ${className || ""}`}>
            {children}
          </div>
          {footer && <DrawerFooter className="flex-shrink-0 border-t bg-background">{footer}</DrawerFooter>}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`max-h-[90vh] flex flex-col p-0 gap-0 ${className || ""}`}>
        <DialogHeader className="px-6 pt-6 pb-4 flex-shrink-0 border-b bg-background">
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="overflow-y-auto px-6 py-4 flex-1 min-h-0">
          {children}
        </div>
        {footer && <DialogFooter className="px-6 py-4 flex-shrink-0 border-t bg-background">{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}
