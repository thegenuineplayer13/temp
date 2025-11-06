import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ResponsiveDialog } from "@/components/shared/responsive-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Calendar as CalendarIcon,
	Clock,
	User,
	Send,
	CheckCircle2,
	CalendarDays,
	Info,
	Users,
	Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// Swap types
const SWAP_TYPES = ["days", "appointments"] as const;
type SwapType = (typeof SWAP_TYPES)[number];

// Mock data for demonstration - in real implementation, this would come from the store/API
const MOCK_CURRENT_EMPLOYEE_ID = "emp-1";

const MOCK_UPCOMING_APPOINTMENTS = [
	{
		id: "apt-1",
		date: "2024-11-08",
		startTime: "09:00",
		endTime: "10:00",
		customerName: "John Doe",
		service: "Haircut",
		serviceId: "a",
	},
	{
		id: "apt-2",
		date: "2024-11-08",
		startTime: "10:30",
		endTime: "11:30",
		customerName: "Jane Smith",
		service: "Hair Color",
		serviceId: "d",
	},
	{
		id: "apt-3",
		date: "2024-11-09",
		startTime: "14:00",
		endTime: "15:00",
		customerName: "Bob Johnson",
		service: "Haircut & Beard Trim",
		serviceId: "a",
	},
];

const MOCK_ELIGIBLE_COLLEAGUES = [
	{
		id: "emp-2",
		name: "John Smith",
		specializationIds: ["1", "2"],
		matchingServices: ["Haircut", "Beard Trim"],
		avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
	},
	{
		id: "emp-4",
		name: "Michael Brown",
		specializationIds: ["1", "3"],
		matchingServices: ["Haircut", "Hair Color"],
		avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
	},
	{
		id: "emp-6",
		name: "David Wilson",
		specializationIds: ["1", "2", "3"],
		matchingServices: ["Haircut", "Beard Trim", "Hair Color"],
		avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
	},
];

// Form schema
const swapFormSchema = z.object({
	swapType: z.enum(SWAP_TYPES),
	selectedDates: z.array(z.date()).optional(),
	selectedAppointmentIds: z.array(z.string()).optional(),
	selectedColleagueIds: z.array(z.string()).min(1, "Select at least one colleague"),
	reason: z.string().optional(),
});

type SwapFormData = z.infer<typeof swapFormSchema>;

interface SwapShiftsDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function SwapShiftsDialog({ open, onOpenChange }: SwapShiftsDialogProps) {
	const [swapType, setSwapType] = useState<SwapType>("days");
	const [selectedDates, setSelectedDates] = useState<Date[]>([]);
	const [selectedAppointmentIds, setSelectedAppointmentIds] = useState<string[]>([]);
	const [selectedColleagueIds, setSelectedColleagueIds] = useState<string[]>([]);

	const {
		register,
		handleSubmit,
		setValue,
		reset,
		formState: { errors },
	} = useForm<SwapFormData>({
		resolver: zodResolver(swapFormSchema),
		mode: "onChange",
		defaultValues: {
			swapType: "days",
			selectedDates: [],
			selectedAppointmentIds: [],
			selectedColleagueIds: [],
			reason: "",
		},
	});

	// Update form when swap type changes
	useEffect(() => {
		setValue("swapType", swapType);
		// Reset selections when switching type
		setSelectedDates([]);
		setSelectedAppointmentIds([]);
		setValue("selectedDates", []);
		setValue("selectedAppointmentIds", []);
	}, [swapType, setValue]);

	// Update form when selections change
	useEffect(() => {
		setValue("selectedDates", selectedDates, { shouldValidate: true });
	}, [selectedDates, setValue]);

	useEffect(() => {
		setValue("selectedAppointmentIds", selectedAppointmentIds, { shouldValidate: true });
	}, [selectedAppointmentIds, setValue]);

	useEffect(() => {
		setValue("selectedColleagueIds", selectedColleagueIds, { shouldValidate: true });
	}, [selectedColleagueIds, setValue]);

	// Filter eligible colleagues based on selected items
	const eligibleColleagues = useMemo(() => {
		if (swapType === "appointments" && selectedAppointmentIds.length > 0) {
			// In real implementation, filter based on service compatibility
			return MOCK_ELIGIBLE_COLLEAGUES;
		}
		// For days, all active colleagues are eligible
		return MOCK_ELIGIBLE_COLLEAGUES;
	}, [swapType, selectedAppointmentIds]);

	const onSubmit = (data: SwapFormData) => {
		console.log("Swap shift request submitted:", {
			...data,
			selectedDates: data.selectedDates?.map((d) => d.toISOString()),
		});
		// TODO: Send swap request to backend
		handleClose();
	};

	const handleClose = () => {
		reset();
		setSwapType("days");
		setSelectedDates([]);
		setSelectedAppointmentIds([]);
		setSelectedColleagueIds([]);
		onOpenChange(false);
	};

