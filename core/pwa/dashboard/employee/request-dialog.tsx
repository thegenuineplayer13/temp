import { useState, useEffect } from "react";
import { ResponsiveDialog } from "@/components/shared/responsive-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import {
	CalendarIcon,
	Palmtree,
	Thermometer,
	Heart,
	Calendar as CalendarDays,
	Clock,
	Package,
	GraduationCap,
	Send,
	Info,
	CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// Request types
const REQUEST_TYPES = [
	"day-off",
	"vacation",
	"sick-leave",
	"personal-day",
	"bereavement",
	"schedule-change",
	"equipment-request",
	"training-request",
] as const;

type RequestType = (typeof REQUEST_TYPES)[number];

// Configuration for each request type
const REQUEST_CONFIG: Record<
	RequestType,
	{
		label: string;
		icon: typeof CalendarIcon;
		color: string;
		bgColor: string;
		requiresDate: boolean;
		requiresDateRange: boolean;
		description: string;
		placeholder: string;
	}
> = {
	"day-off": {
		label: "Day Off",
		icon: CalendarDays,
		color: "text-blue-600 dark:text-blue-500",
		bgColor: "bg-blue-500/10",
		requiresDate: true,
		requiresDateRange: false,
		description: "Request a single day off",
		placeholder: "e.g., Personal appointment, family event...",
	},
	vacation: {
		label: "Vacation",
		icon: Palmtree,
		color: "text-green-600 dark:text-green-500",
		bgColor: "bg-green-500/10",
		requiresDate: true,
		requiresDateRange: true,
		description: "Request vacation time (multiple days)",
		placeholder: "e.g., Family vacation, travel plans...",
	},
	"sick-leave": {
		label: "Sick Leave",
		icon: Thermometer,
		color: "text-red-600 dark:text-red-500",
		bgColor: "bg-red-500/10",
		requiresDate: true,
		requiresDateRange: false,
		description: "Report sick leave",
		placeholder: "e.g., Flu symptoms, doctor appointment...",
	},
	"personal-day": {
		label: "Personal Day",
		icon: Heart,
		color: "text-purple-600 dark:text-purple-500",
		bgColor: "bg-purple-500/10",
		requiresDate: true,
		requiresDateRange: false,
		description: "Request a personal day",
		placeholder: "e.g., Personal matters, family time...",
	},
	bereavement: {
		label: "Bereavement",
		icon: Heart,
		color: "text-gray-600 dark:text-gray-400",
		bgColor: "bg-gray-500/10",
		requiresDate: true,
		requiresDateRange: true,
		description: "Request bereavement leave",
		placeholder: "e.g., Family member passed away...",
	},
	"schedule-change": {
		label: "Schedule Change",
		icon: Clock,
		color: "text-orange-600 dark:text-orange-500",
		bgColor: "bg-orange-500/10",
		requiresDate: false,
		requiresDateRange: false,
		description: "Request a schedule modification",
		placeholder: "e.g., Start 1 hour later on Wednesdays...",
	},
	"equipment-request": {
		label: "Equipment",
		icon: Package,
		color: "text-cyan-600 dark:text-cyan-500",
		bgColor: "bg-cyan-500/10",
		requiresDate: false,
		requiresDateRange: false,
		description: "Request new equipment or supplies",
		placeholder: "e.g., Need new styling chair, equipment malfunction...",
	},
	"training-request": {
		label: "Training",
		icon: GraduationCap,
		color: "text-indigo-600 dark:text-indigo-500",
		bgColor: "bg-indigo-500/10",
		requiresDate: false,
		requiresDateRange: false,
		description: "Request training or professional development",
		placeholder: "e.g., Advanced techniques workshop, certification renewal...",
	},
};

interface RequestDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function RequestDialog({ open, onOpenChange }: RequestDialogProps) {
	const [step, setStep] = useState(1);
	const [selectedType, setSelectedType] = useState<RequestType>("day-off");
	const [startDate, setStartDate] = useState<Date | undefined>();
	const [endDate, setEndDate] = useState<Date | undefined>();
	const [reason, setReason] = useState("");

	const config = REQUEST_CONFIG[selectedType];

	useEffect(() => {
		if (!open) {
			// Reset on close
			setTimeout(() => {
				setStep(1);
				setSelectedType("day-off");
				setStartDate(undefined);
				setEndDate(undefined);
				setReason("");
			}, 300);
		}
	}, [open]);

