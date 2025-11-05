import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface AvatarWithBadgeProps {
   initials: string;
   size?: "sm" | "md" | "lg";
   showBadge?: boolean;
   badgeIcon?: React.ReactNode;
   className?: string;
}

const sizeClasses = {
   sm: { avatar: "h-8 w-8", text: "text-xs", badge: "h-3 w-3 text-accent-foreground", badgeContainer: "p-0.5" },
   md: { avatar: "h-10 w-10", text: "text-xs", badge: "h-3.5 w-3.5 text-accent-foreground", badgeContainer: "p-0.5" },
   lg: { avatar: "h-12 w-12", text: "text-sm", badge: "h-4 w-4 text-accent-foreground", badgeContainer: "p-1" },
};

export function AvatarWithBadge({ initials, size = "md", showBadge = false, badgeIcon, className }: AvatarWithBadgeProps) {
   const BadgeIcon = badgeIcon || <Award className={sizeClasses[size].badge} />;

   return (
      <div className={cn("relative", className)}>
         <Avatar className={cn(sizeClasses[size].avatar, "border-2 border-primary/20 h-9 w-9")}>
            <AvatarFallback className={cn(sizeClasses[size].text, "font-bold bg-gradient-to-br from-primary/20 to-primary/5")}>
               {initials}
            </AvatarFallback>
         </Avatar>
         {showBadge && (
            <div className={cn("absolute -top-1 -right-1 rounded-full bg-accent p-0.5", sizeClasses[size].badgeContainer)}>
               {BadgeIcon}
            </div>
         )}
      </div>
   );
}
