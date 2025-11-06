import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ResponsiveDialog } from "@/components/shared/responsive-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BadgeFilters } from "@/features/core/components/shared/badge-filters";
import {
	FileText,
	Palmtree,
	Thermometer,
	Heart,
	Calendar,
	Clock,
	Package,
	GraduationCap,
	Send,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
		icon: typeof FileText;
		color: string;
		requiresDate: boolean;
		requiresDateRange: boolean;
		description: string;
		placeholder: string;
	}
> = {
	"day-off": {
		label: "Day Off",
		icon: Calendar,
		color: "text-blue-600 dark:text-blue-500 border-blue-500/30 hover:bg-blue-500/10",
		requiresDate: true,
		requiresDateRange: false,
		description: "Request a single day off",
		placeholder: "e.g., Personal appointment, family event...",
	},
	vacation: {
		label: "Vacation",
		icon: Palmtree,
		color: "text-green-600 dark:text-green-500 border-green-500/30 hover:bg-green-500/10",
		requiresDate: true,
		requiresDateRange: true,
		description: "Request vacation time (multiple days)",
		placeholder: "e.g., Family vacation, travel plans...",
	},
	"sick-leave": {
		label: "Sick Leave",
		icon: Thermometer,
		color: "text-red-600 dark:text-red-500 border-red-500/30 hover:bg-red-500/10",
		requiresDate: true,
		requiresDateRange: false,
		description: "Report sick leave",
		placeholder: "e.g., Flu symptoms, doctor appointment...",
	},
	"personal-day": {
		label: "Personal Day",
		icon: Heart,
		color: "text-purple-600 dark:text-purple-500 border-purple-500/30 hover:bg-purple-500/10",
		requiresDate: true,
		requiresDateRange: false,
		description: "Request a personal day",
		placeholder: "e.g., Personal matters, family time...",
	},
	bereavement: {
		label: "Bereavement",
		icon: Heart,
		color: "text-gray-600 dark:text-gray-500 border-gray-500/30 hover:bg-gray-500/10",
		requiresDate: true,
		requiresDateRange: true,
		description: "Request bereavement leave",
		placeholder: "e.g., Family member passed away...",
	},
	"schedule-change": {
		label: "Schedule Change",
		icon: Clock,
		color: "text-orange-600 dark:text-orange-500 border-orange-500/30 hover:bg-orange-500/10",
		requiresDate: false,
		requiresDateRange: false,
		description: "Request a permanent or temporary schedule change",
		placeholder: "e.g., Start 1 hour later on Wednesdays, enrolled in course...",
	},
	"equipment-request": {
		label: "Equipment",
		icon: Package,
		color: "text-cyan-600 dark:text-cyan-500 border-cyan-500/30 hover:bg-cyan-500/10",
		requiresDate: false,
		requiresDateRange: false,
		description: "Request new equipment or supplies",
		placeholder: "e.g., Need new styling chair, equipment malfunction...",
	},
	"training-request": {
		label: "Training",
		icon: GraduationCap,
		color: "text-indigo-600 dark:text-indigo-500 border-indigo-500/30 hover:bg-indigo-500/10",
		requiresDate: false,
		requiresDateRange: false,
		description: "Request training or professional development",
		placeholder: "e.g., Advanced techniques workshop, certification renewal...",
	},
};

// Form schema
const requestFormSchema = z
	.object({
		type: z.enum(REQUEST_TYPES),
		startDate: z.string().optional(),
		endDate: z.string().optional(),
		reason: z.string().optional(),
	})
	.refine(
		(data) => {
			const config = REQUEST_CONFIG[data.type];
			if (config.requiresDate && !data.startDate) {
				return false;
			}
			return true;
		},
		{
			message: "Start date is required for this request type",
			path: ["startDate"],
		}
	)
	.refine(
		(data) => {
			const config = REQUEST_CONFIG[data.type];
			if (config.requiresDateRange && !data.endDate) {
				return false;
			}
			return true;
		},
		{
			message: "End date is required for this request type",
			path: ["endDate"],
		}
	);

