import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Wrench, Calendar, Clock, Phone, Users, MapPin, TrendingDown } from "lucide-react";
import type { Alert } from "@/features/core/types/types.notifications";
import { formatDate } from "../notification-utils";

interface OperationsAlertDetailProps {
	alert: Alert;
}

export function OperationsAlertDetail({ alert }: OperationsAlertDetailProps) {
	const metadata = alert.metadata as any;

	// Equipment malfunction
	if (alert.type === "equipment-malfunction") {
		return (
			<div className="space-y-6">
				{/* Equipment Info */}
				{alert.affectedEntities?.[0] && (
					<Card className="p-4">
						<div className="flex items-start gap-4">
							<div className="rounded-lg bg-destructive/10 p-3">
								<Wrench className="h-8 w-8 text-destructive" />
							</div>
							<div className="flex-1">
								<h3 className="font-semibold text-lg">{alert.affectedEntities[0].name}</h3>
								{metadata?.equipmentId && (
									<div className="text-sm text-muted-foreground mt-1">
										ID: {metadata.equipmentId}
									</div>
								)}
								{metadata?.issue && (
									<div className="mt-2 p-2 rounded-md bg-red-500/10 border border-red-500/20 text-sm">
										<span className="font-medium text-red-600 dark:text-red-500">Issue: </span>
										<span className="text-muted-foreground">{metadata.issue}</span>
									</div>
								)}
							</div>
						</div>
					</Card>
				)}

				{/* Details */}
				{(metadata?.reportedBy || metadata?.lastMaintenance) && (
					<Card className="p-4 space-y-3 text-sm">
						{metadata.reportedBy && (
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground">Reported By</span>
								<span className="font-medium">{metadata.reportedBy}</span>
							</div>
						)}
						{metadata.lastMaintenance && (
							<>
								<Separator />
								<div className="flex items-center justify-between">
									<span className="text-muted-foreground">Last Maintenance</span>
									<span className="font-medium">{formatDate(metadata.lastMaintenance)}</span>
								</div>
							</>
						)}
					</Card>
				)}

				{/* Affected Services */}
				{alert.affectedEntities?.filter((e) => e.type === "service").length > 0 && (
					<div className="space-y-3">
						<h3 className="font-semibold">Affected Services</h3>
						<div className="flex flex-wrap gap-2">
							{alert.affectedEntities
								.filter((e) => e.type === "service")
								.map((entity) => (
									<Badge key={entity.id} variant="outline">
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
							<Button className="w-full justify-start">
								<Phone className="h-4 w-4 mr-2" />
								Contact Technician
							</Button>
							<Button variant="outline" className="w-full justify-start">
								<Calendar className="h-4 w-4 mr-2" />
								Reschedule Appointments
							</Button>
						</div>
					</div>
				)}
			</div>
		);
	}

	// Maintenance due
	if (alert.type === "maintenance-due") {
		return (
			<div className="space-y-6">
				<Card className="p-4 space-y-4">
					<h3 className="font-semibold">Maintenance Details</h3>
					<div className="space-y-3 text-sm">
						{metadata?.equipmentType && (
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground">Equipment</span>
								<span className="font-medium">{metadata.equipmentType}</span>
							</div>
						)}
						{metadata?.dueDate && (
							<>
								<Separator />
								<div className="flex items-center justify-between">
									<span className="text-muted-foreground">Due Date</span>
									<span className="font-semibold text-orange-600 dark:text-orange-500">
										{formatDate(metadata.dueDate)}
									</span>
								</div>
							</>
						)}
						{metadata?.lastMaintenance && (
							<>
								<Separator />
								<div className="flex items-center justify-between">
									<span className="text-muted-foreground">Last Maintenance</span>
									<span className="font-medium">{formatDate(metadata.lastMaintenance)}</span>
								</div>
							</>
						)}
						{metadata?.contractorContact && (
							<>
								<Separator />
								<div className="flex items-center justify-between">
									<span className="text-muted-foreground">Contractor</span>
									<span className="font-medium">{metadata.contractorContact}</span>
								</div>
							</>
						)}
					</div>
				</Card>

				{alert.status !== "resolved" && (
					<div className="space-y-2">
						<h3 className="font-semibold">Actions</h3>
						<div className="grid gap-2">
							<Button className="w-full justify-start">
								<Phone className="h-4 w-4 mr-2" />
								Schedule Maintenance
							</Button>
						</div>
					</div>
				)}
			</div>
		);
	}

	// Appointment conflict
	if (alert.type === "appointment-conflict") {
		return (
			<div className="space-y-6">
				{metadata?.conflictTime && (
					<Card className="p-4">
						<div className="flex items-center gap-3">
							<Clock className="h-5 w-5 text-orange-600 dark:text-orange-500" />
							<div>
								<p className="text-sm text-muted-foreground">Conflict Time</p>
								<p className="text-lg font-semibold">{metadata.conflictTime}</p>
							</div>
						</div>
					</Card>
				)}

				{metadata?.appointments && metadata.appointments.length > 0 && (
					<div className="space-y-3">
						<h3 className="font-semibold">Conflicting Appointments</h3>
						<div className="space-y-2">
							{metadata.appointments.map((apt: any, idx: number) => (
								<Card key={idx} className="p-4 bg-orange-500/5 border-orange-500/20">
									<div className="space-y-1">
										<p className="font-semibold">{apt.customer}</p>
										<p className="text-sm text-muted-foreground">{apt.service}</p>
									</div>
								</Card>
							))}
						</div>
					</div>
				)}

				{alert.status !== "resolved" && alert.actionUrl && (
					<div className="space-y-2">
						<h3 className="font-semibold">Actions</h3>
						<div className="grid gap-2">
							<Button className="w-full justify-start" asChild>
								<a href={alert.actionUrl}>
									<Calendar className="h-4 w-4 mr-2" />
									Resolve Conflict
								</a>
							</Button>
						</div>
					</div>
				)}
			</div>
		);
	}

	return null;
}