	const handleClose = () => {
		onOpenChange(false);
	};

	const handleNext = () => {
		setStep((prev) => prev + 1);
	};

	const handleBack = () => {
		setStep((prev) => Math.max(1, prev - 1));
	};

	const handleSubmit = () => {
		console.log("Request submitted:", {
			type: selectedType,
			startDate: startDate?.toISOString(),
			endDate: endDate?.toISOString(),
			reason,
		});
		// TODO: Send request to backend
		handleClose();
	};

	const canProceedFromStep1 = selectedType !== null;
	const canProceedFromStep2 = !config.requiresDate || (startDate && (!config.requiresDateRange || endDate));

	const getStepTitle = () => {
		switch (step) {
			case 1:
				return "Select Request Type";
			case 2:
				return config.requiresDate
					? config.requiresDateRange
						? "Select Date Range"
						: "Select Date"
					: "Add Details";
			case 3:
				return "Review & Submit";
			default:
				return "";
		}
	};

	const getStepDescription = () => {
		switch (step) {
			case 1:
				return "Choose the type of request you want to submit";
			case 2:
				return config.requiresDate
					? "Select the date(s) for your request"
					: "Add any additional details or notes";
			case 3:
				return "Review your request before submitting";
			default:
				return "";
		}
	};

	const totalSteps = config.requiresDate ? 3 : 2;

	const footer =
		step < totalSteps ? (
			<div className="flex gap-3 w-full">
				{step > 1 ? (
					<>
						<Button variant="outline" onClick={handleBack} size="lg" className="w-32">
							Back
						</Button>
						<Button
							onClick={handleNext}
							disabled={step === 2 && config.requiresDate && !canProceedFromStep2}
							size="lg"
							className="flex-1"
						>
							Continue
						</Button>
					</>
				) : (
					<>
						<Button variant="outline" onClick={handleClose} size="lg" className="w-32">
							Cancel
						</Button>
						<Button onClick={handleNext} disabled={!canProceedFromStep1} size="lg" className="flex-1">
							Continue
						</Button>
					</>
				)}
			</div>
		) : (
			<div className="flex gap-3 w-full">
				<Button variant="outline" onClick={handleBack} size="lg" className="w-32">
					Back
				</Button>
				<Button onClick={handleSubmit} size="lg" className="flex-1">
					<Send className="h-4 w-4 mr-2" />
					Submit Request
				</Button>
			</div>
		);