type RequestFormData = z.infer<typeof requestFormSchema>;

interface RequestDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function RequestDialog({ open, onOpenChange }: RequestDialogProps) {
	const [selectedType, setSelectedType] = useState<RequestType>("day-off");
	const config = REQUEST_CONFIG[selectedType];

	const {
		register,
		handleSubmit,
		setValue,
		reset,
		watch,
		formState: { errors, isValid },
	} = useForm<RequestFormData>({
		resolver: zodResolver(requestFormSchema),
		mode: "onChange",
		defaultValues: {
			type: "day-off",
			startDate: "",
			endDate: "",
			reason: "",
		},
	});

	// Update form when type changes
	useEffect(() => {
		setValue("type", selectedType, { shouldValidate: true });
		// Reset dates when switching to non-date request types
		if (!config.requiresDate) {
			setValue("startDate", "");
			setValue("endDate", "");
		}
	}, [selectedType, setValue, config.requiresDate]);

	const onSubmit = (data: RequestFormData) => {
		console.log("Request submitted:", data);
		// TODO: Send request to backend
		handleClose();
	};

	const handleClose = () => {
		reset();
		setSelectedType("day-off");
		onOpenChange(false);
	};

	// Create filter options for BadgeFilters
	const filterOptions = REQUEST_TYPES.map((type) => ({
		value: type,
		label: REQUEST_CONFIG[type].label,
		color: REQUEST_CONFIG[type].color,
	}));

	return (
		<ResponsiveDialog
			open={open}
			onOpenChange={handleClose}
			title="Submit Request"
			footer={
				<div className="flex gap-2 w-full">
					<Button type="button" variant="outline" onClick={handleClose} className="flex-1">
						Cancel
					</Button>
					<Button type="submit" form="request-form" className="flex-1" disabled={!isValid}>
						<Send className="h-4 w-4 mr-2" />
						Submit
					</Button>
				</div>
			}
			className="sm:max-w-lg"
		>
			<form id="request-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				{/* Request Type Selection */}
				<div className="space-y-2">
					<Label>Request Type</Label>
					<BadgeFilters
						filters={filterOptions}
						selectedValue={selectedType}
						onSelect={(value) => setSelectedType(value)}
					/>
					<p className="text-xs text-muted-foreground flex items-start gap-1.5">
						<config.icon className={cn("h-3.5 w-3.5 mt-0.5", config.color.split(" ")[0])} />
						{config.description}
					</p>
				</div>

				{/* Date Fields - Conditionally shown */}
				{config.requiresDate && (
					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="startDate">
								{config.requiresDateRange ? "Start Date" : "Date"}{" "}
								<span className="text-red-500">*</span>
							</Label>
							<Input
								id="startDate"
								type="date"
								{...register("startDate")}
								className={errors.startDate ? "border-red-500" : ""}
							/>
							{errors.startDate && (
								<p className="text-xs text-red-500">{errors.startDate.message}</p>
							)}
						</div>

						{config.requiresDateRange && (
							<div className="space-y-2">
								<Label htmlFor="endDate">
									End Date <span className="text-red-500">*</span>
								</Label>
								<Input
									id="endDate"
									type="date"
									{...register("endDate")}
									className={errors.endDate ? "border-red-500" : ""}
								/>
								{errors.endDate && (
									<p className="text-xs text-red-500">{errors.endDate.message}</p>
								)}
							</div>
						)}
					</div>
				)}

				{/* Reason/Note Field */}
				<div className="space-y-2">
					<Label htmlFor="reason">
						Reason or Note <span className="text-muted-foreground text-xs">(Optional)</span>
					</Label>
					<Textarea
						id="reason"
						placeholder={config.placeholder}
						{...register("reason")}
						rows={4}
						className="resize-none"
					/>
				</div>

				{/* Info Banner */}
				<div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
					<p className="text-xs text-blue-700 dark:text-blue-400">
						Your request will be sent to management for review. You'll be notified once it's
						approved or rejected.
					</p>
				</div>
			</form>
		</ResponsiveDialog>
	);
}
