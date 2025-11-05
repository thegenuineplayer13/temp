import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CreditCard, FileText, RefreshCw, ExternalLink, DollarSign } from "lucide-react";
import type { Alert } from "@/features/core/types/types.notifications";
import { formatDate } from "../notification-utils";

interface SystemAlertDetailProps {
	alert: Alert;
}

export function SystemAlertDetail({ alert }: SystemAlertDetailProps) {
	const metadata = alert.metadata as any;

	// Payment failed
	if (alert.type === "payment-failed") {
		return (
			<div className="space-y-6">
				{/* Payment Info */}
				<Card className="p-4">
					<div className="flex items-start gap-4">
						<div className="rounded-lg bg-red-500/10 p-3">
							<CreditCard className="h-8 w-8 text-red-600 dark:text-red-500" />
						</div>
						<div className="flex-1 space-y-3">
							{metadata?.amount && (
								<div>
									<p className="text-sm text-muted-foreground">Amount</p>
									<p className="text-2xl font-bold text-red-600 dark:text-red-500">
										${metadata.amount}
									</p>
								</div>
							)}
							{metadata?.declineReason && (
								<div className="p-2 rounded-md bg-red-500/10 border border-red-500/20 text-sm">
									<span className="font-medium text-red-600 dark:text-red-500">Reason: </span>
									<span className="text-muted-foreground">{metadata.declineReason}</span>
								</div>
							)}
						</div>
					</div>
				</Card>

				{/* Customer Info */}
				{(metadata?.customerName || alert.affectedEntities?.[0]) && (
					<Card className="p-4 space-y-3 text-sm">
						<h3 className="font-semibold">Customer Details</h3>
						<Separator />
						{(metadata?.customerName || alert.affectedEntities?.[0]?.name) && (
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground">Customer</span>
								<span className="font-semibold">
									{metadata?.customerName || alert.affectedEntities?.[0]?.name}
								</span>
							</div>
						)}
						{metadata?.customerId && (
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground">Customer ID</span>
								<span className="font-mono text-xs">{metadata.customerId}</span>
							</div>
						)}
						{metadata?.appointmentId && (
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground">Appointment</span>
								<span className="font-mono text-xs">{metadata.appointmentId}</span>
							</div>
						)}
					</Card>
				)}

				{alert.status !== "resolved" && (
					<div className="space-y-2">
						<h3 className="font-semibold">Actions</h3>
						<div className="grid gap-2">
							<Button className="w-full justify-start">
								<DollarSign className="h-4 w-4 mr-2" />
								Retry Payment
							</Button>
							<Button variant="outline" className="w-full justify-start">
								<CreditCard className="h-4 w-4 mr-2" />
								Update Payment Method
							</Button>
						</div>
					</div>
				)}
			</div>
		);
	}

	// License expiring
	if (alert.type === "license-expiring") {
		return (
			<div className="space-y-6">
				<Card className="p-4 space-y-4">
					<div className="flex items-start gap-4">
						<div className="rounded-lg bg-orange-500/10 p-3">
							<FileText className="h-8 w-8 text-orange-600 dark:text-orange-500" />
						</div>
						<div className="flex-1">
							<h3 className="font-semibold text-lg">
								{metadata?.licenseType || "License"}
							</h3>
							{alert.affectedEntities?.[0] && (
								<p className="text-sm text-muted-foreground mt-1">
									{alert.affectedEntities[0].name}
								</p>
							)}
						</div>
					</div>

					<Separator />

					<div className="space-y-3 text-sm">
						{metadata?.employeeName && (
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground">Employee</span>
								<span className="font-semibold">{metadata.employeeName}</span>
							</div>
						)}
						{metadata?.expiryDate && (
							<>
								<Separator />
								<div className="flex items-center justify-between">
									<span className="text-muted-foreground">Expiry Date</span>
									<span className="font-semibold text-orange-600 dark:text-orange-500">
										{formatDate(metadata.expiryDate)}
									</span>
								</div>
							</>
						)}
					</div>
				</Card>

				{alert.status !== "resolved" && metadata?.renewalUrl && (
					<div className="space-y-2">
						<h3 className="font-semibold">Actions</h3>
						<div className="grid gap-2">
							<Button className="w-full justify-start" asChild>
								<a href={metadata.renewalUrl} target="_blank" rel="noopener noreferrer">
									<ExternalLink className="h-4 w-4 mr-2" />
									Renew License
								</a>
							</Button>
						</div>
					</div>
				)}
			</div>
		);
	}

	// System update
	if (alert.type === "system-update") {
		return (
			<div className="space-y-6">
				<Card className="p-4">
					<div className="flex items-start gap-4">
						<div className="rounded-lg bg-blue-500/10 p-3">
							<RefreshCw className="h-8 w-8 text-blue-600 dark:text-blue-500" />
						</div>
						<div className="flex-1 space-y-3">
							{metadata?.version && (
								<div>
									<p className="text-sm text-muted-foreground">Version</p>
									<Badge variant="secondary" className="font-mono mt-1">
										v{metadata.version}
									</Badge>
								</div>
							)}
							{metadata?.releaseNotes && (
								<div>
									<p className="text-sm text-muted-foreground mb-1">What's New</p>
									<p className="text-sm">{metadata.releaseNotes}</p>
								</div>
							)}
							{metadata?.updateSize && (
								<div className="text-sm text-muted-foreground">
									Download size: {metadata.updateSize}
								</div>
							)}
						</div>
					</div>
				</Card>

				<div className="space-y-2">
					<h3 className="font-semibold">Actions</h3>
					<div className="grid gap-2">
						<Button className="w-full justify-start">
							<RefreshCw className="h-4 w-4 mr-2" />
							Install Update
						</Button>
					</div>
				</div>
			</div>
		);
	}

	return null;
}
