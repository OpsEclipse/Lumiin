'use client';

import { Timer, TrendUp } from '@phosphor-icons/react';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

interface SessionDurationCardProps {
	avgDuration: number;
}

export function SessionDurationCard({
	avgDuration,
}: SessionDurationCardProps): React.ReactElement {
	// Calculate circle stroke based on max expected duration (e.g. 90 mins)
	const max = 90;
	const percentage = Math.min((avgDuration / max) * 100, 100);
	const radius = 45;
	const circumference = 2 * Math.PI * radius;
	const offset = circumference - (percentage / 100) * circumference;

	return (
		<Card className="border border-border bg-card p-6 flex flex-col h-full">
			<CardHeader className="p-0 mb-6 flex flex-row items-center justify-between space-y-0">
				<CardTitle className="text-sm uppercase tracking-widest text-muted-foreground font-medium">
					Avg. Session Duration
				</CardTitle>
				<Timer size={20} className="text-primary" />
			</CardHeader>
			<CardContent className="p-0 flex-1 flex flex-col items-center justify-center relative min-h-[160px]">
				<div className="relative w-40 h-40">
					<svg
						className="w-full h-full transform -rotate-90"
						viewBox="0 0 100 100"
					>
						<circle
							cx="50"
							cy="50"
							r={radius}
							fill="transparent"
							stroke="var(--muted)"
							strokeWidth="8"
						/>
						<circle
							cx="50"
							cy="50"
							r={radius}
							fill="transparent"
							stroke="#F59E0B"
							strokeWidth="8"
							strokeDasharray={circumference}
							strokeDashoffset={offset}
							strokeLinecap="round"
						/>
					</svg>
					<div className="absolute inset-0 flex flex-col items-center justify-center">
						<span className="text-4xl font-light font-display text-foreground">
							{avgDuration}
						</span>
						<span className="text-xs text-muted-foreground uppercase tracking-widest">
							Min
						</span>
					</div>
				</div>
				<div className="mt-4 text-center">
					<span className="text-xs text-emerald-500 flex items-center justify-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full">
						<TrendUp weight="bold" /> Consistent
					</span>
				</div>
			</CardContent>
		</Card>
	);
}
