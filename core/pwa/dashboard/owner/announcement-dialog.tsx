import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BadgeFilters } from "@/features/core/components/shared/badge-filters";
import { Megaphone, Send, Users, User } from "lucide-react";
import { cn } from "@/lib/utils";

const announcementSchema = z.object({
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
  audience: z.enum(["all", "staff", "customers"]),
});

type AnnouncementForm = z.infer<typeof announcementSchema>;
type Audience = "all" | "staff" | "customers";

interface AnnouncementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AUDIENCE_FILTERS = [
  {
    value: "all" as Audience,
    label: "All",
    color: "text-primary border-primary/30 hover:bg-primary/10",
  },
  {
    value: "staff" as Audience,
    label: "Staff",
    color: "text-blue-600 dark:text-blue-500 border-blue-500/30 hover:bg-blue-500/10",
  },
  {
    value: "customers" as Audience,
    label: "Customers",
    color: "text-green-600 dark:text-green-500 border-green-500/30 hover:bg-green-500/10",
  },
];

export function AnnouncementDialog({ open, onOpenChange }: AnnouncementDialogProps) {
  const [selectedAudience, setSelectedAudience] = useState<Audience>("all");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm<AnnouncementForm>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: "",
      message: "",
      audience: "all",
    },
  });

  const onSubmit = (data: AnnouncementForm) => {
    console.log("Sending announcement:", data);
    // TODO: Implement actual announcement sending logic
    reset();
    onOpenChange(false);
  };

  const handleClose = () => {
    reset();
    setSelectedAudience("all");
    onOpenChange(false);
  };

  const handleAudienceChange = (value: Audience) => {
    setSelectedAudience(value);
    setValue("audience", value);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-primary" />
            Send Announcement
          </DialogTitle>
          <DialogDescription>
            Send important updates or messages to your team or customers
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="audience" className="text-sm font-medium mb-2 block">
                Audience
              </Label>
              <BadgeFilters
                filters={AUDIENCE_FILTERS}
                selectedValue={selectedAudience}
                onSelect={handleAudienceChange}
              />
            </div>

            <div>
              <Label htmlFor="title" className="text-sm font-medium mb-2 block">
                Title
              </Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="e.g., Holiday Schedule Update"
                className={cn(errors.title && "border-destructive")}
              />
              {errors.title && (
                <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="message" className="text-sm font-medium mb-2 block">
                Message
              </Label>
              <Textarea
                id="message"
                {...register("message")}
                placeholder="Type your announcement message here..."
                rows={6}
                className={cn("resize-none", errors.message && "border-destructive")}
              />
              {errors.message && (
                <p className="text-sm text-destructive mt-1">{errors.message.message}</p>
              )}
            </div>

            <div className="bg-muted/30 rounded-lg p-3 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Recipients
              </p>
              <div className="flex items-center gap-2 text-sm">
                {selectedAudience === "all" && (
                  <>
                    <Users className="h-4 w-4 text-primary" />
                    <span className="font-medium">All staff and customers will be notified</span>
                  </>
                )}
                {selectedAudience === "staff" && (
                  <>
                    <Users className="h-4 w-4 text-blue-600 dark:text-blue-500" />
                    <span className="font-medium">Only staff members will be notified</span>
                  </>
                )}
                {selectedAudience === "customers" && (
                  <>
                    <User className="h-4 w-4 text-green-600 dark:text-green-500" />
                    <span className="font-medium">Only customers will be notified</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid}>
              <Send className="h-4 w-4 mr-2" />
              Send Announcement
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
