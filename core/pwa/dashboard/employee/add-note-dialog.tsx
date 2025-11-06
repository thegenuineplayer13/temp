import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResponsiveDialog } from "@/components/shared/responsive-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { FileText, User, CheckCircle2, Flag, TrendingUp, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NoteForm, NoteType } from "@/features/core/types/types.dashboard-employee";
import { noteFormSchema } from "@/features/core/schemas/schemas.dashboard-employee";

interface AddNoteDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	noteType?: NoteType;
}

const NOTE_CONFIG = {
	job: {
		title: "Job Note",
		description: "Record observations about the current job",
		placeholder: "e.g., Used two bottles of shampoo, client requested extra conditioning...",
		icon: FileText,
		color: "text-primary",
		bgColor: "bg-primary/10",
		templates: ["Used extra product as needed", "Service took longer than expected", "Client very satisfied with results"],
	},
	client: {
		title: "Client Note",
		description: "Add a note to the client's profile",
		placeholder: "e.g., Prefers morning appointments, sensitive to strong scents...",
		icon: User,
		color: "text-primary",
		bgColor: "bg-primary/10",
		templates: [],
	},
	completion: {
		title: "Completion Notes",
		description: "Document what was completed",
		placeholder: "e.g., Completed full service, recommended follow-up in 3 weeks...",
		icon: CheckCircle2,
		color: "text-primary",
		bgColor: "bg-primary/10",
		templates: [],
	},
	issue: {
		title: "Flag Issue",
		description: "Report a problem requiring attention",
		placeholder: "e.g., Equipment malfunction, customer complaint, safety concern...",
		icon: Flag,
		color: "text-red-600 dark:text-red-500",
		bgColor: "bg-red-500/10",
		templates: [],
	},
	upsell: {
		title: "Upsell Opportunity",
		description: "Record customer interest in additional services",
		placeholder: "e.g., Client interested in premium package, asked about hair treatment...",
		icon: TrendingUp,
		color: "text-green-600 dark:text-green-500",
		bgColor: "bg-green-500/10",
		templates: ["Client interested in premium service", "Asked about additional treatments", "Interested in product purchase"],
	},
} as const;

const NOTE_TYPES: NoteType[] = ["job", "client", "completion", "issue", "upsell"];

export function AddNoteDialog({ open, onOpenChange, noteType: initialNoteType = "job" }: AddNoteDialogProps) {
	const [step, setStep] = useState(1);
	const [selectedNoteType, setSelectedNoteType] = useState<NoteType>(initialNoteType);

	const config = NOTE_CONFIG[selectedNoteType];

	const {
		register,
		handleSubmit,
		setValue,
		reset,
		watch,
		formState: { errors },
	} = useForm<NoteForm>({
		resolver: zodResolver(noteFormSchema),
		defaultValues: {
			type: selectedNoteType,
			content: "",
		},
	});

	const content = watch("content");

	useEffect(() => {
		if (!open) {
			setTimeout(() => {
				setStep(1);
				setSelectedNoteType(initialNoteType);
				reset();
			}, 300);
		}
	}, [open, initialNoteType, reset]);

	useEffect(() => {
		setValue("type", selectedNoteType);
	}, [selectedNoteType, setValue]);

	const onSubmit = (data: NoteForm) => {
		console.log(`${data.type} note:`, data.content);
		handleClose();
	};

	const handleClose = () => {
		reset();
		onOpenChange(false);
	};

	const handleNext = () => setStep(2);
	const handleBack = () => setStep(1);

	const handleTemplateClick = (template: string) => {
		setValue("content", template, { shouldValidate: true });
	};

	const getStepTitle = () => (step === 1 ? "Select Note Type" : `Add ${config.title}`);
	const getStepDescription = () =>
		step === 1 ? "Choose the type of note you want to add" : config.description;

	const footer =
		step === 1 ? (
			<div className="flex gap-3 w-full">
				<Button variant="outline" onClick={handleClose} size="lg" className="w-32">
					Cancel
				</Button>
				<Button onClick={handleNext} size="lg" className="flex-1">
					Continue
				</Button>
			</div>
		) : (
			<div className="flex gap-3 w-full">
				<Button variant="outline" onClick={handleBack} size="lg" className="w-32">
					Back
				</Button>
				<Button
					onClick={handleSubmit(onSubmit)}
					disabled={!content}
					size="lg"
					className={cn(
						"flex-1",
						selectedNoteType === "issue"
							? "bg-red-600 hover:bg-red-700 text-white"
							: selectedNoteType === "upsell"
							? "bg-green-600 hover:bg-green-700 text-white"
							: ""
					)}
				>
					<Send className="h-4 w-4 mr-2" />
					Save Note
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
				{/* Step 1: Select Note Type */}
				{step === 1 && (
					<RadioGroup value={selectedNoteType} onValueChange={(value) => setSelectedNoteType(value as NoteType)}>
						<div className="grid grid-cols-2 gap-3">
							{NOTE_TYPES.map((type) => {
								const typeConfig = NOTE_CONFIG[type];
								const isSelected = selectedNoteType === type;
								return (
									<Card
										key={type}
										className={cn(
											"relative cursor-pointer transition-all",
											isSelected ? "border-primary ring-2 ring-primary/20" : "hover:border-primary/50",
											type === "issue" && isSelected && "border-red-500 ring-red-500/20",
											type === "upsell" && isSelected && "border-green-500 ring-green-500/20"
										)}
									>
										<label className="flex items-center gap-3 p-4 cursor-pointer">
											<RadioGroupItem value={type} id={type} className="mt-0.5" />
											<div className="flex-1 min-w-0">
												<div className="flex items-center gap-2 mb-1">
													<div className={cn("p-1.5 rounded-lg", typeConfig.bgColor)}>
														<typeConfig.icon className={cn("h-4 w-4", typeConfig.color)} />
													</div>
													<span className="font-medium text-sm">{typeConfig.title}</span>
												</div>
												<p className="text-xs text-muted-foreground line-clamp-1">{typeConfig.description}</p>
											</div>
										</label>
									</Card>
								);
							})}
						</div>
					</RadioGroup>
				)}

				{/* Step 2: Write Note */}
				{step === 2 && (
					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="content" className="text-base">
								Note Content
							</Label>
							<Textarea
								{...register("content")}
								placeholder={config.placeholder}
								rows={8}
								className="resize-none"
								id="content"
							/>
							{errors.content && <p className="text-xs text-red-500">{errors.content.message}</p>}
						</div>

						{config.templates && config.templates.length > 0 && (
							<div className="space-y-2">
								<p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
									Quick Templates
								</p>
								<div className="flex flex-wrap gap-2">
									{config.templates.map((template) => (
										<Button
											key={template}
											type="button"
											variant="outline"
											size="sm"
											onClick={() => handleTemplateClick(template)}
										>
											{template}
										</Button>
									))}
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		</ResponsiveDialog>
	);
}
