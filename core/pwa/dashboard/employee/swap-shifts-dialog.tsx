import { useState, useEffect, useMemo } from "react";
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

type SwapType = "days" | "appointments";

const MOCK_UPCOMING_APPOINTMENTS = [
	{ id: "apt-1", date: "2024-11-08", startTime: "09:00", endTime: "10:00", customerName: "John Doe", service: "Haircut" },
	{ id: "apt-2", date: "2024-11-08", startTime: "10:30", endTime: "11:30", customerName: "Jane Smith", service: "Hair Color" },
];

const MOCK_ELIGIBLE_COLLEAGUES = [
	{ id: "emp-2", name: "John Smith", matchingServices: ["Haircut", "Beard Trim"] },
	{ id: "emp-4", name: "Michael Brown", matchingServices: ["Haircut", "Hair Color"] },
];

interface SwapShiftsDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function SwapShiftsDialog({ open, onOpenChange }: SwapShiftsDialogProps) {
	const [step, setStep] = useState(1);
	const [swapType, setSwapType] = useState<SwapType>("days");
	const [selectedDates, setSelectedDates] = useState<Date[]>([]);
	const [selectedAppointmentIds, setSelectedAppointmentIds] = useState<string[]>([]);
	const [selectedColleagueIds, setSelectedColleagueIds] = useState<string[]>([]);
	const [reason, setReason] = useState("");

	useEffect(() => {
		if (!open) setTimeout(() => { setStep(1); setSwapType("days"); setSelectedDates([]); setSelectedAppointmentIds([]); setSelectedColleagueIds([]); setReason(""); }, 300);
	}, [open]);

	const eligibleColleagues = useMemo(() => MOCK_ELIGIBLE_COLLEAGUES, []);

	const handleClose = () => onOpenChange(false);
	const handleNext = () => setStep((prev) => prev + 1);
	const handleBack = () => setStep((prev) => Math.max(1, prev - 1));
	const handleSubmit = () => { console.log("Swap shift request submitted"); handleClose(); };

	const canProceedFromStep2 = (swapType === "days" && selectedDates.length > 0) || (swapType === "appointments" && selectedAppointmentIds.length > 0);
	const canProceedFromStep3 = selectedColleagueIds.length > 0;

	const getStepTitle = () => {
		const titles = ["Select Swap Type", swapType === "days" ? "Select Days" : "Select Appointments", "Select Colleagues", "Review & Submit"];
		return titles[step - 1] || "";
	};

	const getStepDescription = () => {
		const descriptions = [
			"Choose whether to swap full days or specific appointments",
			swapType === "days" ? "Select the days you want to give away" : "Select the appointments you want to swap",
			"Choose colleagues to send the swap request to",
			"Review and submit your swap request"
		];
		return descriptions[step - 1] || "";
	};

	const footer = step < 4 ? (
		<div className="flex gap-3 w-full">
			{step > 1 ? (
				<>
					<Button variant="outline" onClick={handleBack} size="lg" className="w-32">Back</Button>
					<Button onClick={handleNext} disabled={(step === 2 && !canProceedFromStep2) || (step === 3 && !canProceedFromStep3)} size="lg" className="flex-1">Continue</Button>
				</>
			) : (
				<>
					<Button variant="outline" onClick={handleClose} size="lg" className="w-32">Cancel</Button>
					<Button onClick={handleNext} size="lg" className="flex-1">Continue</Button>
				</>
			)}
		</div>
	) : (
		<div className="flex gap-3 w-full">
			<Button variant="outline" onClick={handleBack} size="lg" className="w-32">Back</Button>
			<Button onClick={handleSubmit} size="lg" className="flex-1"><Send className="h-4 w-4 mr-2" />Send Request</Button>
		</div>
	);

