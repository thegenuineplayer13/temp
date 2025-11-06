import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar, Clock, User, Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type {
	ConflictDay,
	ReplacementStaff,
	AssignmentMode,
} from "@/features/core/types/types.notifications";
import { StaffSelectorTiered } from "./staff-selector-tiered";

interface DayConflictCardProps {
	day: ConflictDay;
	replacementStaff: ReplacementStaff[];
	onAssignFullDay?: (staffId: string) => void;
	onAssignBySpecialization?: (specializationId: string, staffId: string) => void;
	onAssignIndividual?: (appointmentId: string, staffId: string) => void;
	onSendOffer?: (staffId: string) => void;
	onChangeMode?: (mode: AssignmentMode) => void;
}

export function DayConflictCard({
	day,
	replacementStaff,
	onAssignFullDay,
	onAssignBySpecialization,
	onAssignIndividual,
	onSendOffer,
	onChangeMode,
}: DayConflictCardProps) {
	const [isExpanded, setIsExpanded] = useState(!day.isResolved);
	const [mode, setMode] = useState<AssignmentMode>(day.assignmentMode);

	const handleModeChange = (newMode: AssignmentMode) => {
		setMode(newMode);
		onChangeMode?.(newMode);
	};

	// Format date for display
	const dateObj = new Date(day.date);
	const dayOfWeek = dateObj.toLocaleDateString("en-US", { weekday: "long" });
	const formattedDate = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

	// Calculate total hours
	const totalHours = day.appointments.reduce((sum, apt) => {
		const duration = apt.services.reduce((svcSum, svc) => svcSum + svc.duration, 0);
		return sum + duration;
	}, 0) / 60;

	return (
		<Card
			className={cn(
				"overflow-hidden transition-all",
				day.isResolved && "bg-green-500/5 border-green-500/30",
			)}
		>
			{/* Header */}
			<div
				className={cn(
					"p-4 cursor-pointer hover:bg-muted/50 transition-colors",
					day.isResolved && "bg-green-500/10",
				)}
				onClick={() => setIsExpanded(!isExpanded)}
			>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4 flex-1">
						<div className="flex items-center gap-2">
							<Calendar className="h-5 w-5 text-muted-foreground" />
							<div>
								<p className="font-semibold">{dayOfWeek}</p>
								<p className="text-sm text-muted-foreground">{formattedDate}</p>
							</div>
						</div>

						<Separator orientation="vertical" className="h-8" />

						<div className="flex items-center gap-4 text-sm">
							<div className="flex items-center gap-1.5">
								<Clock className="h-4 w-4 text-muted-foreground" />
								<span>{day.totalAppointments} appointments</span>
							</div>
							<span className="text-muted-foreground">•</span>
							<span>{totalHours.toFixed(1)} hours</span>
						</div>
					</div>

					<div className="flex items-center gap-2">
						{day.isResolved ? (
							<Badge variant="default" className="bg-green-600 hover:bg-green-600">
								<Check className="h-3 w-3 mr-1" />
								Resolved
							</Badge>
						) : (
							<Badge variant="outline" className="border-orange-500/30 text-orange-600">
								Pending
							</Badge>
						)}
						{isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
					</div>
				</div>
			</div>

			{/* Expanded Content */}
			{isExpanded && (
				<div className="p-4 pt-0 space-y-4">
					<Separator />

					{/* Appointment List */}
					<div className="space-y-2">
						<h4 className="text-sm font-semibold">Appointments</h4>
						<div className="space-y-2 max-h-60 overflow-y-auto">
							{day.appointments.map((apt) => (
								<Card key={apt.id} className="p-2 text-sm">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2 flex-1">
											<span className="font-mono text-xs text-muted-foreground">{apt.startTime}</span>
											<User className="h-3 w-3 text-muted-foreground" />
											<span className="font-medium">{apt.clientName}</span>
										</div>
										<div className="flex gap-1">
											{apt.services.map((svc, idx) => (
												<Badge key={idx} variant="secondary" className="text-xs">
													{svc.name}
												</Badge>
											))}
										</div>
									</div>
								</Card>
							))}
						</div>
					</div>

					{!day.isResolved && (
						<>
							<Separator />

							{/* Assignment Mode Tabs */}
							<div>
								<h4 className="text-sm font-semibold mb-3">Assignment Mode</h4>
								<Tabs value={mode} onValueChange={(v) => handleModeChange(v as AssignmentMode)}>
									<TabsList className="grid w-full grid-cols-3">
										<TabsTrigger value="single">Full Day</TabsTrigger>
										<TabsTrigger value="split">Split by Service</TabsTrigger>
										<TabsTrigger value="individual">Individual</TabsTrigger>
									</TabsList>

									<TabsContent value="single" className="mt-4">
										<div className="space-y-3">
											<p className="text-sm text-muted-foreground">
												Assign all {day.totalAppointments} appointments to a single staff member.
											</p>
											<StaffSelectorTiered
												replacementStaff={replacementStaff}
												selectedStaffId={day.assignments.fullDay?.staffId}
												onSelectStaff={onAssignFullDay || (() => {})}
												onSendOffer={onSendOffer}
												mode="full-day"
											/>
										</div>
									</TabsContent>

									<TabsContent value="split" className="mt-4">
										<div className="space-y-4">
											<p className="text-sm text-muted-foreground">
												Split appointments by specialization across multiple staff members.
											</p>
											{day.requiredSpecializationIds.map((specId) => {
												const specAppointments = day.appointments.filter((apt) =>
													apt.services.some((svc) => svc.specializationId === specId),
												);
												const specName = specAppointments[0]?.services.find(
													(s) => s.specializationId === specId,
												)?.name;

												return (
													<div key={specId} className="space-y-2">
														<Separator />
														<div className="flex items-center justify-between">
															<h5 className="text-sm font-medium">{specName}</h5>
															<span className="text-xs text-muted-foreground">
																{specAppointments.length} appointments
															</span>
														</div>
														<StaffSelectorTiered
															replacementStaff={replacementStaff.filter((s) =>
																s.specializationIds.includes(specId),
															)}
															selectedStaffId={
																day.assignments.bySpecialization?.find(
																	(a) => a.specializationId === specId,
																)?.staffId
															}
															onSelectStaff={(staffId) =>
																onAssignBySpecialization?.(specId, staffId)
															}
															onSendOffer={onSendOffer}
															mode="specialization"
															specializationLabel={specName}
														/>
													</div>
												);
											})}
										</div>
									</TabsContent>

									<TabsContent value="individual" className="mt-4">
										<div className="space-y-3">
											<p className="text-sm text-muted-foreground">
												Assign each appointment individually for maximum flexibility.
											</p>
											<div className="space-y-4">
												{day.appointments.map((apt) => (
													<div key={apt.id} className="space-y-2">
														<Card className="p-2 bg-muted/30">
															<div className="flex items-center gap-2 text-sm">
																<span className="font-mono text-xs">{apt.startTime}</span>
																<span>•</span>
																<span className="font-medium">{apt.clientName}</span>
																<span>•</span>
																{apt.services.map((svc, idx) => (
																	<Badge key={idx} variant="secondary" className="text-xs">
																		{svc.name}
																	</Badge>
																))}
															</div>
														</Card>
														<StaffSelectorTiered
															replacementStaff={replacementStaff.filter((s) =>
																apt.services.every((svc) => s.canTakeServiceIds.includes(svc.id)),
															)}
															selectedStaffId={
																day.assignments.individual?.find(
																	(a) => a.appointmentId === apt.id,
																)?.staffId
															}
															onSelectStaff={(staffId) => onAssignIndividual?.(apt.id, staffId)}
															onSendOffer={onSendOffer}
															mode="individual"
														/>
													</div>
												))}
											</div>
										</div>
									</TabsContent>
								</Tabs>
							</div>
						</>
					)}
				</div>
			)}
		</Card>
	);
}
