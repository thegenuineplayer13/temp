import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Calendar, DollarSign, Clock } from "lucide-react";
import type { Alert } from "@/features/core/types/types.notifications";

interface StaffAlertDetailProps {
	alert: Alert;
}

export function StaffAlertDetail({ alert }: StaffAlertDetailProps) {
	const metadata = alert.metadata as any;
	const staffMember = alert.affectedEntities?.[0];

	return (
		<div className="space-y-6">
			{/* Staff Member Info */}
			{staffMember && (
				<Card className="p-4">
					<div className="flex items-center gap-4">
						<Avatar className="h-16 w-16">
							<AvatarFallback className="text-lg bg-primary/10">
								{staffMember.name
									.split(" ")
									.map((n) => n[0])
									.join("")}
							</AvatarFallback>
						</Avatar>
						<div className="flex-1">
							<h3 className="font-semibold text-lg">{staffMember.name}</h3>
							<div className="flex items-center gap-2 mt-1">
								{alert.type === "staff-no-show" && (
									<Badge variant="destructive">NO SHOW</Badge>
								)}
								{alert.type === "staff-late" && (
									<Badge className="bg-orange-500">LATE ARRIVAL</Badge>
								)}
								{alert.type === "staff-early-departure" && (
									<Badge className="bg-yellow-500">EARLY DEPARTURE</Badge>
								)}
							</div>
						</div>
					</div>
				</Card>
			)}

			{/* Time Details */}
			{(metadata?.scheduledTime || metadata?.actualCheckIn || metadata?.actualDeparture) && (
				<Card className="p-4 space-y-4">
					<h3 className="font-semibold">Time Details</h3>
					<div className="space-y-3 text-sm">
						{metadata.scheduledTime && (
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground">Scheduled Time</span>
								<span className="font-medium">{metadata.scheduledTime}</span>
							</div>
						)}
						{metadata.actualCheckIn && (
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground">Actual Check-in</span>
								<span className="font-medium text-orange-600 dark:text-orange-500">
									{metadata.actualCheckIn}
								</span>
							</div>
						)}
						{metadata.actualDeparture && (
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground">Departed At</span>
								<span className="font-medium text-orange-600 dark:text-orange-500">
									{metadata.actualDeparture}
								</span>
							</div>
						)}
						{metadata.scheduledEnd && (
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground">Scheduled End</span>
								<span className="font-medium">{metadata.scheduledEnd}</span>
							</div>
						)}
						{metadata.delayMinutes && (
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground">Delay</span>
								<span className="font-semibold text-orange-600 dark:text-orange-500">
									{metadata.delayMinutes} minutes
								</span>
							</div>
						)}
					</div>
				</Card>
			)}

			{/* Impact Summary */}
			{(metadata?.affectedAppointments || metadata?.potentialRevenueLoss) && (
				<div className="grid grid-cols-2 gap-4">
					{metadata.affectedAppointments !== undefined && (
						<Card className="p-4">
							<div className="flex items-center gap-3">
								<div className="rounded-lg bg-destructive/10 p-2">
									<Calendar className="h-5 w-5 text-destructive" />
								</div>
								<div>
									<p className="text-sm text-muted-foreground">Affected Appointments</p>
									<p className="text-2xl font-bold">{metadata.affectedAppointments}</p>
								</div>
							</div>
						</Card>
					)}
					{metadata.potentialRevenueLoss && (
						<Card className="p-4">
							<div className="flex items-center gap-3">
								<div className="rounded-lg bg-destructive/10 p-2">
									<DollarSign className="h-5 w-5 text-destructive" />
								</div>
								<div>
									<p className="text-sm text-muted-foreground">Revenue at Risk</p>
									<p className="text-2xl font-bold">${metadata.potentialRevenueLoss}</p>
								</div>
							</div>
						</Card>
					)}
				</div>
			)}

			{/* Reason */}
			{metadata?.reason && (
				<Card className="p-4">
					<h3 className="font-semibold mb-2">Reason</h3>
					<p className="text-sm text-muted-foreground">{metadata.reason}</p>
				</Card>
			)}

			{/* Possible Replacements */}
			{metadata?.possibleReplacements && metadata.possibleReplacements.length > 0 && (
				<div className="space-y-3">
					<h3 className="font-semibold">Available Replacements</h3>
					<div className="space-y-2">
						{metadata.possibleReplacements.map((replacement: any) => (
							<Card key={replacement.id} className="p-4">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<Avatar className="h-12 w-12">
											<AvatarFallback className="bg-primary/10">
												{replacement.name
													.split(" ")
													.map((n: string) => n[0])
													.join("")}
											</AvatarFallback>
										</Avatar>
										<div>
											<p className="font-semibold">{replacement.name}</p>
										</div>
									</div>
									<Button size="sm">Assign</Button>
								</div>
							</Card>
						))}
					</div>
				</div>
			)}

			{/* Actions */}
			{alert.status !== "resolved" && alert.type === "staff-no-show" && (
				<div className="space-y-2">
					<h3 className="font-semibold">Actions</h3>
					<div className="grid gap-2">
						<Button className="w-full justify-start">
							<Users className="h-4 w-4 mr-2" />
							Find Replacement Staff
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
