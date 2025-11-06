import { useState } from "react";
import { ResponsiveDialog } from "@/components/shared/responsive-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload, X, Image as ImageIcon, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface PhotoUploadProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function PhotoUpload({ open, onOpenChange }: PhotoUploadProps) {
	const [beforePhoto, setBeforePhoto] = useState<string | null>(null);
	const [afterPhoto, setAfterPhoto] = useState<string | null>(null);

	const handlePhotoCapture = (type: "before" | "after") => {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = "image/*";
		input.capture = "environment";

		input.onchange = (e) => {
			const file = (e.target as HTMLInputElement).files?.[0];
			if (file) {
				const reader = new FileReader();
				reader.onload = (e) => {
					const result = e.target?.result as string;
					if (type === "before") {
						setBeforePhoto(result);
					} else {
						setAfterPhoto(result);
					}
				};
				reader.readAsDataURL(file);
			}
		};

		input.click();
	};

	const removePhoto = (type: "before" | "after") => {
		if (type === "before") {
			setBeforePhoto(null);
		} else {
			setAfterPhoto(null);
		}
	};

	const handleSubmit = () => {
		if (beforePhoto || afterPhoto) {
			console.log("Uploading photos:", { beforePhoto, afterPhoto });
			handleClose();
		}
	};

	const handleClose = () => {
		setBeforePhoto(null);
		setAfterPhoto(null);
		onOpenChange(false);
	};

	const footer = (
		<div className="flex gap-3 w-full">
			<Button variant="outline" onClick={handleClose} size="lg" className="w-32">
				Cancel
			</Button>
			<Button
				onClick={handleSubmit}
				disabled={!beforePhoto && !afterPhoto}
				className="flex-1 bg-green-600 hover:bg-green-700 text-white"
				size="lg"
			>
				<Upload className="h-4 w-4 mr-2" />
				Upload Photos
			</Button>
		</div>
	);

	return (
		<ResponsiveDialog
			open={open}
			onOpenChange={handleClose}
			title="Before & After Photos"
			description="Capture photos to document the job completion"
			footer={footer}
			className="sm:max-w-lg"
		>
			<div className="space-y-4">
				{/* Before Photo */}
				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<p className="text-sm font-medium">Before Photo</p>
						<Badge variant="outline" className="text-xs">
							Optional
						</Badge>
					</div>
					{beforePhoto ? (
						<div className="relative group">
							<img src={beforePhoto} alt="Before" className="w-full h-48 object-cover rounded-lg border" />
							<Button
								variant="destructive"
								size="icon"
								className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
								onClick={() => removePhoto("before")}
								type="button"
							>
								<X className="h-4 w-4" />
							</Button>
						</div>
					) : (
						<button
							type="button"
							onClick={() => handlePhotoCapture("before")}
							className={cn(
								"w-full h-48 border-2 border-dashed rounded-lg",
								"flex flex-col items-center justify-center gap-3",
								"hover:border-primary hover:bg-primary/5 transition-colors",
								"text-muted-foreground hover:text-primary"
							)}
						>
							<Camera className="h-8 w-8" />
							<div className="text-center">
								<p className="text-sm font-medium">Take Before Photo</p>
								<p className="text-xs">Tap to open camera</p>
							</div>
						</button>
					)}
				</div>

				{/* After Photo */}
				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<p className="text-sm font-medium">After Photo</p>
						<Badge variant="outline" className="text-xs">
							Optional
						</Badge>
					</div>
					{afterPhoto ? (
						<div className="relative group">
							<img src={afterPhoto} alt="After" className="w-full h-48 object-cover rounded-lg border" />
							<Button
								variant="destructive"
								size="icon"
								className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
								onClick={() => removePhoto("after")}
								type="button"
							>
								<X className="h-4 w-4" />
							</Button>
						</div>
					) : (
						<button
							type="button"
							onClick={() => handlePhotoCapture("after")}
							className={cn(
								"w-full h-48 border-2 border-dashed rounded-lg",
								"flex flex-col items-center justify-center gap-3",
								"hover:border-primary hover:bg-primary/5 transition-colors",
								"text-muted-foreground hover:text-primary"
							)}
						>
							<Camera className="h-8 w-8" />
							<div className="text-center">
								<p className="text-sm font-medium">Take After Photo</p>
								<p className="text-xs">Tap to open camera</p>
							</div>
						</button>
					)}
				</div>

				{/* Status Banner */}
				{(beforePhoto || afterPhoto) && (
					<div className="flex items-start gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
						<ImageIcon className="h-5 w-5 text-green-600 dark:text-green-500 flex-shrink-0 mt-0.5" />
						<p className="text-xs text-green-700 dark:text-green-400">
							{beforePhoto && afterPhoto
								? "Both photos captured successfully"
								: "One photo captured. You can add the other one if needed."}
						</p>
					</div>
				)}

				{/* Info Banner */}
				{!beforePhoto && !afterPhoto && (
					<div className="flex items-start gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
						<Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
						<p className="text-xs text-blue-700 dark:text-blue-400">
							Photos are valuable for client records and quality assurance. Both are optional but recommended.
						</p>
					</div>
				)}
			</div>
		</ResponsiveDialog>
	);
}