	const toggleAppointment = (appointmentId: string) => {
		setSelectedAppointmentIds((prev) =>
			prev.includes(appointmentId)
				? prev.filter((id) => id !== appointmentId)
				: [...prev, appointmentId]
		);
	};

	const toggleColleague = (colleagueId: string) => {
		setSelectedColleagueIds((prev) =>
			prev.includes(colleagueId) ? prev.filter((id) => id !== colleagueId) : [...prev, colleagueId]
		);
	};

	const isFormValid =
		(swapType === "days" && selectedDates.length > 0) ||
		(swapType === "appointments" && selectedAppointmentIds.length > 0);

	const canSubmit = isFormValid && selectedColleagueIds.length > 0;

	return (
		<ResponsiveDialog
			open={open}
			onOpenChange={handleClose}
			title="Swap Shifts"
			description="Request to swap your shifts with colleagues"
			footer={
				<div className="flex gap-2 w-full">
					<Button type="button" variant="outline" onClick={handleClose} className="flex-1">
						Cancel
					</Button>
					<Button type="submit" form="swap-form" className="flex-1" disabled={!canSubmit}>
						<Send className="h-4 w-4 mr-2" />
						Send Request
					</Button>
				</div>
			}
			className="sm:max-w-2xl"
		>
			<form id="swap-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				{/* Step 1: Choose Swap Type */}
				<div className="space-y-3">
					<Label className="text-base">What do you want to swap?</Label>
					<RadioGroup value={swapType} onValueChange={(value) => setSwapType(value as SwapType)}>
						<div className="grid grid-cols-2 gap-3">
							<Card
								className={cn(
									"relative cursor-pointer transition-all",
									swapType === "days" ? "border-primary ring-2 ring-primary/20" : "hover:border-primary/50"
								)}
							>
								<label className="flex items-center gap-3 p-4 cursor-pointer">
									<RadioGroupItem value="days" id="days" className="mt-0.5" />
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2 mb-1">
											<div className="p-1.5 rounded-lg bg-blue-500/10">
												<CalendarDays className="h-4 w-4 text-blue-600 dark:text-blue-500" />
											</div>
											<span className="font-medium text-sm">Full Days</span>
										</div>
										<p className="text-xs text-muted-foreground">Swap entire work days</p>
									</div>
								</label>
							</Card>

							<Card
								className={cn(
									"relative cursor-pointer transition-all",
									swapType === "appointments"
										? "border-primary ring-2 ring-primary/20"
										: "hover:border-primary/50"
								)}
							>
								<label className="flex items-center gap-3 p-4 cursor-pointer">
									<RadioGroupItem value="appointments" id="appointments" className="mt-0.5" />
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2 mb-1">
											<div className="p-1.5 rounded-lg bg-purple-500/10">
												<Clock className="h-4 w-4 text-purple-600 dark:text-purple-500" />
											</div>
											<span className="font-medium text-sm">Appointments</span>
										</div>
										<p className="text-xs text-muted-foreground">Swap specific appointments</p>
									</div>
								</label>
							</Card>
						</div>
					</RadioGroup>
				</div>

				{/* Step 2: Select What to Give Away */}
				<div className="space-y-3">
					<Label className="text-base">
						{swapType === "days" ? "Select Days to Give Away" : "Select Appointments to Give Away"}
					</Label>

					{swapType === "days" ? (
						// Days Selection
						<div className="space-y-3">
							<Calendar
								mode="multiple"
								selected={selectedDates}
								onSelect={(dates) => setSelectedDates(dates || [])}
								disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
								className="rounded-lg border w-full"
								classNames={{
									months: "flex flex-col w-full",
									month: "space-y-4 w-full",
									caption: "flex justify-center pt-1 relative items-center",
									caption_label: "text-sm font-medium",
									nav: "space-x-1 flex items-center",
									nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
									nav_button_previous: "absolute left-1",
									nav_button_next: "absolute right-1",
									table: "w-full border-collapse space-y-1",
									head_row: "flex w-full",
									head_cell: "text-muted-foreground rounded-md w-full font-normal text-[0.8rem]",
									row: "flex w-full mt-2",
									cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 w-full",
									day: "h-9 w-full p-0 font-normal aria-selected:opacity-100",
									day_selected:
										"bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
									day_today: "bg-accent text-accent-foreground",
									day_outside: "text-muted-foreground opacity-50",
									day_disabled: "text-muted-foreground opacity-50",
									day_hidden: "invisible",
								}}
							/>
							{selectedDates.length > 0 && (
								<div className="space-y-2">
									<div className="flex items-center justify-between">
										<span className="text-sm font-medium">
											{selectedDates.length} {selectedDates.length === 1 ? "day" : "days"} selected
										</span>
										<Button
											type="button"
											variant="ghost"
											size="sm"
											onClick={() => setSelectedDates([])}
											className="h-8"
										>
											Clear all
										</Button>
									</div>
									<div className="flex flex-wrap gap-2">
										{selectedDates.map((date) => (
											<Badge key={date.toISOString()} variant="secondary" className="gap-1.5">
												<CalendarIcon className="h-3 w-3" />
												{format(date, "MMM d")}
											</Badge>
										))}
									</div>
								</div>
							)}
						</div>
					) : (
						// Appointments Selection
						<ScrollArea className="h-[240px] rounded-lg border">
							<div className="p-3 space-y-2">
								{MOCK_UPCOMING_APPOINTMENTS.length === 0 ? (
									<p className="text-sm text-muted-foreground text-center py-8">
										No upcoming appointments found.
									</p>
								) : (
									MOCK_UPCOMING_APPOINTMENTS.map((appointment) => {
										const isSelected = selectedAppointmentIds.includes(appointment.id);
										return (
											<Card
												key={appointment.id}
												className={cn(
													"cursor-pointer transition-all",
													isSelected
														? "border-purple-500/50 bg-purple-500/5"
														: "hover:border-purple-500/30 hover:bg-accent/50"
												)}
											>
												<div className="flex items-start gap-3 p-3">
													<Checkbox
														checked={isSelected}
														onCheckedChange={() => toggleAppointment(appointment.id)}
														className="mt-0.5"
													/>
													<div className="flex-1 min-w-0">
														<div className="flex items-center gap-2 mb-1">
															<CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
															<span className="text-sm font-medium">
																{new Date(appointment.date).toLocaleDateString("en-US", {
																	month: "short",
																	day: "numeric",
																})}
															</span>
															<Clock className="h-3.5 w-3.5 text-muted-foreground ml-2" />
															<span className="text-sm text-muted-foreground">
																{appointment.startTime} - {appointment.endTime}
															</span>
														</div>
														<p className="text-sm font-medium">{appointment.customerName}</p>
														<p className="text-xs text-muted-foreground">{appointment.service}</p>
													</div>
													{isSelected && (
														<CheckCircle2 className="h-5 w-5 text-purple-600 dark:text-purple-500 flex-shrink-0" />
													)}
												</div>
											</Card>
										);
									})
								)}
							</div>
						</ScrollArea>
					)}
				</div>

				{/* Step 3: Select Colleagues */}
				{isFormValid && (
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<Users className="h-5 w-5 text-muted-foreground" />
							<Label className="text-base">Send Request To</Label>
						</div>
						<p className="text-sm text-muted-foreground">
							Select one or more colleagues. The first to accept will cover your shift.
						</p>

						<ScrollArea className="h-[260px] rounded-lg border">
							<div className="p-3 space-y-2">
								{eligibleColleagues.length === 0 ? (
									<p className="text-sm text-muted-foreground text-center py-8">
										No eligible colleagues found for the selected shifts.
									</p>
								) : (
									eligibleColleagues.map((colleague) => {
										const isSelected = selectedColleagueIds.includes(colleague.id);
										return (
											<Card
												key={colleague.id}
												className={cn(
													"cursor-pointer transition-all",
													isSelected
														? "border-green-500/50 bg-green-500/5"
														: "hover:border-green-500/30 hover:bg-accent/50"
												)}
											>
												<div className="flex items-start gap-3 p-3">
													<Checkbox
														checked={isSelected}
														onCheckedChange={() => toggleColleague(colleague.id)}
														className="mt-0.5"
													/>
													<div className="flex-1 min-w-0">
														<div className="flex items-center gap-2 mb-1">
															<User className="h-4 w-4 text-muted-foreground" />
															<span className="text-sm font-medium">{colleague.name}</span>
														</div>
														<div className="flex items-center gap-1.5 flex-wrap">
															<Sparkles className="h-3 w-3 text-muted-foreground" />
															<span className="text-xs text-muted-foreground">
																{colleague.matchingServices.join(", ")}
															</span>
														</div>
													</div>
													{isSelected && (
														<CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500 flex-shrink-0" />
													)}
												</div>
											</Card>
										);
									})
								)}
							</div>
						</ScrollArea>
						{errors.selectedColleagueIds && (
							<p className="text-xs text-red-500">{errors.selectedColleagueIds.message}</p>
						)}
					</div>
				)}

				{/* Step 4: Optional Reason */}
				{isFormValid && selectedColleagueIds.length > 0 && (
					<div className="space-y-2">
						<Label htmlFor="reason" className="text-base">
							Reason <span className="text-xs text-muted-foreground">(Optional)</span>
						</Label>
						<Textarea
							id="reason"
							placeholder="e.g., Personal commitment, family event..."
							{...register("reason")}
							rows={3}
							className="resize-none"
						/>
					</div>
				)}

				{/* Info Banner */}
				<div className="flex items-start gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
					<Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
					<p className="text-xs text-blue-700 dark:text-blue-400">
						{selectedColleagueIds.length === 0
							? "Select colleagues who can cover your shift. They must be able to perform the required services."
							: selectedColleagueIds.length === 1
							? "Your request will be sent to the selected colleague for approval."
							: `Your request will be sent to ${selectedColleagueIds.length} colleagues. The first to accept will cover your shift.`}
					</p>
				</div>
			</form>
		</ResponsiveDialog>
	);
}
