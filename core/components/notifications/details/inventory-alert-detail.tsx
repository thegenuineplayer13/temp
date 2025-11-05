import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Package, ShoppingCart, AlertTriangle, Phone, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Alert } from "@/features/core/types/types.notifications";
import { formatDate } from "../notification-utils";

interface InventoryAlertDetailProps {
	alert: Alert;
}

export function InventoryAlertDetail({ alert }: InventoryAlertDetailProps) {
	const metadata = alert.metadata as any;

	return (
		<div className="space-y-6">
			{/* Item Info Card */}
			<Card className="p-4">
				<div className="flex items-start gap-4">
					<div className="rounded-lg bg-orange-500/10 p-3">
						<Package className="h-8 w-8 text-orange-600 dark:text-orange-500" />
					</div>
					<div className="flex-1">
						<h3 className="font-semibold text-lg">
							{alert.affectedEntities?.[0]?.name || "Unknown Item"}
						</h3>
						<div className="flex items-center gap-2 mt-2">
							{alert.type === "inventory-out" && (
								<Badge variant="destructive">OUT OF STOCK</Badge>
							)}
							{alert.type === "inventory-low" && (
								<Badge className="bg-orange-500">LOW STOCK</Badge>
							)}
							{alert.type === "inventory-expiring" && (
								<Badge className="bg-yellow-500">EXPIRING SOON</Badge>
							)}
						</div>
					</div>
				</div>
			</Card>

			{/* Stock Levels */}
			{metadata?.currentStock !== undefined && (
				<Card className="p-4">
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<h3 className="font-semibold">Current Stock Level</h3>
							<span className="text-2xl font-bold">
								{metadata.currentStock} {alert.type === "inventory-expiring" ? "units" : "remaining"}
							</span>
						</div>

						{metadata.reorderLevel && (
							<div className="space-y-2">
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground">
										Reorder level: {metadata.reorderLevel} units
									</span>
									<span className="font-semibold text-orange-600 dark:text-orange-500">
										{((metadata.currentStock / metadata.reorderLevel) * 100).toFixed(0)}%
									</span>
								</div>
								<div className="h-3 bg-muted rounded-full overflow-hidden">
									<div
										className={cn(
											"h-full rounded-full transition-all",
											metadata.currentStock === 0
												? "bg-destructive"
												: metadata.currentStock < metadata.reorderLevel * 0.3
													? "bg-red-500"
													: metadata.currentStock < metadata.reorderLevel * 0.6
														? "bg-orange-500"
														: "bg-yellow-500",
										)}
										style={{
											width: `${Math.min((metadata.currentStock / metadata.reorderLevel) * 100, 100)}%`,
										}}
									/>
								</div>
							</div>
						)}
					</div>
				</Card>
			)}

			{/* Expiry Info */}
			{metadata?.expiryDate && (
				<Card className="p-4 space-y-4">
					<h3 className="font-semibold">Expiration Details</h3>
					<div className="space-y-3 text-sm">
						<div className="flex items-center justify-between">
							<span className="text-muted-foreground">Expiry Date</span>
							<span className="font-semibold text-orange-600 dark:text-orange-500">
								{formatDate(metadata.expiryDate)}
							</span>
						</div>
						{metadata.quantity && (
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground">Quantity Expiring</span>
								<span className="font-medium">{metadata.quantity} units</span>
							</div>
						)}
						{metadata.purchaseValue && (
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground">Purchase Value</span>
								<span className="font-semibold text-destructive">
									${metadata.purchaseValue}
								</span>
							</div>
						)}
					</div>
				</Card>
			)}

			{/* Supplier Info */}
			{metadata?.supplier && (
				<Card className="p-4 space-y-4">
					<h3 className="font-semibold">Supplier Information</h3>
					<div className="space-y-3 text-sm">
						<div className="flex items-center justify-between">
							<span className="text-muted-foreground">Supplier</span>
							<span className="font-medium">{metadata.supplier}</span>
						</div>
						{metadata.estimatedDaysRemaining && (
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground">Days Remaining</span>
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
						{metadata.nextDeliveryDate && (
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground">Next Delivery</span>
								<span className="font-medium">{formatDate(metadata.nextDeliveryDate)}</span>
							</div>
						)}
					</div>
				</Card>
			)}

			{/* Affected Services */}
			{(metadata?.affectedServices || alert.affectedEntities?.some((e) => e.type === "service")) && (
				<div className="space-y-3">
					<div className="flex items-center gap-2">
						<AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-500" />
						<h3 className="font-semibold">Affected Services</h3>
					</div>
					<div className="flex flex-wrap gap-2">
						{metadata?.affectedServices?.map((service: string, idx: number) => (
							<Badge key={idx} variant="outline" className="border-orange-500/50">
								{service}
							</Badge>
						)) ||
							alert.affectedEntities
								?.filter((e) => e.type === "service")
								.map((entity) => (
									<Badge key={entity.id} variant="outline" className="border-orange-500/50">
										{entity.name}
									</Badge>
								))}
					</div>
				</div>
			)}

			{/* Actions */}
			{alert.status !== "resolved" && (
				<div className="space-y-2">
					<h3 className="font-semibold">Actions</h3>
					<div className="grid gap-2">
						{alert.actionUrl && (
							<Button className="w-full justify-start" asChild>
								<a href={alert.actionUrl}>
									<ShoppingCart className="h-4 w-4 mr-2" />
									Place Reorder
								</a>
							</Button>
						)}
						{metadata?.supplier && (
							<Button variant="outline" className="w-full justify-start">
								<Phone className="h-4 w-4 mr-2" />
								Contact Supplier
							</Button>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
