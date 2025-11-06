import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Check, Clock, AlertTriangle, Send } from "lucide-react";
import type { ReplacementStaff } from "@/features/core/types/types.notifications";

interface StaffSelectorTieredProps {
	replacementStaff: ReplacementStaff[];
	selectedStaffId?: string;
	onSelectStaff: (staffId: string) => void;
	onSendOffer?: (staffId: string) => void;
	mode?: "full-day" | "specialization" | "individual";
	specializationLabel?: string;
}

export function StaffSelectorTiered({
	replacementStaff,
	selectedStaffId,
	onSelectStaff,
	onSendOffer,
	mode = "full-day",
	specializationLabel,
}: StaffSelectorTieredProps) {
	// Group staff by availability tier
	const availableStaff = replacementStaff.filter((s) => s.availability === "available");
	const needsApprovalStaff = replacementStaff.filter((s) => s.availability === "needs-approval");
	const unavailableStaff = replacementStaff.filter((s) => s.availability === "unavailable");

	// Filter by mode capabilities
	const filterByMode = (staff: ReplacementStaff[]): ReplacementStaff[] => {
		if (mode === "full-day") {
			return staff.filter((s) => s.canTakeFullDay);
		}
		return staff; // For specialization and individual modes, show all
	};

	const availableFiltered = filterByMode(availableStaff);
	const needsApprovalFiltered = filterByMode(needsApprovalStaff);

	return (
		<div className="space-y-4">
			{specializationLabel && (
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<span>Assigning for:</span>
					<Badge variant="outline">{specializationLabel}</Badge>
				</div>
			)}

			{/* Available Staff */}
			{availableFiltered.length > 0 && (
				<div className="space-y-2">
					<h4 className="text-sm font-semibold text-green-600 dark:text-green-500 flex items-center gap-2">
						<Check className="h-4 w-4" />
						Available ({availableFiltered.length})
					</h4>
					<div className="space-y-2">
						{availableFiltered.map((staff) => (
							<StaffOption
								key={staff.id}
								staff={staff}
								isSelected={selectedStaffId === staff.id}
								onSelect={onSelectStaff}
								mode={mode}
							/>
						))}
					</div>
				</div>
			)}

			{availableFiltered.length > 0 && needsApprovalFiltered.length > 0 && <Separator />}

			{/* Needs Approval Staff */}
			{needsApprovalFiltered.length > 0 && (
				<div className="space-y-2">
					<h4 className="text-sm font-semibold text-yellow-600 dark:text-yellow-500 flex items-center gap-2">
						<Clock className="h-4 w-4" />
						On Leave - Can Offer ({needsApprovalFiltered.length})
					</h4>
					<div className="space-y-2">
						{needsApprovalFiltered.map((staff) => (
							<StaffOfferOption
								key={staff.id}
								staff={staff}
								onSendOffer={onSendOffer}
								mode={mode}
							/>
						))}
					</div>
				</div>
			)}

			{(availableFiltered.length > 0 || needsApprovalFiltered.length > 0) &&
				unavailableStaff.length > 0 && <Separator />}

			{/* Unavailable Staff (collapsed/minimal) */}
			{unavailableStaff.length > 0 && (
				<div className="space-y-2">
					<h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
						<AlertTriangle className="h-4 w-4" />
						Unavailable ({unavailableStaff.length})
					</h4>
					<div className="text-xs text-muted-foreground">
						{unavailableStaff.map((s) => s.name).join(", ")}
					</div>
				</div>
			)}

			{/* No Options Available */}
			{availableFiltered.length === 0 && needsApprovalFiltered.length === 0 && (
				<Card className="p-4 bg-muted/50 border-dashed">
					<p className="text-sm text-muted-foreground text-center">
						No qualified staff available for this assignment.
						{mode === "full-day" && (
							<span className="block mt-1">Try splitting by specialization or individual assignments.</span>
						)}
					</p>
				</Card>
			)}
		</div>
	);
}

interface StaffOptionProps {
	staff: ReplacementStaff;
	isSelected: boolean;
	onSelect: (staffId: string) => void;
	mode: "full-day" | "specialization" | "individual";
}

function StaffOption({ staff, isSelected, onSelect, mode }: StaffOptionProps) {
	return (
		<Card
			className={cn(
				"p-3 cursor-pointer transition-all hover:border-primary/50",
				isSelected && "border-primary bg-primary/5",
			)}
			onClick={() => onSelect(staff.id)}
		>
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3 flex-1">
					<Avatar className="h-10 w-10">
						{staff.avatar && <AvatarImage src={staff.avatar} alt={staff.name} />}
						<AvatarFallback>
							{staff.name
								.split(" ")
								.map((n) => n[0])
								.join("")}
						</AvatarFallback>
					</Avatar>
					<div className="flex-1">
						<p className="font-medium text-sm">{staff.name}</p>
						<div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
							{mode === "full-day" && staff.canTakeFullDay && (
								<Badge variant="secondary" className="text-xs py-0 px-1.5">
									Can handle all services
								</Badge>
							)}
							<span>
								{staff.existingAppointments} apt{staff.existingAppointments !== 1 ? "s" : ""}
							</span>
							<span>•</span>
							<span>{staff.hoursScheduled.toFixed(1)}h scheduled</span>
						</div>
					</div>
				</div>
				{isSelected && <Check className="h-5 w-5 text-primary" />}
			</div>
		</Card>
	);
}

interface StaffOfferOptionProps {
	staff: ReplacementStaff;
	onSendOffer?: (staffId: string) => void;
	mode: "full-day" | "specialization" | "individual";
}

function StaffOfferOption({ staff, onSendOffer, mode }: StaffOfferOptionProps) {
	return (
		<Card className="p-3 bg-yellow-500/5 border-yellow-500/20">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3 flex-1">
					<Avatar className="h-10 w-10">
						{staff.avatar && <AvatarImage src={staff.avatar} alt={staff.name} />}
						<AvatarFallback>
							{staff.name
								.split(" ")
								.map((n) => n[0])
								.join("")}
						</AvatarFallback>
					</Avatar>
					<div className="flex-1">
						<p className="font-medium text-sm">{staff.name}</p>
						<div className="flex items-center gap-2 text-xs mt-1">
							<Badge variant="outline" className="text-xs py-0 px-1.5 border-yellow-500/30">
								On {staff.leaveType?.replace(/-/g, " ")}
							</Badge>
							{staff.willingToWork && (
								<span className="text-yellow-600 dark:text-yellow-500">Willing to help</span>
							)}
						</div>
						{mode === "full-day" && staff.canTakeFullDay && (
							<p className="text-xs text-muted-foreground mt-1">Can handle all services</p>
						)}
					</div>
				</div>
				{onSendOffer && (
					<Button
						size="sm"
						variant="outline"
						className="border-yellow-500/30 hover:bg-yellow-500/10"
						onClick={() => onSendOffer(staff.id)}
					>
						<Send className="h-3 w-3 mr-1" />
						Send Offer
					</Button>
				)}
			</div>
		</Card>
	);
}
