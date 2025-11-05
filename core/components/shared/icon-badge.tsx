import * as React from "react";
import {
  Scissors,
  Palette,
  Wrench,
  Sparkles,
  Car,
  Zap,
  Droplet,
  Wind,
  Heart,
  Star,
  Circle,
  Square,
  Triangle,
  Home,
  User,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { IconName, Color } from "@/features/core/types/types.services";

const ICON_MAP: Record<IconName, LucideIcon> = {
  Scissors,
  Palette,
  Wrench,
  Sparkles,
  Car,
  Zap,
  Droplet,
  Wind,
  Heart,
  Star,
  Circle,
  Square,
  Triangle,
  Home,
  User,
  Settings,
};

interface ColorOption {
  value: Color;
  class: string;
}

const COLOR_MAP: ColorOption[] = [
  { value: "blue", class: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400" },
  { value: "green", class: "bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400" },
  { value: "purple", class: "bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400" },
  { value: "orange", class: "bg-orange-500/10 text-orange-600 border-orange-500/20 dark:text-orange-400" },
  { value: "pink", class: "bg-pink-500/10 text-pink-600 border-pink-500/20 dark:text-pink-400" },
  { value: "red", class: "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400" },
  { value: "yellow", class: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20 dark:text-yellow-400" },
  { value: "indigo", class: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20 dark:text-indigo-400" },
  { value: "teal", class: "bg-teal-500/10 text-teal-600 border-teal-500/20 dark:text-teal-400" },
  { value: "cyan", class: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20 dark:text-cyan-400" },
];

export function getColorClass(color: Color): string {
  return COLOR_MAP.find((c) => c.value === color)?.class || COLOR_MAP[0].class;
}

interface IconBadgeProps {
  icon: IconName;
  color: Color;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * IconBadge component for displaying service/specialization icons with consistent styling
 */
export function IconBadge({ icon, color, size = "md", className }: IconBadgeProps) {
  const Icon = ICON_MAP[icon] || Circle;

  const sizeClasses = {
    sm: "p-1 rounded",
    md: "p-1.5 rounded-md",
    lg: "p-2 rounded-lg",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return (
    <div className={cn("border", getColorClass(color), sizeClasses[size], className)}>
      <Icon className={iconSizes[size]} />
    </div>
  );
}

export { ICON_MAP };
