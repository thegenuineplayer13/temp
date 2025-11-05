import { cn } from "@/lib/utils";

interface ProgressBarProps {
   value: number;
   max?: number;
   size?: "sm" | "md" | "lg";
   color?: "primary" | "secondary" | "success" | "custom";
   customColor?: string;
   showLabel?: boolean;
   label?: string;
   className?: string;
}

const sizeClasses = {
   sm: "h-1.5",
   md: "h-2",
   lg: "h-2.5",
};

const colorClasses = {
   primary: "bg-gradient-to-r from-primary to-primary/80",
   secondary: "bg-gradient-to-r from-secondary to-secondary/80",
   success: "bg-green-500",
   custom: "",
};

export function ProgressBar({
   value,
   max = 100,
   size = "md",
   color = "primary",
   customColor,
   showLabel = false,
   label,
   className,
}: ProgressBarProps) {
   const percentage = Math.min((value / max) * 100, 100);

   return (
      <div className={cn("space-y-1", className)}>
         {showLabel && label && (
            <div className="flex justify-between text-xs">
               <span className="text-muted-foreground">{label}</span>
               <span className="font-semibold">{percentage.toFixed(0)}%</span>
            </div>
         )}
         <div className={cn("bg-muted rounded-full overflow-hidden", sizeClasses[size])}>
            <div
               className={cn("h-full rounded-full transition-all duration-500", color === "custom" ? "" : colorClasses[color])}
               style={{
                  width: `${percentage}%`,
                  ...(color === "custom" && customColor ? { backgroundColor: customColor } : {}),
               }}
            />
         </div>
      </div>
   );
}
