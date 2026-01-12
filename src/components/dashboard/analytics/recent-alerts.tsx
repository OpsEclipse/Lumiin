'use client';

import { Warning, Star, Info } from '@phosphor-icons/react';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert } from '@/lib/analytics-data';
import { cn } from '@/lib/utils';

interface RecentAlertsProps {
	alerts: Alert[];
}

export function RecentAlerts({
	alerts,
}: RecentAlertsProps): React.ReactElement {
	return (
		<Card className="border border-border bg-card p-8 h-full">
			<CardHeader className="p-0 mb-6 flex flex-row items-center justify-between space-y-0">
				<CardTitle className="text-xl font-display uppercase tracking-widest font-light">
					Recent Alerts
				</CardTitle>
				<Button
					variant="outline"
					size="sm"
					className="text-xs uppercase"
				>
					Clear
				</Button>
			</CardHeader>
			<CardContent className="p-0 space-y-4">
				{alerts.length === 0 ? (
					<div className="text-center py-8 text-muted-foreground text-sm">
						No recent alerts.
					</div>
				) : (
					alerts.map((alert) => {
						const isWarning = alert.type === 'warning';
						const isSuccess = alert.type === 'success';

						return (
							<div
								key={alert.id}
								className={cn(
									'flex gap-4 items-start p-4 border transition-colors',
									isWarning
										? 'bg-destructive/5 border-destructive/20'
										: isSuccess
											? 'bg-primary/5 border-primary/20'
											: 'bg-muted/30 border-border'
								)}
							>
								{isWarning ? (
									<Warning
										size={20}
										weight="fill"
										className="text-destructive mt-0.5"
									/>
								) : isSuccess ? (
									<Star
										size={20}
										weight="fill"
										className="text-primary mt-0.5"
									/>
								) : (
									<Info
										size={20}
										weight="fill"
										className="text-accent mt-0.5"
									/>
								)}
								<div>
									<h4
										className={cn(
											'text-sm font-medium',
											isWarning
												? 'text-destructive'
												: isSuccess
													? 'text-primary'
													: 'text-foreground'
										)}
									>
										{alert.title}
									</h4>
									<p className="text-xs text-muted-foreground mt-1 leading-relaxed">
										{alert.message}
									</p>
									<span className="text-[10px] text-muted-foreground/70 mt-2 block uppercase tracking-wide">
										{alert.time}
									</span>
								</div>
							</div>
						);
					})
				)}
			</CardContent>
		</Card>
	);
}
