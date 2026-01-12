'use client';

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface TimeSlot {
	label: string;
	// Intensity values for each day (Mon-Sun), 0-4 scale
	days: number[];
}

interface FocusHeatmapProps {
	data: TimeSlot[];
	mostProductiveTime: string;
}

const INTENSITY_CLASSES = [
	'bg-primary/5',
	'bg-primary/20',
	'bg-primary/40',
	'bg-primary/80',
	'bg-primary',
];

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export function FocusHeatmap({
	data,
	mostProductiveTime,
}: FocusHeatmapProps): React.ReactElement {
	return (
		<Card className="border border-border bg-card p-8 flex flex-col">
			<CardHeader className="p-0 mb-6">
				<CardTitle className="text-xl uppercase tracking-widest font-light">
					Session Intensity
				</CardTitle>
			</CardHeader>
			<CardContent className="p-0 flex-1 flex flex-col">
				{/* Day headers */}
				<div className="flex items-center gap-4 mb-2">
					<span className="w-16" />
					<div className="flex-1 flex gap-1">
						{DAYS.map((day, i) => (
							<div
								key={i}
								className="flex-1 text-center text-xs text-muted-foreground"
							>
								{day}
							</div>
						))}
					</div>
				</div>

				{/* Time rows */}
				<div className="space-y-2 flex-1">
					{data.map((slot, rowIndex) => (
						<div
							key={rowIndex}
							className="flex items-center gap-4"
						>
							<span className="w-16 text-xs uppercase text-muted-foreground text-right">
								{slot.label}
							</span>
							<div className="flex-1 flex gap-1 h-8">
								{slot.days.map(
									(intensity, dayIndex) => (
										<div
											key={dayIndex}
											className={cn(
												'flex-1',
												INTENSITY_CLASSES[
													intensity
												]
											)}
										/>
									)
								)}
							</div>
						</div>
					))}
				</div>

				{/* Footer stat */}
				<div className="mt-6 pt-6 border-t border-border">
					<div className="flex items-center justify-between text-sm">
						<span className="text-muted-foreground">
							Most Productive
						</span>
						<span className="font-medium text-primary">
							{mostProductiveTime}
						</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
