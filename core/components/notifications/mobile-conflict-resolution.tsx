import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Sparkles, AlertTriangle, CheckCircle2, Radio, Settings2 } from "lucide-react";
import type {
	Request,
	ConflictDay,
} from "@/features/core/types/types.notifications";
import type { Employee } from "@/features/core/types/types.staff";
import type { Appointment } from "@/features/core/types/types.dashboard-front-desk";
import type { WorkingHours, TimeOffEntry } from "@/features/core/types/types.calendar";
import type { ServiceRelationship } from "@/features/core/types/types.services";
import {
	generateSmartSuggestion,
	applySmartSuggestion,
	type SmartSuggestion,
} from "@/features/core/lib/smart-suggestion-utils";
import { ManualAssignmentSheet } from "./manual-assignment-sheet";
import { BroadcastSheet } from "./broadcast-sheet";

interface MobileConflictResolutionProps {
	request: Request;
	allEmployees: Employee[];
	appointments: Appointment[];
	workingHours: WorkingHours[];
	timeOffEntries: TimeOffEntry[];
	serviceRelationships: ServiceRelationship;
	onUpdateConflicts: (updatedRequest: Request) => void;
	onSendBroadcast?: (notifyStaffIds: string[], deadlineHours: number) => void;
}

export function MobileConflictResolution({
	request,
	allEmployees,
	appointments,
	workingHours,
	timeOffEntries,
	serviceRelationships,
	onUpdateConflicts,
	onSendBroadcast,
}: MobileConflictResolutionProps) {
	const [showManualSheet, setShowManualSheet] = useState(false);
	const [showBroadcastSheet, setShowBroadcastSheet] = useState(false);

	// Early return if no conflicts
	if (!request.conflicts || request.conflicts.total === 0) {
		return null;
	}

	// Generate smart suggestion
	const suggestion = generateSmartSuggestion(
		request,
		allEmployees,
		appointments,
		workingHours,
		timeOffEntries,
		serviceRelationships,
	);

	const handleAcceptSuggestion = () => {
		if (!suggestion.suggestion) return;
		const updatedRequest = applySmartSuggestion(request, suggestion);
		onUpdateConflicts(updatedRequest);
	};

	const allResolved = request.conflicts.resolved === request.conflicts.total;

	return (
		<>
			<Card className="bg-gradient-to-br from-orange-500/5 to-yellow-500/5 border-orange-500/20">
				<div className="p-4 space-y-4">
					{/* Header */}
					<div className="flex items-start gap-3">
						<AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-500 mt-0.5 flex-shrink-0" />
						<div className="flex-1 min-w-0">
							<h3 className="font-semibold text-sm">Appointment Conflicts</h3>
							<p className="text-xs text-muted-foreground mt-0.5">
								{request.conflicts.total} appointments need coverage
							</p>
						</div>
						<Badge
							variant={allResolved ? "default" : "outline"}
							className={
								allResolved
									? "bg-green-600 hover:bg-green-600 flex-shrink-0"
									: "border-orange-500/30 flex-shrink-0"
							}
						>
							{request.conflicts.resolved}/{request.conflicts.days.length}
						</Badge>
					</div>

					{!allResolved && (
						<>
							<Separator />

							{/* Smart Suggestion */}
							{suggestion.suggestion && suggestion.canAutoResolve && (
								<div className="space-y-3">
									<div className="flex items-center gap-2">
										<Sparkles className="h-4 w-4 text-primary" />
										<h4 className="font-semibold text-sm">Suggested Solution</h4>
										<Badge
											variant="secondary"
											className="ml-auto text-xs"
										>
											{suggestion.confidence} confidence
										</Badge>
									</div>

									<Card className="p-3 bg-background/50 border-primary/20">
										<div className="space-y-2">
											<div className="flex items-center justify-between">
												<div>
													<p className="font-medium text-sm">
														{suggestion.suggestion.staffName}
													</p>
													<p className="text-xs text-muted-foreground">
														{suggestion.suggestion.totalAppointments} appointments •{" "}
														{suggestion.suggestion.totalHours.toFixed(1)} hours
													</p>
												</div>
											</div>

											<div className="space-y-1">
												{suggestion.suggestion.reasons.map((reason, idx) => (
													<div key={idx} className="flex items-start gap-2 text-xs">
														<CheckCircle2 className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
														<span className="text-muted-foreground">{reason}</span>
													</div>
												))}
											</div>

											{suggestion.suggestion.days.length < request.conflicts.days.length && (
												<Alert variant="destructive" className="mt-2">
													<AlertDescription className="text-xs">
														Covers {suggestion.suggestion.days.length} of{" "}
														{request.conflicts.days.length} days. Manual assignment needed for
														remaining days.
													</AlertDescription>
												</Alert>
											)}
										</div>
									</Card>

									{/* Accept Button */}
									<Button
										onClick={handleAcceptSuggestion}
										className="w-full"
										size="lg"
									>
										<CheckCircle2 className="h-4 w-4 mr-2" />
										Accept Suggestion
									</Button>

									<div className="relative">
										<div className="absolute inset-0 flex items-center">
											<span className="w-full border-t" />
										</div>
										<div className="relative flex justify-center text-xs">
											<span className="bg-card px-2 text-muted-foreground">or</span>
										</div>
									</div>
								</div>
							)}

							{/* No auto-suggestion available */}
							{!suggestion.canAutoResolve && (
								<Alert>
									<AlertTriangle className="h-4 w-4" />
									<AlertDescription className="text-sm">
										{suggestion.manualReviewReason || "Manual assignment required"}
									</AlertDescription>
								</Alert>
							)}

							{/* Action Buttons */}
							<div className="space-y-2">
								<Button
									variant="outline"
									className="w-full justify-start"
									onClick={() => setShowManualSheet(true)}
								>
									<Settings2 className="h-4 w-4 mr-2" />
									Choose Manually
								</Button>

								<Button
									variant="outline"
									className="w-full justify-start"
									onClick={() => setShowBroadcastSheet(true)}
								>
									<Radio className="h-4 w-4 mr-2" />
									Broadcast to Team
								</Button>
							</div>
						</>
					)}

					{/* All Resolved */}
					{allResolved && (
						<Alert className="bg-green-500/10 border-green-500/30">
							<CheckCircle2 className="h-4 w-4 text-green-600" />
							<AlertDescription className="text-sm text-green-600 dark:text-green-500">
								All conflicts resolved! You can now approve this request.
							</AlertDescription>
						</Alert>
					)}
				</div>
			</Card>

			{/* Manual Assignment Sheet */}
			<ManualAssignmentSheet
				open={showManualSheet}
				onOpenChange={setShowManualSheet}
				request={request}
				allEmployees={allEmployees}
				appointments={appointments}
				workingHours={workingHours}
				timeOffEntries={timeOffEntries}
				serviceRelationships={serviceRelationships}
				onUpdateConflicts={onUpdateConflicts}
			/>

			{/* Broadcast Sheet */}
			<BroadcastSheet
				open={showBroadcastSheet}
				onOpenChange={setShowBroadcastSheet}
				request={request}
				allEmployees={allEmployees}
				onSendBroadcast={onSendBroadcast}
			/>
		</>
	);
}
