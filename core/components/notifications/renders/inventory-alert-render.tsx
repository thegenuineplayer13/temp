import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, ShoppingCart, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Alert } from "@/features/core/types/types.notifications";
import { NotificationCardBase } from "../notification-card-base";

interface InventoryAlertRenderProps {
	alert: Alert;
	onClick?: () => void;
	isSelected?: boolean;
	onAcknowledge?: (id: string) => void;
	onResolve?: (id: string) => void;
}

export function InventoryAlertRender({
	alert,
	onClick,
	isSelected,
	onAcknowledge,
	onResolve,
}: InventoryAlertRenderProps) {
	const metadata = alert.metadata as any;

	return (
		<NotificationCardBase notification={alert} onClick={onClick} isSelected={isSelected}>
			{/* Inventory-specific details */}
			<div className="mt-3 pt-3 border-t space-y-2">
				{/* Current stock info */}
				{metadata?.currentStock !== undefined && (
					<div className="flex items-center justify-between text-sm">
						<span className="text-muted-foreground">Current Stock:</span>
						<Badge
							variant={metadata.currentStock === 0 ? "destructive" : "secondary"}
							className="font-semibold"
						>
							{metadata.currentStock} {alert.type === "inventory-expiring" ? "units" : "remaining"}
						</Badge>
					</div>
				)}

				{/* Reorder level */}
				{metadata?.reorderLevel && (
					<div className="flex items-center justify-between text-sm">
						<span className="text-muted-foreground">Reorder Level:</span>
						<span className="font-medium">{metadata.reorderLevel} units</span>
					</div>
				)}

				{/* Days remaining */}
				{metadata?.estimatedDaysRemaining && (
					<div className="flex items-center justify-between text-sm">
						<span className="text-muted-foreground">Est. Days Remaining:</span>
						<span
							className={cn(
								"font-semibold",
								metadata.estimatedDaysRemaining <= 1
									? "text-red-600 dark:text-red-500"
									: metadata.estimatedDaysRemaining <= 3
										? "text-orange-600 dark:text-orange-500"
										: "text-foreground",
							)}
						>
							{metadata.estimatedDaysRemaining} days
						</span>
					</div>
				)}

				{/* Expiry info */}
				{metadata?.expiryDate && (
					<div className="flex items-center justify-between text-sm">
						<span className="text-muted-foreground">Expires:</span>
						<span className="font-medium text-orange-600 dark:text-orange-500">
							{new Date(metadata.expiryDate).toLocaleDateString()}
						</span>
					</div>
				)}

				{/* Supplier */}
				{metadata?.supplier && (
					<div className="flex items-center justify-between text-sm">
						<span className="text-muted-foreground">Supplier:</span>
						<span className="font-medium">{metadata.supplier}</span>
					</div>
				)}

				{/* Affected services */}
				{metadata?.affectedServices && metadata.affectedServices.length > 0 && (
					<div className="mt-2 p-2 rounded-md bg-orange-500/10 border border-orange-500/20">
						<div className="flex items-center gap-1.5 text-xs text-orange-600 dark:text-orange-500 mb-1">
							<AlertTriangle className="h-3 w-3" />
							<span className="font-semibold">Affected Services</span>
						</div>
						<div className="flex flex-wrap gap-1">
							{metadata.affectedServices.map((service: string, idx: number) => (
								<Badge key={idx} variant="outline" className="text-xs">
									{service}
								</Badge>
							))}
						</div>
					</div>
				)}

				{/* Actions */}
				{alert.status !== "resolved" && (
					<div className="flex items-center gap-2 mt-3 pt-2">
						{alert.actionUrl && (
							<Button size="sm" className="flex-1" asChild>
								<a href={alert.actionUrl}>
									<ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
									Reorder
								</a>
							</Button>
						)}
						{alert.status === "unread" && onAcknowledge && (
							<Button
								size="sm"
								variant="outline"
								onClick={(e) => {
									e.stopPropagation();
									onAcknowledge(alert.id);
								}}
							>
								Acknowledge
							</Button>
						)}
						{alert.status === "acknowledged" && onResolve && (
							<Button
								size="sm"
								variant="outline"
								onClick={(e) => {
									e.stopPropagation();
									onResolve(alert.id);
								}}
							>
								Resolve
							</Button>
						)}
					</div>
				)}
			</div>
		</NotificationCardBase>
	);
}
