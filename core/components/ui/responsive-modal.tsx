import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ResponsiveModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title?: string;
	description?: string;
	children: React.ReactNode;
	className?: string;
	showHeader?: boolean;
}

/**
 * Responsive modal component
 * - Mobile: Bottom sheet (slides up from bottom, full width)
 * - Desktop: Centered modal (standard dialog)
 */
export function ResponsiveModal({
	open,
	onOpenChange,
	title,
	description,
	children,
	className,
	showHeader = true,
}: ResponsiveModalProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				className={cn(
					// Base styles
					"p-0 gap-0",
					// Mobile: Bottom sheet
					"max-sm:fixed max-sm:bottom-0 max-sm:left-0 max-sm:right-0 max-sm:top-auto",
					"max-sm:translate-x-0 max-sm:translate-y-0",
					"max-sm:rounded-t-xl max-sm:rounded-b-none",
					"max-sm:border-t max-sm:border-x-0 max-sm:border-b-0",
					"max-sm:data-[state=closed]:slide-out-to-bottom max-sm:data-[state=open]:slide-in-from-bottom",
					"max-sm:max-h-[85vh]",
					// Desktop: Centered modal
					"sm:max-w-lg",
					className,
				)}
			>
				{showHeader && (title || description) && (
					<DialogHeader className="p-6 pb-4">
						{title && <DialogTitle>{title}</DialogTitle>}
						{description && <DialogDescription>{description}</DialogDescription>}
					</DialogHeader>
				)}
				{children}
			</DialogContent>
		</Dialog>
	);
}

/**
 * Responsive modal body with scrollable content
 */
export function ResponsiveModalBody({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"overflow-y-auto",
				"px-6 py-4",
				// Mobile: Account for bottom sheet height
				"max-sm:max-h-[calc(85vh-120px)]",
				// Desktop: Reasonable max height
				"sm:max-h-[60vh]",
				className,
			)}
		>
			{children}
		</div>
	);
}

/**
 * Responsive modal footer with actions
 */
export function ResponsiveModalFooter({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"border-t p-6 pt-4",
				"flex flex-col sm:flex-row gap-2 sm:gap-3",
				"bg-background",
				// Mobile: Sticky footer
				"max-sm:sticky max-sm:bottom-0",
				className,
			)}
		>
			{children}
		</div>
	);
}