	return (
		<ResponsiveDialog open={open} onOpenChange={handleClose} title={getStepTitle()} description={getStepDescription()} footer={footer} className="sm:max-w-2xl">
			<div className="space-y-6">
				{/* Step 1: Select Swap Type */}
				{step === 1 && (
					<RadioGroup value={swapType} onValueChange={(value) => setSwapType(value as SwapType)}>
						<div className="grid grid-cols-2 gap-3">
							{(["days", "appointments"] as SwapType[]).map((type) => (
								<Card key={type} className={cn("relative cursor-pointer transition-all", swapType === type ? "border-primary ring-2 ring-primary/20" : "hover:border-primary/50")}>
									<label className="flex items-center gap-3 p-4 cursor-pointer">
										<RadioGroupItem value={type} id={type} className="mt-0.5" />
										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-2 mb-1">
												<div className={cn("p-1.5 rounded-lg", type === "days" ? "bg-blue-500/10" : "bg-purple-500/10")}>
													{type === "days" ? <CalendarDays className="h-4 w-4 text-blue-600 dark:text-blue-500" /> : <Clock className="h-4 w-4 text-purple-600 dark:text-purple-500" />}
												</div>
												<span className="font-medium text-sm">{type === "days" ? "Full Days" : "Appointments"}</span>
											</div>
											<p className="text-xs text-muted-foreground">{type === "days" ? "Swap entire work days" : "Swap specific appointments"}</p>
										</div>
									</label>
								</Card>
							))}
						</div>
					</RadioGroup>
				)}

				{/* Step 2: Select What to Give Away */}
				{step === 2 && (
					<>
						{swapType === "days" ? (
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
										day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
										day_today: "bg-accent text-accent-foreground",
										day_outside: "text-muted-foreground opacity-50",
										day_disabled: "text-muted-foreground opacity-50",
										day_hidden: "invisible",
									}}
								/>
								{selectedDates.length > 0 && (
									<div className="space-y-2">
										<div className="flex items-center justify-between">
											<span className="text-sm font-medium">{selectedDates.length} {selectedDates.length === 1 ? "day" : "days"} selected</span>
											<Button type="button" variant="ghost" size="sm" onClick={() => setSelectedDates([])} className="h-8">Clear all</Button>
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
							<ScrollArea className="h-[280px] rounded-lg border">
								<div className="p-3 space-y-2">
									{MOCK_UPCOMING_APPOINTMENTS.map((apt) => {
										const isSelected = selectedAppointmentIds.includes(apt.id);
										return (
											<Card key={apt.id} className={cn("cursor-pointer transition-all", isSelected ? "border-purple-500/50 bg-purple-500/5" : "hover:border-purple-500/30 hover:bg-accent/50")}>
												<div className="flex items-start gap-3 p-3">
													<Checkbox checked={isSelected} onCheckedChange={() => setSelectedAppointmentIds(prev => prev.includes(apt.id) ? prev.filter(id => id !== apt.id) : [...prev, apt.id])} className="mt-0.5" />
													<div className="flex-1 min-w-0">
														<div className="flex items-center gap-2 mb-1">
															<CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
															<span className="text-sm font-medium">{new Date(apt.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
															<Clock className="h-3.5 w-3.5 text-muted-foreground ml-2" />
															<span className="text-sm text-muted-foreground">{apt.startTime} - {apt.endTime}</span>
														</div>
														<p className="text-sm font-medium">{apt.customerName}</p>
														<p className="text-xs text-muted-foreground">{apt.service}</p>
													</div>
													{isSelected && <CheckCircle2 className="h-5 w-5 text-purple-600 dark:text-purple-500 flex-shrink-0" />}
												</div>
											</Card>
										);
									})}
								</div>
							</ScrollArea>
						)}
					</>
				)}

				{/* Step 3: Select Colleagues */}
				{step === 3 && (
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<Users className="h-5 w-5 text-muted-foreground" />
							<Label className="text-base">Send Request To</Label>
						</div>
						<p className="text-sm text-muted-foreground">Select one or more colleagues. The first to accept will cover your shift.</p>
						<ScrollArea className="h-[280px] rounded-lg border">
							<div className="p-3 space-y-2">
								{eligibleColleagues.map((colleague) => {
									const isSelected = selectedColleagueIds.includes(colleague.id);
									return (
										<Card key={colleague.id} className={cn("cursor-pointer transition-all", isSelected ? "border-green-500/50 bg-green-500/5" : "hover:border-green-500/30 hover:bg-accent/50")}>
											<div className="flex items-start gap-3 p-3">
												<Checkbox checked={isSelected} onCheckedChange={() => setSelectedColleagueIds(prev => prev.includes(colleague.id) ? prev.filter(id => id !== colleague.id) : [...prev, colleague.id])} className="mt-0.5" />
												<div className="flex-1 min-w-0">
													<div className="flex items-center gap-2 mb-1">
														<User className="h-4 w-4 text-muted-foreground" />
														<span className="text-sm font-medium">{colleague.name}</span>
													</div>
													<div className="flex items-center gap-1.5 flex-wrap">
														<Sparkles className="h-3 w-3 text-muted-foreground" />
														<span className="text-xs text-muted-foreground">{colleague.matchingServices.join(", ")}</span>
													</div>
												</div>
												{isSelected && <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500 flex-shrink-0" />}
											</div>
										</Card>
									);
								})}
							</div>
						</ScrollArea>
					</div>
				)}

				{/* Step 4: Review & Submit */}
				{step === 4 && (
					<div className="space-y-4">
						<Card className="p-4">
							<div className="flex items-center gap-3">
								<div className={cn("p-2.5 rounded-lg", swapType === "days" ? "bg-blue-500/10" : "bg-purple-500/10")}>
									{swapType === "days" ? <CalendarDays className="h-5 w-5 text-blue-600 dark:text-blue-500" /> : <Clock className="h-5 w-5 text-purple-600 dark:text-purple-500" />}
								</div>
								<div className="flex-1">
									<p className="text-xs text-muted-foreground">Swap Type</p>
									<p className="font-semibold">{swapType === "days" ? "Full Days" : "Specific Appointments"}</p>
								</div>
								<CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500" />
							</div>
						</Card>

						<Card className="p-4">
							<p className="text-xs text-muted-foreground mb-2">What You're Giving Away</p>
							<div className="space-y-1">
								{swapType === "days" ? (
									selectedDates.map((date) => (
										<div key={date.toISOString()} className="flex items-center gap-2">
											<Badge variant="secondary">{format(date, "MMM d")}</Badge>
											<span className="text-sm">{format(date, "EEEE, yyyy")}</span>
										</div>
									))
								) : (
									selectedAppointmentIds.map((id) => {
										const apt = MOCK_UPCOMING_APPOINTMENTS.find(a => a.id === id);
										return apt ? (
											<div key={id} className="flex items-center gap-2">
												<Badge variant="secondary">{apt.startTime}</Badge>
												<span className="text-sm">{apt.customerName} - {apt.service}</span>
											</div>
										) : null;
									})
								)}
							</div>
						</Card>

						<Card className="p-4">
							<p className="text-xs text-muted-foreground mb-2">Sending To</p>
							<div className="flex flex-wrap gap-2">
								{selectedColleagueIds.map((id) => {
									const colleague = eligibleColleagues.find(c => c.id === id);
									return colleague ? <Badge key={id} variant="outline">{colleague.name}</Badge> : null;
								})}
							</div>
						</Card>

						<div className="space-y-2">
							<Label htmlFor="reason" className="text-base">Reason <span className="text-xs text-muted-foreground">(Optional)</span></Label>
							<Textarea id="reason" placeholder="e.g., Personal commitment, family event..." value={reason} onChange={(e) => setReason(e.target.value)} rows={3} className="resize-none" />
						</div>

						<div className="flex items-start gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
							<Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
							<p className="text-xs text-blue-700 dark:text-blue-400">
								{selectedColleagueIds.length === 1
									? "Your request will be sent to the selected colleague for approval."
									: `Your request will be sent to ${selectedColleagueIds.length} colleagues. The first to accept will cover your shift.`}
							</p>
						</div>
					</div>
				)}
			</div>
		</ResponsiveDialog>
	);
}
