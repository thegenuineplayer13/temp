import { useState } from "react";
import { ResponsiveModal, ResponsiveModalBody, ResponsiveModalFooter } from "@/components/ui/responsive-modal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Radio, Users, Clock, Check } from "lucide-react";
import type { Request } from "@/features/core/types/types.notifications";
import type { Employee } from "@/features/core/types/types.staff";
import { getEligibleStaffForBroadcast } from "@/features/core/lib/broadcast-utils";

interface BroadcastSheetProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	request: Request;
	allEmployees: Employee[];
	onSendBroadcast?: (notifyStaffIds: string[], deadlineHours: number) => void;
}

export function BroadcastSheet({
	open,
	onOpenChange,
	request,
	allEmployees,
	onSendBroadcast,
}: BroadcastSheetProps) {
	const [deadlineHours, setDeadlineHours] = useState<number>(24);
	const [allowFullDaysOnly, setAllowFullDaysOnly] = useState(true);
	const [allowIndividualDays, setAllowIndividualDays] = useState(true);
	const [showSuccess, setShowSuccess] = useState(false);

	if (!request.conflicts) return null;

	const eligibleStaff = getEligibleStaffForBroadcast(
		allEmployees,
		request.createdBy?.id || "",
	);

	const totalDays = request.conflicts.days.length;
	const totalAppointments = request.conflicts.total;

	const handleSend = () => {
		const allStaffIds = [
			...eligibleStaff.available.map((s) => s.id),
			...eligibleStaff.onFlexibleLeave.map((s) => s.id),
		];

		onSendBroadcast?.(allStaffIds, deadlineHours);
		setShowSuccess(true);

		// Auto-close after showing success
		setTimeout(() => {
			setShowSuccess(false);
			onOpenChange(false);
		}, 2000);
	};

	if (showSuccess) {
		return (
			<ResponsiveModal open={open} onOpenChange={onOpenChange} showHeader={false}>
				<div className="py-8 px-6 text-center space-y-4">
					<div className="flex justify-center">
						<div className="rounded-full bg-green-500/10 p-3">
							<Check className="h-8 w-8 text-green-600" />
						</div>
					</div>
					<div>
						<h3 className="font-semibold text-lg">Broadcast Sent!</h3>
						<p className="text-sm text-muted-foreground mt-1">
							Notified {eligibleStaff.total} staff members
						</p>
					</div>
				</div>
			</ResponsiveModal>
		);
	}

	return (
		<ResponsiveModal
			open={open}
			onOpenChange={onOpenChange}
			title={
				<div className="flex items-center gap-2">
					<Radio className="h-5 w-5" />
					Broadcast to Team
				</div>
			}
		>
			<ResponsiveModalBody className="space-y-6">
					{/* Overview */}
					<Card className="p-4 bg-primary/5 border-primary/20">
						<p className="text-sm">
							Send notification to staff asking who can cover these dates:
						</p>
						<div className="mt-3 space-y-1.5">
							{request.conflicts.days.map((day) => {
								const date = new Date(day.date);
								const formattedDate = date.toLocaleDateString("en-US", {
									weekday: "short",
									month: "short",
									day: "numeric",
								});

								return (
									<div
										key={day.date}
										className="flex items-center justify-between text-xs"
									>
										<span className="font-medium">{formattedDate}</span>
										<span className="text-muted-foreground">
											{day.totalAppointments} appointments
										</span>
									</div>
								);
							})}
						</div>
					</Card>

					{/* Broadcast Options */}
					<div className="space-y-4">
						<h4 className="font-semibold text-sm">Staff can volunteer to cover:</h4>

						<div className="space-y-3">
							<div className="flex items-start gap-3">
								<Checkbox
									id="full-days"
									checked={allowFullDaysOnly}
									onCheckedChange={(checked) => setAllowFullDaysOnly(!!checked)}
								/>
								<Label htmlFor="full-days" className="text-sm cursor-pointer">
									<div>
										<p className="font-medium">Full days only</p>
										<p className="text-xs text-muted-foreground">
											Staff must commit to all appointments on a day
										</p>
									</div>
								</Label>
							</div>

							<div className="flex items-start gap-3">
								<Checkbox
									id="individual-days"
									checked={allowIndividualDays}
									onCheckedChange={(checked) => setAllowIndividualDays(!!checked)}
								/>
								<Label htmlFor="individual-days" className="text-sm cursor-pointer">
									<div>
										<p className="font-medium">Individual days</p>
										<p className="text-xs text-muted-foreground">
											Staff can pick specific days to cover
										</p>
									</div>
								</Label>
							</div>
						</div>
					</div>

					{/* Response Deadline */}
					<div className="space-y-3">
						<h4 className="font-semibold text-sm flex items-center gap-2">
							<Clock className="h-4 w-4" />
							Response Deadline
						</h4>

						<RadioGroup value={deadlineHours.toString()} onValueChange={(v) => setDeadlineHours(Number(v))}>
							<div className="space-y-2">
								<Label
									htmlFor="deadline-24"
									className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-accent"
								>
									<RadioGroupItem value="24" id="deadline-24" />
									<span className="text-sm">24 hours</span>
								</Label>

								<Label
									htmlFor="deadline-48"
									className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-accent"
								>
									<RadioGroupItem value="48" id="deadline-48" />
									<span className="text-sm">48 hours</span>
								</Label>

								<Label
									htmlFor="deadline-72"
									className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-accent"
								>
									<RadioGroupItem value="72" id="deadline-72" />
									<span className="text-sm">3 days (72 hours)</span>
								</Label>
							</div>
						</RadioGroup>
					</div>

					{/* Who will be notified */}
					<Card className="p-4">
						<div className="flex items-center gap-2 mb-3">
							<Users className="h-4 w-4 text-muted-foreground" />
							<h4 className="font-semibold text-sm">Will notify:</h4>
						</div>

						<div className="space-y-2 text-sm">
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground">Available staff</span>
								<Badge variant="secondary">{eligibleStaff.available.length}</Badge>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground">On flexible leave</span>
								<Badge variant="secondary">{eligibleStaff.onFlexibleLeave.length}</Badge>
							</div>
							<div className="border-t pt-2 mt-2 flex items-center justify-between font-medium">
								<span>Total</span>
								<Badge>{eligibleStaff.total}</Badge>
							</div>
						</div>
					</Card>
			</ResponsiveModalBody>

			<ResponsiveModalFooter>
				<Button
					onClick={handleSend}
					disabled={eligibleStaff.total === 0}
					className="w-full"
					size="lg"
				>
					<Radio className="h-4 w-4 mr-2" />
					Send Broadcast
				</Button>
			</ResponsiveModalFooter>
		</ResponsiveModal>
	);
}
