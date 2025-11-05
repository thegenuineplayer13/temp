import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Calendar, Wrench, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Alert } from "@/features/core/types/types.notifications";
import { NotificationCardBase } from "../notification-card-base";
import { formatDate } from "../notification-utils";

interface GeneralAlertRenderProps {
	alert: Alert;
	onClick?: () => void;
	isSelected?: boolean;
	onAcknowledge?: (id: string) => void;
	onResolve?: (id: string) => void;
}

export function GeneralAlertRender({
	alert,
	onClick,
	isSelected,
	onAcknowledge,
	onResolve,
}: GeneralAlertRenderProps) {
	const metadata = alert.metadata as any;

	return (
		<NotificationCardBase notification={alert} onClick={onClick} isSelected={isSelected}>
			{/* General alert details */}
			<div className="mt-3 pt-3 border-t space-y-2">
				{/* Affected entities */}
				{alert.affectedEntities && alert.affectedEntities.length > 0 && (
					<div className="space-y-1">
						<div className="text-xs text-muted-foreground font-medium">Affected:</div>
						<div className="flex flex-wrap gap-1">
							{alert.affectedEntities.map((entity, idx) => (
								<Badge key={idx} variant="outline" className="text-xs">
									{entity.name}
								</Badge>
							))}
						</div>
					</div>
				)}

				{/* Equipment-specific info */}
				{alert.type === "equipment-malfunction" && (
					<>
						{metadata?.equipmentId && (
							<div className="flex items-center justify-between text-sm">
								<span className="text-muted-foreground">Equipment ID:</span>
								<span className="font-mono font-medium">{metadata.equipmentId}</span>
							</div>
						)}
						{metadata?.issue && (
							<div className="mt-2 p-2 rounded-md bg-red-500/10 border border-red-500/20 text-xs">
								<span className="font-medium text-red-600 dark:text-red-500">Issue: </span>
								<span className="text-muted-foreground">{metadata.issue}</span>
							</div>
						)}
						{metadata?.reportedBy && (
							<div className="flex items-center justify-between text-sm">
								<span className="text-muted-foreground">Reported by:</span>
								<span className="font-medium">{metadata.reportedBy}</span>
							</div>
						)}
						{metadata?.lastMaintenance && (
							<div className="flex items-center justify-between text-sm">
								<span className="text-muted-foreground">Last Maintenance:</span>
								<span className="text-xs">{formatDate(metadata.lastMaintenance)}</span>
							</div>
						)}
					</>
				)}

				{/* Maintenance-specific info */}
				{alert.type === "maintenance-due" && (
					<>
						{metadata?.equipmentType && (
							<div className="flex items-center justify-between text-sm">
								<span className="text-muted-foreground">Equipment:</span>
								<span className="font-medium">{metadata.equipmentType}</span>
							</div>
						)}
						{metadata?.dueDate && (
							<div className="flex items-center justify-between text-sm">
								<span className="text-muted-foreground">Due Date:</span>
								<span className="font-semibold text-orange-600 dark:text-orange-500">
									{formatDate(metadata.dueDate)}
								</span>
							</div>
						)}
						{metadata?.contractorContact && (
							<div className="mt-2 p-2 rounded-md bg-muted/50 text-xs">
								<span className="font-medium">Contractor: </span>
								<span className="text-muted-foreground">{metadata.contractorContact}</span>
							</div>
						)}
					</>
				)}

				{/* Appointment conflict info */}
				{alert.type === "appointment-conflict" && metadata?.appointments && (
					<div className="mt-2 space-y-1">
						<div className="text-xs text-muted-foreground font-medium mb-1">
							Conflicting Appointments:
						</div>
						{metadata.appointments.map((apt: any, idx: number) => (
							<div
								key={idx}
								className="p-2 rounded-md bg-orange-500/10 border border-orange-500/20 text-xs"
							>
								<div className="font-medium">{apt.customer}</div>
								<div className="text-muted-foreground">{apt.service}</div>
							</div>
						))}
					</div>
				)}

				{/* Payment failed info */}
				{alert.type === "payment-failed" && (
					<>
						{metadata?.customerName && (
							<div className="flex items-center justify-between text-sm">
								<span className="text-muted-foreground">Customer:</span>
								<span className="font-semibold">{metadata.customerName}</span>
							</div>
						)}
						{metadata?.amount && (
							<div className="flex items-center justify-between text-sm">
								<span className="text-muted-foreground">Amount:</span>
								<span className="font-bold text-red-600 dark:text-red-500">
									${metadata.amount}
								</span>
							</div>
						)}
						{metadata?.declineReason && (
							<div className="mt-2 p-2 rounded-md bg-red-500/10 border border-red-500/20 text-xs">
								<span className="font-medium text-red-600 dark:text-red-500">Reason: </span>
								<span className="text-muted-foreground">{metadata.declineReason}</span>
							</div>
						)}
					</>
				)}

				{/* License expiring info */}
				{alert.type === "license-expiring" && (
					<>
						{metadata?.licenseType && (
							<div className="flex items-center justify-between text-sm">
								<span className="text-muted-foreground">License:</span>
								<span className="font-medium">{metadata.licenseType}</span>
							</div>
						)}
						{metadata?.employeeName && (
							<div className="flex items-center justify-between text-sm">
								<span className="text-muted-foreground">Employee:</span>
								<span className="font-semibold">{metadata.employeeName}</span>
							</div>
						)}
						{metadata?.expiryDate && (
							<div className="flex items-center justify-between text-sm">
								<span className="text-muted-foreground">Expires:</span>
								<span className="font-semibold text-orange-600 dark:text-orange-500">
									{formatDate(metadata.expiryDate)}
								</span>
							</div>
						)}
					</>
				)}

				{/* System update info */}
				{alert.type === "system-update" && (
					<>
						{metadata?.version && (
							<div className="flex items-center justify-between text-sm">
								<span className="text-muted-foreground">Version:</span>
								<Badge variant="secondary" className="font-mono">
									v{metadata.version}
								</Badge>
							</div>
						)}
						{metadata?.releaseNotes && (
							<div className="mt-2 p-2 rounded-md bg-muted/50 text-xs">
								<span className="text-muted-foreground">{metadata.releaseNotes}</span>
							</div>
						)}
						{metadata?.updateSize && (
							<div className="flex items-center justify-between text-sm">
								<span className="text-muted-foreground">Size:</span>
								<span className="text-xs">{metadata.updateSize}</span>
							</div>
						)}
					</>
				)}

				{/* Actions */}
				{alert.status !== "resolved" && (
					<div className="flex items-center gap-2 mt-3 pt-2">
						{alert.actionUrl && (
							<Button size="sm" className="flex-1" asChild>
								<a href={alert.actionUrl}>
									<ExternalLink className="h-3.5 w-3.5 mr-1.5" />
									Take Action
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

				{/* Resolved status */}
				{alert.status === "resolved" && (
					<div className="mt-3 pt-2 border-t">
						<Badge variant="secondary" className="w-full justify-center bg-green-500/20 text-green-700 dark:text-green-400">
							Resolved
							{alert.resolvedBy && <> by {alert.resolvedBy.name}</>}
						</Badge>
					</div>
				)}
			</div>
		</NotificationCardBase>
	);
}
