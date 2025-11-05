import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
   rating: number;
   maxRating?: number;
   size?: "sm" | "md" | "lg";
   showValue?: boolean;
   className?: string;
}

const sizeClasses = {
   sm: "h-3 w-3",
   md: "h-3.5 w-3.5",
   lg: "h-4 w-4",
};

export function StarRating({ rating, maxRating = 5, size = "md", showValue = false, className }: StarRatingProps) {
   return (
      <div className={cn("flex items-center gap-1", className)}>
         <div className="flex">
            {Array.from({ length: maxRating }).map((_, i) => (
               <Star
                  key={i}
                  className={cn(
                     sizeClasses[size],
                     i < Math.floor(rating) ? "text-accent fill-accent" : "text-muted-foreground/20"
                  )}
               />
            ))}
         </div>
         {showValue && <span className="text-sm font-semibold ml-1">{rating}</span>}
      </div>
   );
}
