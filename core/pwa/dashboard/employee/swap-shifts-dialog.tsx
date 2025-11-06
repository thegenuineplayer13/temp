import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ResponsiveDialog } from "@/components/shared/responsive-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BadgeFilters } from "@/features/core/components/shared/badge-filters";
import { Calendar, Clock, User, Send, CheckCircle2, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

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
	},
	{
		id: "emp-4",
		name: "Michael Brown",
		specializationIds: ["1", "3"],
		matchingServices: ["Haircut", "Hair Color"],
	},
	{
		id: "emp-6",
		name: "David Wilson",
		specializationIds: ["1", "2", "3"],
		matchingServices: ["Haircut", "Beard Trim", "Hair Color"],
	},
];

// Form schema
const swapFormSchema = z.object({
	swapType: z.enum(SWAP_TYPES),
	selectedDates: z.array(z.string()).optional(),
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
	const [selectedDates, setSelectedDates] = useState<string[]>([]);
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
		console.log("Swap shift request submitted:", data);
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

	const swapTypeFilters = [
		{
			value: "days" as SwapType,
			label: "Full Days",
			color: "text-blue-600 dark:text-blue-500 border-blue-500/30 hover:bg-blue-500/10",
		},
		{
			value: "appointments" as SwapType,
			label: "Specific Appointments",
			color: "text-purple-600 dark:text-purple-500 border-purple-500/30 hover:bg-purple-500/10",
		},
	];

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
				<div className="space-y-2">
					<Label>What do you want to swap?</Label>
					<BadgeFilters
						filters={swapTypeFilters}
						selectedValue={swapType}
						onSelect={(value) => setSwapType(value)}
					/>
				</div>

				{/* Step 2: Select What to Give Away */}
				<div className="space-y-3">
					<Label>
						{swapType === "days" ? "Select Days to Give Away" : "Select Appointments to Give Away"}
					</Label>

					{swapType === "days" ? (
						// Days Selection
						<div className="space-y-2">
							<div className="flex gap-2">
								<Input
									type="date"
									onChange={(e) => {
										const date = e.target.value;
										if (date && !selectedDates.includes(date)) {
											setSelectedDates([...selectedDates, date]);
										}
									}}
									className="flex-1"
								/>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => setSelectedDates([])}
									disabled={selectedDates.length === 0}
								>
									Clear
								</Button>
							</div>
							{selectedDates.length > 0 && (
								<div className="flex flex-wrap gap-2">
									{selectedDates.map((date) => (
										<div
											key={date}
											className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-1.5"
										>
											<CalendarDays className="h-4 w-4 text-blue-600 dark:text-blue-500" />
											<span className="text-sm">{new Date(date).toLocaleDateString()}</span>
											<button
												type="button"
												onClick={() => setSelectedDates(selectedDates.filter((d) => d !== date))}
												className="ml-1 text-blue-600 dark:text-blue-500 hover:text-blue-700"
											>
												×
											</button>
										</div>
									))}
								</div>
							)}
						</div>
					) : (
						// Appointments Selection
						<div className="space-y-2">
							{MOCK_UPCOMING_APPOINTMENTS.length === 0 ? (
								<p className="text-sm text-muted-foreground">No upcoming appointments found.</p>
							) : (
								<div className="space-y-2 max-h-[200px] overflow-y-auto">
									{MOCK_UPCOMING_APPOINTMENTS.map((appointment) => {
										const isSelected = selectedAppointmentIds.includes(appointment.id);
										return (
											<div
												key={appointment.id}
												onClick={() => toggleAppointment(appointment.id)}
												className={cn(
													"flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
													isSelected
														? "bg-purple-500/10 border-purple-500/30"
														: "bg-card hover:bg-accent border-border"
												)}
											>
												<div
													className={cn(
														"h-5 w-5 mt-0.5 rounded border-2 flex items-center justify-center flex-shrink-0",
														isSelected
															? "bg-purple-600 border-purple-600"
															: "border-muted-foreground/30"
													)}
												>
													{isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
												</div>
												<div className="flex-1 min-w-0">
													<div className="flex items-center gap-2 mb-1">
														<Calendar className="h-4 w-4 text-muted-foreground" />
														<span className="text-sm font-medium">
															{new Date(appointment.date).toLocaleDateString()}
														</span>
														<Clock className="h-4 w-4 text-muted-foreground ml-2" />
														<span className="text-sm text-muted-foreground">
															{appointment.startTime} - {appointment.endTime}
														</span>
													</div>
													<p className="text-sm">{appointment.customerName}</p>
													<p className="text-xs text-muted-foreground">{appointment.service}</p>
												</div>
											</div>
										);
									})}
								</div>
							)}
						</div>
					)}
				</div>

				{/* Step 3: Select Colleagues */}
				{isFormValid && (
					<div className="space-y-3">
						<div>
							<Label>Send Request To</Label>
							<p className="text-xs text-muted-foreground mt-1">
								Select one or more colleagues. The first to accept will cover your shift.
							</p>
						</div>

						<div className="space-y-2 max-h-[240px] overflow-y-auto">
							{eligibleColleagues.length === 0 ? (
								<p className="text-sm text-muted-foreground">
									No eligible colleagues found for the selected shifts.
								</p>
							) : (
								eligibleColleagues.map((colleague) => {
									const isSelected = selectedColleagueIds.includes(colleague.id);
									return (
										<div
											key={colleague.id}
											onClick={() => toggleColleague(colleague.id)}
											className={cn(
												"flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
												isSelected
													? "bg-green-500/10 border-green-500/30"
													: "bg-card hover:bg-accent border-border"
											)}
										>
											<div
												className={cn(
													"h-5 w-5 mt-0.5 rounded border-2 flex items-center justify-center flex-shrink-0",
													isSelected ? "bg-green-600 border-green-600" : "border-muted-foreground/30"
												)}
											>
												{isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
											</div>
											<div className="flex-1 min-w-0">
												<div className="flex items-center gap-2 mb-1">
													<User className="h-4 w-4 text-muted-foreground" />
													<span className="text-sm font-medium">{colleague.name}</span>
													{isSelected && (
														<CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500 ml-auto" />
													)}
												</div>
												<p className="text-xs text-muted-foreground">
													Can handle: {colleague.matchingServices.join(", ")}
												</p>
											</div>
										</div>
									);
								})
							)}
						</div>
						{errors.selectedColleagueIds && (
							<p className="text-xs text-red-500">{errors.selectedColleagueIds.message}</p>
						)}
					</div>
				)}

				{/* Step 4: Optional Reason */}
				{isFormValid && (
					<div className="space-y-2">
						<Label htmlFor="reason">
							Reason <span className="text-muted-foreground text-xs">(Optional)</span>
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
				<div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
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
