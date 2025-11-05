import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Trend } from "@/features/core/types/types.dashboard-owner";

interface TrendIndicatorProps {
   trend: Trend;
   value: number;
   size?: "sm" | "md" | "lg";
   showIcon?: boolean;
   backdrop?: boolean;
   className?: string;
}

const sizeClasses = {
   sm: { icon: "h-3 w-3", text: "text-xs", px: "px-2 py-1 rounded-md" },
   md: { icon: "h-4 w-4", text: "text-sm", px: "px-2.5 py-1 rounded-md" },
   lg: { icon: "h-5 w-5", text: "text-base", px: "px-3 py-1.5 rounded-lg" },
};

export function TrendIndicator({ trend, value, size = "md", showIcon = true, backdrop = true, className }: TrendIndicatorProps) {
   if (trend === "stable") return null;

   const isPositive = trend === "up";
   const Icon = isPositive ? TrendingUp : TrendingDown;

   const bgColor = isPositive
      ? "bg-green-500/10 text-green-600 dark:text-green-500"
      : "bg-red-500/10 text-red-600 dark:text-red-500";

   return (
      <div
         className={cn(
            "flex items-center gap-1 font-bold",
            backdrop ? bgColor : isPositive ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500",
            backdrop ? sizeClasses[size].px : "",
            className
         )}
      >
         {showIcon && <Icon className={sizeClasses[size].icon} />}
         <span className={sizeClasses[size].text}>{value}%</span>
      </div>
   );
}
