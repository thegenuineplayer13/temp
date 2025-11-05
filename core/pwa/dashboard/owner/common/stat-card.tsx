import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
   icon: LucideIcon;
   label: string;
   value: string | number;
   subtitle?: string;
   trend?: React.ReactNode;
   accentColor?: string;
   className?: string;
}

export function StatCard({
   icon: Icon,
   label,
   value,
   subtitle,
   trend,
   accentColor = "var(--primary)",
   className,
}: StatCardProps) {
   return (
      <Card className={cn("bg-gradient-to-br from-primary/5 to-background", className)}>
         <CardContent className="pt-6">
            <div className="rounded-lg p-2 w-fit mb-3" style={{ backgroundColor: `${accentColor}10` }}>
               <Icon className="h-5 w-5" style={{ color: accentColor }} />
            </div>
            <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
            <div className="flex items-baseline gap-2">
               <p className="text-3xl font-bold">{value}</p>
               {subtitle && <span className="text-xl text-muted-foreground">{subtitle}</span>}
            </div>
            {trend && <div className="mt-2">{trend}</div>}
         </CardContent>
      </Card>
   );
}
