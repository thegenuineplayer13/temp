import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronRight, Check } from "lucide-react";
import type {
	Request,
	ConflictDay,
} from "@/features/core/types/types.notifications";
import type { Employee } from "@/features/core/types/types.staff";
import type { Appointment } from "@/features/core/types/types.dashboard-front-desk";
import type { WorkingHours, TimeOffEntry } from "@/features/core/types/types.calendar";
import type { ServiceRelationship } from "@/features/core/types/types.services";
import { DayAssignmentSheet } from "./day-assignment-sheet";

interface ManualAssignmentSheetProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	request: Request;
	allEmployees: Employee[];
	appointments: Appointment[];
	workingHours: WorkingHours[];
	timeOffEntries: TimeOffEntry[];
	serviceRelationships: ServiceRelationship;
	onUpdateConflicts: (updatedRequest: Request) => void;
}

export function ManualAssignmentSheet({
	open,
	onOpenChange,
	request,
	allEmployees,
	appointments,
	workingHours,
	timeOffEntries,
	serviceRelationships,
	onUpdateConflicts,
}: ManualAssignmentSheetProps) {
	const [selectedDay, setSelectedDay] = useState<ConflictDay | null>(null);

	if (!request.conflicts) return null;

	const handleDayAssigned = (updatedRequest: Request) => {
		onUpdateConflicts(updatedRequest);
		setSelectedDay(null);
	};

	const formatDate = (dateStr: string) => {
		const date = new Date(dateStr);
		return date.toLocaleDateString("en-US", {
			weekday: "short",
			month: "short",
			day: "numeric",
		});
	};

	return (
		<>
			<Sheet open={open} onOpenChange={onOpenChange}>
				<SheetContent side="bottom" className="h-[85vh]">
					<SheetHeader>
						<SheetTitle className="flex items-center gap-2">
							<Calendar className="h-5 w-5" />
							Manual Assignment
						</SheetTitle>
					</SheetHeader>

					<div className="mt-6 space-y-3 pb-6">
						<p className="text-sm text-muted-foreground">
							Tap each day to assign staff
						</p>

						{request.conflicts.days.map((day) => {
							const assigned = day.isResolved;
							const assignedStaff = day.assignments.fullDay?.staffName;

							return (
								<Card
									key={day.date}
									className={`p-4 cursor-pointer transition-all ${
										assigned
											? "bg-green-500/5 border-green-500/30"
											: "hover:border-primary/50"
									}`}
									onClick={() => setSelectedDay(day)}
								>
									<div className="flex items-center justify-between">
										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-2">
												<p className="font-medium text-sm">
													{formatDate(day.date)}
												</p>
												{assigned && (
													<Badge variant="default" className="bg-green-600 hover:bg-green-600">
														<Check className="h-3 w-3 mr-1" />
														Assigned
													</Badge>
												)}
											</div>
											<p className="text-xs text-muted-foreground mt-1">
												{day.totalAppointments} appointments
												{assigned && assignedStaff && ` → ${assignedStaff}`}
											</p>
										</div>
										{!assigned ? (
											<Button size="sm" variant="outline">
												Assign
											</Button>
										) : (
											<Button size="sm" variant="ghost">
												<ChevronRight className="h-4 w-4" />
											</Button>
										)}
									</div>
								</Card>
							);
						})}
					</div>
				</SheetContent>
			</Sheet>

			{/* Day Assignment Sub-Sheet */}
			{selectedDay && (
				<DayAssignmentSheet
					open={!!selectedDay}
					onOpenChange={(open) => !open && setSelectedDay(null)}
					day={selectedDay}
					request={request}
					allEmployees={allEmployees}
					appointments={appointments}
					workingHours={workingHours}
					timeOffEntries={timeOffEntries}
					serviceRelationships={serviceRelationships}
					onAssign={handleDayAssigned}
				/>
			)}
		</>
	);
}