	return (
		<ResponsiveDialog
			open={open}
			onOpenChange={handleClose}
			title={getStepTitle()}
			description={getStepDescription()}
			footer={footer}
			className="sm:max-w-2xl"
		>
			<div className="space-y-6">
				{/* Step 1: Select Request Type */}
				{step === 1 && (
					<RadioGroup value={selectedType} onValueChange={(value) => setSelectedType(value as RequestType)}>
						<div className="grid grid-cols-2 gap-3">
							{REQUEST_TYPES.map((type) => {
								const typeConfig = REQUEST_CONFIG[type];
								const isSelected = selectedType === type;
								return (
									<Card
										key={type}
										className={cn(
											"relative cursor-pointer transition-all",
											isSelected ? "border-primary ring-2 ring-primary/20" : "hover:border-primary/50"
										)}
									>
										<label className="flex items-center gap-3 p-4 cursor-pointer">
											<RadioGroupItem value={type} id={type} className="mt-0.5" />
											<div className="flex-1 min-w-0">
												<div className="flex items-center gap-2 mb-1">
													<div className={cn("p-1.5 rounded-lg", typeConfig.bgColor)}>
														<typeConfig.icon className={cn("h-4 w-4", typeConfig.color)} />
													</div>
													<span className="font-medium text-sm">{typeConfig.label}</span>
												</div>
												<p className="text-xs text-muted-foreground line-clamp-1">
													{typeConfig.description}
												</p>
											</div>
										</label>
									</Card>
								);
							})}
						</div>
					</RadioGroup>
				)}

				{/* Step 2: Date Selection or Details */}
				{step === 2 && (
					<>
						{config.requiresDate ? (
							<div className="space-y-4">
								<div className="space-y-3">
									<Label className="text-base">
										{config.requiresDateRange ? "Start Date" : "Date"}
									</Label>
									<div className="space-y-3">
										<Calendar
											mode="single"
											selected={startDate}
											onSelect={setStartDate}
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
												head_cell:
													"text-muted-foreground rounded-md w-full font-normal text-[0.8rem]",
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
										{startDate && (
											<div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg border border-primary/20">
												<CalendarIcon className="h-4 w-4 text-primary" />
												<span className="text-sm font-medium text-primary">
													{format(startDate, "EEEE, MMMM d, yyyy")}
												</span>
											</div>
										)}
									</div>
								</div>

								{config.requiresDateRange && (
									<div className="space-y-3">
										<Label className="text-base">End Date</Label>
										<div className="space-y-3">
											<Calendar
												mode="single"
												selected={endDate}
												onSelect={setEndDate}
												disabled={(date) => {
													if (date < new Date(new Date().setHours(0, 0, 0, 0))) return true;
													if (startDate && date < startDate) return true;
													return false;
												}}
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
													head_cell:
														"text-muted-foreground rounded-md w-full font-normal text-[0.8rem]",
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
											{endDate && (
												<div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg border border-primary/20">
													<CalendarIcon className="h-4 w-4 text-primary" />
													<span className="text-sm font-medium text-primary">
														{format(endDate, "EEEE, MMMM d, yyyy")}
													</span>
												</div>
											)}
										</div>
									</div>
								)}
							</div>
						) : (
							<div className="space-y-2">
								<Label htmlFor="reason" className="text-base">
									Details <span className="text-xs text-muted-foreground">(Optional)</span>
								</Label>
								<Textarea
									id="reason"
									placeholder={config.placeholder}
									value={reason}
									onChange={(e) => setReason(e.target.value)}
									rows={6}
									className="resize-none"
								/>
							</div>
						)}
					</>
				)}

				{/* Step 3: Review & Submit */}
				{step === 3 && config.requiresDate && (
					<div className="space-y-4">
						{/* Request Type */}
						<Card className="p-4">
							<div className="flex items-center gap-3">
								<div className={cn("p-2.5 rounded-lg", config.bgColor)}>
									<config.icon className={cn("h-5 w-5", config.color)} />
								</div>
								<div className="flex-1">
									<p className="text-xs text-muted-foreground">Request Type</p>
									<p className="font-semibold">{config.label}</p>
								</div>
								<CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500" />
							</div>
						</Card>

						{/* Dates */}
						<Card className="p-4">
							<div className="flex items-center gap-3 mb-3">
								<CalendarIcon className="h-5 w-5 text-muted-foreground" />
								<p className="text-xs text-muted-foreground">
									{config.requiresDateRange ? "Date Range" : "Date"}
								</p>
							</div>
							<div className="space-y-2">
								{startDate && (
									<div className="flex items-center gap-2">
										<Badge variant="secondary" className="font-medium">
											{config.requiresDateRange ? "Start" : "Date"}
										</Badge>
										<span className="text-sm">{format(startDate, "EEEE, MMMM d, yyyy")}</span>
									</div>
								)}
								{config.requiresDateRange && endDate && (
									<div className="flex items-center gap-2">
										<Badge variant="secondary" className="font-medium">
											End
										</Badge>
										<span className="text-sm">{format(endDate, "EEEE, MMMM d, yyyy")}</span>
									</div>
								)}
							</div>
						</Card>

						{/* Optional Reason */}
						<div className="space-y-2">
							<Label htmlFor="reason" className="text-base">
								Reason or Note <span className="text-xs text-muted-foreground">(Optional)</span>
							</Label>
							<Textarea
								id="reason"
								placeholder={config.placeholder}
								value={reason}
								onChange={(e) => setReason(e.target.value)}
								rows={4}
								className="resize-none"
							/>
						</div>

						{/* Info Banner */}
						<div className="flex items-start gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
							<Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
							<p className="text-xs text-blue-700 dark:text-blue-400">
								Your request will be sent to management for review. You'll receive a notification once it's been
								approved or rejected.
							</p>
						</div>
					</div>
				)}

				{/* For non-date requests, step 2 is the final review */}
				{step === 2 && !config.requiresDate && (
					<div className="mt-4">
						<div className="flex items-start gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
							<Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
							<p className="text-xs text-blue-700 dark:text-blue-400">
								Your {config.label.toLowerCase()} request will be sent to management for review. You'll receive
								a notification once it's been approved or rejected.
							</p>
						</div>
					</div>
				)}
			</div>
		</ResponsiveDialog>
	);
}
